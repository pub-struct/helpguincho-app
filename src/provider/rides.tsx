import { RideContext } from '@/context/ride';
import RidesService from '@/infra/services/rides';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '@/hooks/auth';
import { Audio } from 'expo-av';
import { useRouter, useRootNavigationState } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_API_KEY = 'AIzaSyCgJspzdsVuS5w6P7eAXvzW3e8vCNDcpv0';


const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; 
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};



export const RideProvider = ({ children }: { children: React.ReactNode }) => {
  const [ride, setRide] = useState<Ride | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [initialLocation, setInitialLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);

  const truckImage = require('../assets/images/winchtruck.png');
  const userImage = require('../assets/images/usericon.png');

  const { user } = useAuth();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const navigationStateRef = useRef(navigationState);
  const [showDeliveryRoute, setShowDeliveryRoute] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const handleAcceptRide = () => {
    setActiveRide(ride);
    setShowDeliveryRoute(false);
    setRide(null);
  };


  useEffect(() => {
    navigationStateRef.current = navigationState;
  }, [navigationState]);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/notification.mp3')
      );
      soundRef.current = sound;
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playNotificationSound = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
    }
  };


  const animateRideBox = () => {
    Animated.timing(slideAnim, {
      toValue: 0, 
      duration: 500, 
      useNativeDriver: true, 
    }).start();
  };


  useEffect(() => {
    if (ride) {
      playNotificationSound();
      animateRideBox(); 
    }
  }, [ride]);

  useEffect(() => {
    const loadAvailability = async () => {
      const savedAvailability = await AsyncStorage.getItem('driverAvailability');
      if (savedAvailability !== null) {
        setIsAvailable(JSON.parse(savedAvailability));
      }
    };
    loadAvailability();
  }, []);
  
  useEffect(() => {
    AsyncStorage.setItem('driverAvailability', JSON.stringify(isAvailable));
  }, [isAvailable]);

  const distance = useMemo(() => {
    if (!userLocation || !ride?.pickup_lat || !ride?.pickup_long) return 'X';
    
    const dist = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      ride.pickup_lat,
      ride.pickup_long
    );
    
    return (dist / 1000).toFixed(1) + ' KM';
  }, [userLocation, ride]);

  const { mutate } = useMutation({
    mutationKey: ['ride', ride],
    mutationFn: async () => {
      if (!ride?.id) {
        return
      }
      const res = await new RidesService().acceptRide(ride?.id)
      if (res.statusCode !== 200) {
        console.log(res.body)
        throw new Error('Erro ao aceitar corrida')
      }
    },
    onError: (error) => {
      console.error(error)
    },
    onSuccess: () => {
      setActiveRide(ride);
      setRide(null);
      console.log('Corrida aceita com sucesso')
    },
  })
  
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const currentLoc = { latitude, longitude };
      setUserLocation(currentLoc);
      setInitialLocation(currentLoc);

      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setUserLocation({ latitude, longitude });
        }
      );
      return () => subscription.remove();
    })();
  }, []);

  const ridesService = new RidesService()

  const handleRecusarCorrida = async () => {
    if (!ride?.id) return
  
    const response = await ridesService.updateRideStatus(ride.id, 'rejected')
  
    if (response.statusCode === 200) {
      setRide(null)
      Alert.alert('Corrida recusada com sucesso!')
    } else {
      Alert.alert('Erro ao recusar corrida')
    }
  }  
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {initialLocation && (
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: initialLocation.latitude,
            longitude: initialLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {userLocation && (
            <Marker coordinate={userLocation} title="Você está aqui">
              <Image 
                source={require('@/assets/images/user-location.png')} 
                style={{ width: 30, height: 30 }} 
              />
            </Marker>
          )}

          <View style={styles.newHeaderRide}>
            <View style={styles.menuButtonRide}>
              <Text style={styles.menuIconRide}>☰</Text>
            </View>
            <View style={styles.welcomeContainerRide}>
              <Text style={styles.welcomeTextRide}>Bem-vindo, {user?.full_name || 'Usuário'}</Text>
            </View>
          </View>
        </MapView>
      )}

      <RideContext.Provider value={{ ride, setRide, activeRide, setActiveRide, showDeliveryRoute, setShowDeliveryRoute, isAvailable, setIsAvailable}}>
        {!!ride ? (
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ translateY: slideAnim }], 
              },
            ]}
          >

            <View style={styles.container}>
              <View style={styles.subcontainer}>
                {/* Caixa de Urgência */}
                <View style={styles.urgenteBox}>
                  <Text style={styles.urgenteText}>Urgente!</Text>
                </View>

                {/* Imagem do caminhão */}
                <View style={styles.truckImageContainer}>
                  <Image
                    source={truckImage}
                    style={styles.truckImage}
                    resizeMode="contain" />
                </View>

                {/* Informações do motorista */}
                <View style={styles.infoContainer}>
                  <Image source={userImage} style={styles.profileImage} />
                  <View>
                    <Text style={styles.driverName}>{ride?.driver?.full_name}</Text>
                    <Text style={styles.vehicleInfo}>
                      Guincho - {ride?.driver?.vehicle?.model}
                    </Text>
                    <Text style={styles.vehicleInfo}>Placa: {ride?.driver?.vehicle?.plate}</Text>
                    <Text style={styles.distance}>{distance}</Text>
                    <Text style={styles.price}>R$ {ride?.price}</Text>
                  </View>
                </View>

                {/* Detalhes da Corrida */}
                <View style={styles.rideDetails}>
                  <Text style={styles.label}>Cliente:</Text>
                  <Text style={styles.value}>{ride?.client?.full_name}</Text>

                  <Text style={styles.label}>Veículo:</Text>
                  <Text style={styles.value}>
                    {ride?.client?.vehicle}   -   {ride?.client?.plate}
                  </Text>

                  <Text style={styles.label}>Localização do veículo:</Text>
                  <Text style={styles.value}>{ride?.pickup_location}</Text>

                  <Text style={styles.label}>Local de entrega:</Text>
                  <Text style={styles.value}>{ride?.delivery_address}</Text>

                  <Text style={styles.label}>Descrição:</Text>
                  <Text style={styles.value}>{ride?.description}</Text>
                </View>

                {/* Botões de Ação */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.acceptButton} onPress={() => mutate()}>
                    <Text style={styles.buttonText}>Eu aceito</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={handleRecusarCorrida}
                  >
                    <Text style={styles.buttonText}>Recusar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        ) : (
          children
        )}
      </RideContext.Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 1,
    left: 1,
    right: 3,
    backgroundColor: '#fff',
    borderRadius: 10,
    //padding: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 1000,
  },
  subcontainer: {
    //position: 'absolute',
    width: '100%',
    bottom: 18,
    // left: 20,
    // right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 6,
    // zIndex: 1000,
  },
  containeranim: {
    position: 'absolute',
    width: '100%',
    bottom: 1,
    left: 2,
    right: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 1000,
  },
  urgenteBox: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  urgenteText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  truckImage: {
    width: '100%',
    height: 80,
    marginBottom: 10,
  },
  truckImageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingBottom: 5,
    paddingRight: 5,
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
  },
  distance: {
    fontSize: 14,
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  rideDetails: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 10,
    gap: 10,
    bottom: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    
  },
  rejectButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  newHeaderRide: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  menuButtonRide: {
    backgroundColor: '#FFC107',
    borderRadius: 20,
    padding: 10,
  },
  menuIconRide: {
    fontSize: 24,
    color: '#000',
  },
  welcomeContainerRide: {
    backgroundColor: '#FFC107',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  welcomeTextRide: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});