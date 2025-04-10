import React, { useRef, useMemo, useState, useEffect } from 'react';
import { 
  Animated, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  ScrollView, 
  Image, 
  Linking,
  Alert,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { Drawer } from 'react-native-drawer-layout';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/auth';
import { useRides } from '@/hooks/rides'; 
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import RidesService from '@/infra/services/rides';
import { motion } from "framer-motion";

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_API_KEY = 'AIzaSyCgJspzdsVuS5w6P7eAXvzW3e8vCNDcpv0';

const isValidCoordinate = (coord: number) => {
  return (
    coord !== null &&
    coord !== undefined &&
    !isNaN(coord) &&
    Math.abs(coord) <= 90
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    ride, 
    activeRide, 
    setActiveRide, 
    showDeliveryRoute, 
    setShowDeliveryRoute, 
    isAvailable, 
    setIsAvailable 
  } = useRides();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '80%'], []);
  const [sheetContent, setSheetContent] = useState<'initial' | 'conta' | 'historico'>('initial');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [initialLocation, setInitialLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [showFinalAnimation, setShowFinalAnimation] = useState(false);



  const [photos, setPhotos] = useState<Array<{ uri: string } | null>>(
    Array(4).fill(null)
  );

  const statusBoxPosition = useRef(new Animated.Value(isAvailable ? 120 : 520)).current;

  const openInWaze = (latitude: number, longitude: number) => {
    const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  
    Linking.canOpenURL(wazeUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(wazeUrl);
        } else {
          Alert.alert('Erro', 'Waze não está instalado ou não pode ser aberto.');
        }
      })
      .catch((err) => console.error('Erro ao tentar abrir o Waze:', err));
  };
  
  useEffect(() => {
    const errorHandler = (error: Error) => {
      console.error('Erro não tratado:', error);
      Alert.alert('Erro crítico', 'Ocorreu um erro inesperado. O app será reiniciado.');
      router.replace('/');
    };
    ErrorUtils.setGlobalHandler(errorHandler);

    return () => {
      
    };
  }, []);

  useEffect(() => {
    if (ride?.id) {
      console.log('Corrida ativa:', ride);
    }
  }, [ride]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão de câmera negada', 
          'Precisamos da permissão para acessar a câmera.'
        );
      }
    })();
  }, []);

  const handleTakePhoto = async (index: number) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled && result.assets?.length) {
        const newPhotos = [...photos];
        const { uri } = result.assets[0];
        newPhotos[index] = { uri };
        setPhotos(newPhotos);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
    }
  };

  const handleSendPhotos = async (rideId: number) => { 
    const validPhotos = photos.filter(photo => photo !== null);
  
    if (validPhotos.length < 4) {
      Alert.alert('Erro', 'Você precisa tirar 4 fotos antes de continuar.');
      return;
    }
  
    const formData = new FormData();
  
    try {
      for (let i = 0; i < validPhotos.length; i++) {
        const photo = validPhotos[i]!;
  
        formData.append('photos', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: `photo_${i}.jpg`,
        } as any);
      }
  
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token);
  
      const response = await fetch(`https://api.help-guincho.co/api/v1/rides/${rideId}/add-photos/`, {
        method: 'POST',
        headers: {
          //'Authorization': `Token 36e28e5363e1d1ea85283c540b44dd7a584c5f2e`,
          'Authorization': `Token ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });
  
      const responseText = await response.text();
      console.log('Resposta da API:', responseText);
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(`A API não retornou um JSON válido: ${responseText}`);
      }
  
      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao enviar fotos');
      }
  
      return responseData;
    } catch (error: any) {
      console.error('Erro no upload:', error);
      throw new Error(error.message || 'Erro ao enviar fotos');
    }
  };
  

  const handleConfirmPhotos = async () => {
    if (!activeRide) return;
  
    try {
      setIsUploading(true);
      await handleSendPhotos(activeRide.id);
      
      setShowPhotoUpload(false);
      Alert.alert(
        'Confirmação',
        'Confirmar a coleta do veículo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Confirmar', 
            onPress: () => {
              if (!activeRide?.delivery_lat || !activeRide?.delivery_long) {
                Alert.alert('Erro', 'Coordenadas de entrega inválidas');
                return;
              }
              
              setShowDeliveryRoute(true);
              if (userLocation) {
                mapRef.current?.fitToCoordinates([
                  { 
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude
                  },
                  { 
                    latitude: activeRide.delivery_lat, 
                    longitude: activeRide.delivery_long 
                  }
                ], {
                  edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                  animated: true
                });
              }
            }
          },
        ]
      );
    } catch (err) {
      console.error('Erro ao confirmar fotos:', err);
      Alert.alert('Erro', 'Falha ao enviar fotos. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const ridesService = new RidesService();

  const handleGuinchar = async () => {
    if (!activeRide || !userLocation) {
      Alert.alert('Erro', 'Localização não disponível');
      return;
    }
  
    if (!showDeliveryRoute) {
      setShowPhotoUpload(true);
    } else {
      Alert.alert(
        'Finalizar Corrida',
        'Você confirmou a entrega do veículo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar',
            onPress: async () => {
              console.log('Tentando finalizar corrida...');
              try {
                setIsFinalizing(true);
                const response = await ridesService.updateRideStatus(activeRide.id, 'completed');
                
                if (response.statusCode === 200) {
                  setTimeout(() => {
                    setIsFinalizing(false);
                    setActiveRide(null);
                    setShowDeliveryRoute(false);
            
                    if (mapRef.current && userLocation) {
                      mapRef.current.animateToRegion({
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      });
                    }
                    
                    setShowFinalAnimation(true);
                    //Alert.alert('Corrida finalizada com sucesso!');
                  }, 2000); 
                } else {
                  setIsFinalizing(false);
                  Alert.alert('Erro', 'Falha ao concluir a corrida');
                }
              } catch (error) {
                console.error('Erro ao finalizar corrida:', error);
                Alert.alert('Erro', 'Erro interno ao concluir a corrida');
              }
            }
          },
        ]
      );
    }
  };

  const mapRef = useRef<MapView>(null);
  // useEffect(() => {
  //   if (mapRef.current && userLocation) {
  //     mapRef.current.animateToRegion({
  //       ...userLocation,
  //       latitudeDelta: 0.01,
  //       longitudeDelta: 0.01,
  //     }, 1000);
  //   }
  // }, [userLocation]);

  const renderMapElements = () => {
    if (!activeRide || !userLocation || !userLocation.latitude || !userLocation.longitude) return null;
  
    const isValidRoute = (
      originLat: number,
      originLng: number,
      destLat: number,
      destLng: number
    ) => {
      return (
        isValidCoordinate(originLat) &&
        isValidCoordinate(originLng) &&
        isValidCoordinate(destLat) &&
        isValidCoordinate(destLng)
      );
    };
  
    return (
      <>
        {!showDeliveryRoute && isValidRoute(
          userLocation.latitude,
          userLocation.longitude,
          activeRide.pickup_lat,
          activeRide.pickup_long
        ) && (
          <>
            <MapViewDirections
              key={`route-${userLocation.latitude}-${userLocation.longitude}-${showDeliveryRoute}`}
              origin={userLocation}
              destination={{
                latitude: activeRide.pickup_lat,
                longitude: activeRide.pickup_long,
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={6}
              strokeColor="#FFD700"
              onReady={() => setIsRouting(false)}
              onError={(error) => {
                console.error('Erro na rota:', error);
                setIsRouting(false);
              }}
              onStart={() => setIsRouting(true)}
              mode="DRIVING"
              precision="high"
              resetOnChange={false}
            />
            <Marker
              coordinate={{
                latitude: activeRide.pickup_lat,
                longitude: activeRide.pickup_long,
              }}
              title="Local de coleta"
            >
              <Image 
                source={require('@/assets/images/pickupicon.png')} 
                style={styles.markerImage}
              />
            </Marker>
          </>
        )}
  
        {showDeliveryRoute && isValidRoute(
          userLocation.latitude,
          userLocation.longitude,
          activeRide.delivery_lat,
          activeRide.delivery_long
        ) && (
          <>
            <MapViewDirections
              key={`route-${userLocation.latitude}-${userLocation.longitude}-${showDeliveryRoute}`}
              origin={userLocation}
              destination={{
                latitude: activeRide.delivery_lat,
                longitude: activeRide.delivery_long,
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={8}
              strokeColor="#FFD700"
              onReady={() => {
                setIsRouting(false);
                mapRef.current?.fitToCoordinates([
                  userLocation,
                  {
                    latitude: activeRide.delivery_lat,
                    longitude: activeRide.delivery_long,
                  }
                ], {
                  edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                  animated: true
                });
              }}
              onError={(error) => {
                console.error('Erro na rota:', error);
                setIsRouting(false);
                Alert.alert('Erro', 'Não foi possível calcular a rota de entrega');
              }}
              onStart={() => setIsRouting(true)}
              mode="DRIVING"
              precision="high"
              resetOnChange={true}
            />
            <Marker
              coordinate={{
                latitude: activeRide.delivery_lat,
                longitude: activeRide.delivery_long,
              }}
              title="Local de entrega"
            >
              <Image 
                source={require('@/assets/images/deliveryhp.png')} 
                style={styles.markerImage}
              />
            </Marker>
          </>
        )}
      </>
    );
  };

  const moveStatusBoxDown = () => {
    Animated.timing(statusBoxPosition, {
      toValue: 520,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  
  const moveStatusBoxUp = () => {
    Animated.timing(statusBoxPosition, {
      toValue: 120,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (isAvailable) {
      moveStatusBoxDown();
    } else {
      moveStatusBoxUp();
    }
  }, [isAvailable]);

  const openSheet = (mode: 'conta' | 'historico') => {
    setSheetContent(mode);
    bottomSheetRef.current?.snapToIndex(2);
  };

  const goBackToInitial = () => {
    setSheetContent('initial');
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/LoginScreen');
  };
  useEffect(() => {
    let isMounted = true;
    let subscription: Location.LocationSubscription;
  
    const watchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || !isMounted) return;
  
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
  
        if (isMounted) {
          setUserLocation(initialLocation.coords);
          setInitialLocation(initialLocation.coords);
        }
  
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 50, 
            timeInterval: 5000 
          },
          (loc) => {
            if (isMounted && loc.coords) {
              setUserLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
              });
            }
          }
        );
      } catch (error) {
        console.error('Erro de localização:', error);
        if (isMounted) {
          Alert.alert('Erro', 'Não foi possível obter a localização');
        }
      }
    };
  
    watchLocation();
  
    return () => {
      isMounted = false;
      subscription?.remove();
      setUserLocation(null);
      setInitialLocation(null);
    };
  }, []);

  useEffect(() => {
    if (!showFinalAnimation) return;
  
    const timeout = setTimeout(() => {
      setShowExtras(true);
  
      Animated.timing(barWidth, {
        toValue: Dimensions.get('window').width,
        duration: 1000,
        useNativeDriver: false,
      }).start();
  
      Animated.timing(truckX, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
  
      Animated.timing(textX, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1000);
  
    return () => clearTimeout(timeout);
  }, [showFinalAnimation]);
  
  useEffect(() => {
    if (showFinalAnimation) {
      const hideTimeout = setTimeout(() => {
        setShowFinalAnimation(false);
        setShowExtras(false); 
        barWidth.setValue(20); 
        truckX.setValue(-Dimensions.get('window').width);
        textX.setValue(Dimensions.get('window').width);
      }, 3000);
  
      return () => clearTimeout(hideTimeout);
    }
  }, [showFinalAnimation]);
  
  

  const renderSheetContent = () => {
    switch (sheetContent) {
      case 'initial':
        return (
          <View style={styles.sheetContentContainer}>
            <View style={styles.optionButtonsContainer}>
              <TouchableOpacity style={styles.optionButton} onPress={() => openSheet('historico')}>
                <Image source={require('@/assets/images/historico.png')} style={styles.optionIcon} />
                <Text style={styles.optionButtonText}>Histórico</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => openSheet('conta')}>
                <Image source={require('@/assets/images/account.png')} style={styles.optionIcon} />
                <Text style={styles.optionButtonText}>Conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'conta':
        return (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity style={styles.sheetBackButton} onPress={goBackToInitial}>
                <View style={styles.rightContainer}>
                  <Image source={require('@/assets/images/account.png')} style={styles.icon} />
                  <Text style={styles.sheetTitle}>Conta</Text> 
                </View>
                <Text style={styles.BackButton}>Voltar</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Informações pessoais</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Nome</Text>
              <Text style={styles.value}>{user?.full_name || 'N/A'}</Text>
              <Text style={styles.label}>E-mail</Text>
              <Text style={styles.value}>{user?.email || 'N/A'}</Text>
              <Text style={styles.label}>CNH</Text>
              <Text style={styles.value}>{user?.cnh || 'N/A'}</Text>
              <Text style={styles.label}>Telefone</Text>
              <Text style={styles.value}>{user?.phone || 'N/A'}</Text>
              <Text style={styles.label}>Senha</Text>
              <Text style={styles.value}>**********</Text>
            </View>
            <Text style={styles.sectionTitle}>Guincho</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Marca</Text>
              <Text style={styles.value}>{user?.vehicle?.brand || 'N/A'}</Text>
              <Text style={styles.label}>Modelo</Text>
              <Text style={styles.value}>{user?.vehicle?.model || 'N/A'}</Text>
              <Text style={styles.label}>Ano</Text>
              <Text style={styles.value}>{user?.vehicle?.year || 'N/A'}</Text>
              <Text style={styles.label}>Placa</Text>
              <Text style={styles.value}>{user?.vehicle?.plate || 'N/A'}</Text>
            </View>
          </ScrollView>
        );
      case 'historico':
        return (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity style={styles.sheetBackButton} onPress={goBackToInitial}>
                <View style={styles.rightContainer}>
                  <Image source={require('@/assets/images/historico.png')} style={styles.icon} />
                  <Text style={styles.sheetTitle}>Histórico</Text> 
                </View>
                <Text style={styles.BackButton}>Voltar</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.historicoItem}>
                <Text style={styles.historicoData}>29/01/2025 16:53</Text>
                <Text style={styles.historicoInfo}>R$ 150,00 | Finalizado</Text>
                <Text style={styles.historicoInfo}>55, rua X, São Paulo-SP</Text>
                <Text style={styles.historicoInfo}>Tipo de veículo: Moto</Text>
              </View>
              <View style={styles.historicoItem}>
                <Text style={styles.historicoData}>29/01/2025 16:53</Text>
                <Text style={styles.historicoInfo}>R$ 250,00 | Finalizado</Text>
                <Text style={styles.historicoInfo}>São Paulo-SP</Text>
                <Text style={styles.historicoInfo}>Tipo de veículo: Carro</Text>
              </View>
            </ScrollView>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  const barWidth = useRef(new Animated.Value(20)).current;
  const truckX = useRef(new Animated.Value(-Dimensions.get('window').width)).current;
  const textX = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  return (
    <View style={{ flex: 1 }}>
      {showFinalAnimation ? (
        <View style={styles.finalScreenContainer}>
          <Animated.View style={[styles.animatedBar, { width: barWidth }]} />
  
          {showExtras && (
            <>
              <Animated.Image
                source={require('@/assets/images/truckanim.png')}
                style={[styles.truckImageAnim, { transform: [{ translateX: truckX }] }]}
                resizeMode="contain"
              />
  
              <Animated.Text style={[styles.finalText, { transform: [{ translateX: textX }] }]}>
                SERVIÇO FINALIZADO
              </Animated.Text>
            </>
          )}
        </View>
      ) : (
        <Drawer
          open={isDrawerOpen}
          onOpen={() => setIsDrawerOpen(true)}
          onClose={() => setIsDrawerOpen(false)}
          renderDrawerContent={() => (
            <View style={styles.drawerContainer}>
              <View style={styles.drawerContent}>
                <TouchableOpacity onPress={() => console.log('Gerar Recibo')}>
                  <Text style={styles.drawerItem}>Gerar Recibo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.drawerItem}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        >
          <GestureHandlerRootView style={styles.container}>
            {initialLocation && (
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: initialLocation.latitude,
                  longitude: initialLocation.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                followsUserLocation={true}
              >
                {renderMapElements()}
              </MapView>
            )}
            <View style={styles.newHeader}>
              <TouchableOpacity style={styles.menuButton} onPress={() => setIsDrawerOpen(true)}>
                <Text style={styles.menuIcon}>☰</Text>
              </TouchableOpacity>
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>
                  Bem-vindo, {user?.full_name || 'Usuário'}
                </Text>
              </View>
            </View>
            {!activeRide && (
              <Animated.View style={[styles.statusBox, { top: statusBoxPosition }]}>
                <BlurView intensity={40} style={styles.blurContainer}>
                  <Text style={styles.statusTitle}>
                    Você está <Text style={{ color: isAvailable ? '#2ecc71' : '#e74c3c' }}>
                      {isAvailable ? 'ON' : 'OFF'}
                    </Text>
                  </Text>
                  <Text style={styles.statusSubtitle}>Guinchos feitos hoje: X</Text>
                  <Text style={styles.statusDesc}>
                    {isAvailable
                      ? 'Você está disponível para receber chamados!'
                      : 'Buscaremos serviço de guinchos assim que ficar online.'}
                  </Text>
                  <TouchableOpacity
                    style={[styles.statusButton, { backgroundColor: isAvailable ? '#333' : '#FFC107' }]}
                    onPress={() => setIsAvailable(!isAvailable)}
                  >
                    <Text style={[styles.statusButtonText, { color: isAvailable ? '#fff' : '#000' }]}>
                      {isAvailable ? 'Ficar OFF' : 'Estou pronto pra trabalhar'}
                    </Text>
                  </TouchableOpacity>
                </BlurView>
              </Animated.View>
            )}
  
            <View style={styles.bottomSheetContainer} pointerEvents="box-none">
              <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                index={0}
                backgroundStyle={styles.sheetBackground}
                handleIndicatorStyle={{ backgroundColor: '#ccc' }}
              >
                <BottomSheetView style={{ flex: 1 }}>
                  {renderSheetContent()}
                </BottomSheetView>
              </BottomSheet>
            </View>
  
            {activeRide && (
              <View style={styles.guincharContainer}>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.guincharButton}
                    onPress={handleGuinchar}
                  >
                    <Text style={styles.guincharButtonText}>
                      {showDeliveryRoute ? 'Concluir Corrida' : 'Guinchar Veículo'}
                    </Text>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    onPress={() => openInWaze(
                      showDeliveryRoute ? activeRide.delivery_lat : activeRide.pickup_lat,
                      showDeliveryRoute ? activeRide.delivery_long : activeRide.pickup_long
                    )}
                    style={styles.wazeButton}
                  >
                    <Image
                      source={require('@/assets/images/waze.png')}
                      style={styles.wazeIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {showPhotoUpload && (
              <View style={styles.photoUploadContainer}>
                <Text style={styles.photoUploadTitle}>
                  Para sua e nossa segurança, tire 4 fotos do estado atual do veículo que está sendo guinchado
                </Text>
  
                <View style={styles.photoRow}>
                  {photos.map((photo, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.photoPlaceholder}
                      onPress={() => handleTakePhoto(index)}
                      disabled={isUploading}
                    >
                      {photo ? (
                        <Image
                          source={{ uri: photo.uri }}
                          style={styles.photo}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="camera" size={32} color="gray" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
  
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    (photos.filter(p => p).length < 4 || isUploading) && styles.disabledButton
                  ]}
                  onPress={handleConfirmPhotos}
                  disabled={photos.filter(p => p).length < 4 || isUploading}
                >
                  <Text style={styles.confirmButtonText}>
                    {isUploading ? 'Enviando...' : 'Ir para entrega'}
                  </Text>
                </TouchableOpacity>
  
                {isUploading && (
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                  </View>
                )}
  
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowPhotoUpload(false)}
                  disabled={isUploading}
                >
                  <Text style={styles.cancelButtonText}>Voltar</Text>
                </TouchableOpacity>
              </View>
            )}
          </GestureHandlerRootView>
        </Drawer>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
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
    zIndex: 100000,
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
  blurContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 13,
    overflow: 'hidden',
  },
  statusBox: {
    position: 'absolute',
    alignSelf: 'center',
    width: '97%',
    borderRadius: 10,
    padding: 16,
    zIndex: 2,
    overflow: 'hidden',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  statusDesc: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  statusButton: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sheetBackground: {
    backgroundColor: '#fff',
  },
  sheetContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 54,
    height: 54,
  },
  sheetBackButton: {
    // color: '#555',
    // fontSize: 16,
    // fontWeight: 'bold',
    //width: '100%',
    backgroundColor: '#fff',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 13,
    //     shadowColor: '#000',
    // shadowOffset: { width: 4, height: 6 },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // elevation: 6,
    width: '100%',
    height: 50,
    borderRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  BackButton: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20,
  },
  optionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
    width: 120,
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIcon: {
    width: 44,
    height: 44,
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 6,
  },
  value: {
    color: '#555',
    marginBottom: 6,
  },
  historicoItem: {
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  historicoData: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  historicoInfo: {
    fontSize: 13,
    color: '#555',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height,
    zIndex: 1000,
  },
  drawerContainer: {
    height: height * 0.5,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  drawerContent: {
    flex: 1,
  },
  drawerItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
  rideContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
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
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 10,
    gap: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
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
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deliveryAddressBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 1000,
  },
  deliveryAddressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  guincharContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
  },
  
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  guincharButton: {
    backgroundColor: '#FFC107',
    padding: 15,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  guincharButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  wazeButton: {
    backgroundColor: '#3399FF',
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 0.3,
  },
  
  wazeIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    // borderRadius: 25,
    // alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'row',
    // flex: 0.3,
  },
  
  markerImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    flexWrap: 'wrap',
  },
  // photoPlaceholder: {
  //   width: '45%',
  //   height: 120,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 8,
  //   marginBottom: 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  photoUploadContainer: {
    position: 'absolute',
    top: '30%',
    left: '5%',
    right: '5%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  photoUploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
  },
  photoPlaceholder: {
    width: 70,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 70,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  confirmButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  progressBar: {
    height: 5,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  finalScreenContainer: {
    flex: 1,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  animatedBar: {
    height: 10,
    backgroundColor: '#262628',
    //borderRadius: 10,
    marginBottom: 30,
  },
  
  truckImageAnim: {
    height: 110,
    width: 200,
    position: 'absolute',
    bottom: '58%',
    marginBottom: -50, // metade da altura
    //left: 0,
  },
  
  finalText: {
    position: 'absolute',
    bottom: '52%',
    marginBottom: -40,
    //right: 0,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262628',
  },
  
});