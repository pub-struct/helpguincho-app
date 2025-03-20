import { RideContext } from '@/context/ride';
import RidesService from '@/infra/services/rides';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '@/hooks/auth';
import { Audio } from 'expo-av';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAppReady } from '@/context/appReady';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_API_KEY = 'AIzaSyCgJspzdsVuS5w6P7eAXvzW3e8vCNDcpv0';

export const RideProvider = ({ children }: { children: React.ReactNode }) => {
  const [ride, setRide] = useState<Ride | null>(null);
  const [showDeliveryAddress, setShowDeliveryAddress] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [initialLocation, setInitialLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const truckImage = require('../assets/images/winchtruck.png');
  const userImage = require('../assets/images/usericon.png');

  const { user } = useAuth();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const navigationStateRef = useRef(navigationState);
  const { isAppReady } = useAppReady();

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

  const { mutate } = useMutation({
    mutationKey: ['ride', ride],
    mutationFn: async () => {
      if (!ride?.id) {
        console.error('nenhuma corrida para aceitar.');
        return;
      }
  
      console.log(`tentando aceitar a corrida: ${ride.id}`);
      const res = await new RidesService().acceptRide(ride.id);
  
      if (!res || res.statusCode !== 200) {
        console.error('Erro ao aceitar corrida:', res?.body);
        throw new Error('Erro ao aceitar corrida');
      }
  
      return res;
    },
    onError: (error) => console.error('Erro na mutacao', error),
    onSuccess: async () => {
      console.log('corrida aceita');
  
      if (!ride?.id) {
        console.error('Erro: ID da corrida não encontrado');
        return;
      }
  
      console.log(`Buscando detalhes corrida com ID: ${ride.id}`);
  
      try {
        const updatedRide = await new RidesService().get(ride.id);
  
        if (!updatedRide?.body) {
          console.error('Erro: Detalhes da corrida não encontrados!');
          return;
        }
  
        console.log('detalhes update da corrida:', updatedRide.body);
        setRide(updatedRide.body);
  
        const checkAppReady = setInterval(() => {
          if (isAppReady && navigationStateRef.current?.key) {
            clearInterval(checkAppReady);
            router.push(`/(tabs)/RidesScreen?id=${updatedRide.body.id}`);
          }
        }, 500);
        
        setTimeout(() => {
          if (navigationState?.key) {
            console.log('forçando router.replace');
            router.replace(`/(tabs)/RidesScreen?id=${updatedRide.body.id}`);
          }
        }, 5000);
      } catch (error) {
        console.error('erro ao buscar os detalhes', error);
      }
    },
  });
  
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
        </MapView>
      )}

      <View style={styles.newHeader}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bem-vindo, {user?.full_name || 'Usuário'}</Text>
        </View>
      </View>

      <RideContext.Provider value={{ ride, setRide }}>
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
                    <Text style={styles.distance}>12 KM</Text>
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
                    onPress={() => setRide(null)} // Oculta a interface ao recusar
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
  newHeader: {
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
  menuButton: {
    backgroundColor: '#FFC107',
    borderRadius: 20,
    padding: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: '#000',
  },
  welcomeContainer: {
    backgroundColor: '#FFC107',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});