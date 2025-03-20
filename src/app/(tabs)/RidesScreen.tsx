import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCgJspzdsVuS5w6P7eAXvzW3e8vCNDcpv0';

interface Ride {
  id: number;
  pickup_lat: number;
  pickup_long: number;
}

interface Location {
  latitude: number;
  longitude: number;
}

export default function RidesScreen() {
  const { id } = useLocalSearchParams(); // Pega o ID da corrida da URL
  const [rideData, setRideData] = useState<Ride | null>(null);
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [initialLocation, setInitialLocation] = useState<{ latitude: number; longitude: number } | null>(null);


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

  useEffect(() => {
    const fetchRideData = async () => {
      try {
        console.log(`dados da corrida id ${id}`);
  
        const response = await fetch(`https://api.help-guincho.co/api/v1/rides/${id}`);
        const data: Ride = await response.json();
  
        console.log("dados recebidos:", data); 
  
        if (data && data.id) {
          console.log(`corrida ${data.id} recebida e att`); 
        } else {
          console.warn(" corrida nao encontrada");
        }
  
        setRideData(data);
      } catch (error) {
        console.error('Erro ao buscar dados da corrida:', error);
      }
    };
  
    if (id) {
      fetchRideData();
    } else {
      console.warn("ID nao foi recebido");
    }
  }, [id]);
  

  if (!userLocation || !rideData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: initialLocation.latitude,
            longitude: initialLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >

        <MapViewDirections
          origin={userLocation}
          destination={{
            latitude: rideData.pickup_lat,
            longitude: rideData.pickup_long,
          }}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={5}
          strokeColor="yellow"
        />

        <Marker coordinate={userLocation} title="Você (Motorista)" pinColor="blue" />
        <Marker
          coordinate={{ latitude: rideData.pickup_lat, longitude: rideData.pickup_long }}
          title="Ponto de Coleta"
          pinColor="red"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
