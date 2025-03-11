import React, { useRef, useMemo, useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image, Alert } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MapView, { Marker } from 'react-native-maps'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import * as Location from 'expo-location'
import MapViewDirections from 'react-native-maps-directions'
import { Drawer } from 'react-native-drawer-layout'
import { BlurView } from 'expo-blur'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { socketIOClient } from '@/infra/http/client/socket-io-client'
import { useAuth } from '@/hooks/auth'

const { width, height } = Dimensions.get('window')
const GOOGLE_MAPS_API_KEY = 'AIzaSyCgJspzdsVuS5w6P7eAXvzW3e8vCNDcpv0'

export default function HomeScreen() {
  const router = useRouter()
  const { user } = useAuth()

  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['25%', '80%'], [])
  const [sheetContent, setSheetContent] = useState<'initial' | 'conta' | 'historico'>('initial')

  const openSheet = (mode: 'conta' | 'historico') => {
    setSheetContent(mode)
    bottomSheetRef.current?.snapToIndex(1)
  }

  const goBackToInitial = () => {
    setSheetContent('initial')
    bottomSheetRef.current?.snapToIndex(0)
  }
  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permissão de localização negada')
        return
      }
      const location = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = location.coords
      const currentLoc = { latitude, longitude }
      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (loc) => {
          const { latitude, longitude } = loc.coords
        }
      )
      return () => subscription.remove()
    })()
  }, [])

  // const renderCorrida = () => {
  //   if (!showCorrida || !corrida) return null

  //   return (
  //     <View style={styles.corridaContainer}>
  //       <Text style={styles.corridaTitle}>Nova Corrida</Text>
  //       <Text style={styles.corridaText}>Cliente: {corrida.client.full_name}</Text>
  //       <Text style={styles.corridaText}>Veículo: {corrida.client.vehicle}</Text>
  //       <Text style={styles.corridaText}>Placa: {corrida.client.plate}</Text>
  //       <Text style={styles.corridaText}>Local de coleta: {corrida.pickup_location}</Text>
  //       <Text style={styles.corridaText}>Local de entrega: {corrida.delivery_address}</Text>
  //       <Text style={styles.corridaText}>Descrição: {corrida.description}</Text>
  //       <Text style={styles.corridaText}>Preço: R$ {corrida.price}</Text>
  //       <View style={styles.corridaButtonsContainer}>
  //         <TouchableOpacity style={styles.corridaButton} onPress={() => setShowCorrida(false)}>
  //           <Text style={styles.corridaButtonText}>Recusar</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={[styles.corridaButton, { backgroundColor: '#2ecc71' }]}
  //           onPress={() => setShowCorrida(false)}
  //         >
  //           <Text style={styles.corridaButtonText}>Aceitar</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   )
  // }
  // const renderSheetContent = () => {
  //   switch (sheetContent) {
  //     case 'initial':
  //       return (
  //         <View style={styles.sheetContentContainer}>
  //           <View style={styles.optionButtonsContainer}>
  //             <TouchableOpacity style={styles.optionButton} onPress={() => openSheet('historico')}>
  //               <Image source={require('@/assets/images/historico.png')} style={styles.optionIcon} />
  //               <Text style={styles.optionButtonText}>Histórico</Text>
  //             </TouchableOpacity>
  //             <TouchableOpacity style={styles.optionButton} onPress={() => openSheet('conta')}>
  //               <Image source={require('@/assets/images/account.png')} style={styles.optionIcon} />
  //               <Text style={styles.optionButtonText}>Conta</Text>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       )
  //     case 'conta':
  //       return (
  //         <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
  //           <View style={styles.sheetHeader}>
  //             <Text style={styles.sheetTitle}>Conta</Text>
  //             <TouchableOpacity onPress={goBackToInitial}>
  //               <Text style={styles.sheetBackButton}>Voltar</Text>
  //             </TouchableOpacity>
  //           </View>
  //           <Text style={styles.sectionTitle}>Informações pessoais</Text>
  //           <View style={styles.infoContainer}>
  //             <Text style={styles.label}>Nome</Text>
  //             <Text style={styles.value}>{user?.full_name || 'N/A'}</Text>
  //             <Text style={styles.label}>E-mail</Text>
  //             <Text style={styles.value}>{user?.email || 'N/A'}</Text>
  //             <Text style={styles.label}>Telefone</Text>
  //             <Text style={styles.value}>{user?.phone || 'N/A'}</Text>
  //             <Text style={styles.label}>Senha</Text>
  //             <Text style={styles.value}>**********</Text>
  //           </View>
  //           <Text style={styles.sectionTitle}>Guincho</Text>
  //           <View style={styles.infoContainer}>
  //             <Text style={styles.label}>Modelo</Text>
  //             <Text style={styles.value}>{user?.vehicle?.model || 'N/A'}</Text>
  //             <Text style={styles.label}>Placa</Text>
  //             <Text style={styles.value}>{user?.vehicle?.plate || 'N/A'}</Text>
  //             <Text style={styles.label}>Cor</Text>
  //             <Text style={styles.value}>{user?.vehicle?.plate || 'N/A'}</Text>
  //           </View>
  //         </ScrollView>
  //       )
  //     case 'historico':
  //       return (
  //         <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
  //           <View style={styles.sheetHeader}>
  //             <Text style={styles.sheetTitle}>Histórico</Text>
  //             <TouchableOpacity onPress={goBackToInitial}>
  //               <Text style={styles.sheetBackButton}>Voltar</Text>
  //             </TouchableOpacity>
  //           </View>
  //           <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingBottom: 20 }}>
  //             <View style={styles.historicoItem}>
  //               <Text style={styles.historicoData}>29/01/2025 16:53</Text>
  //               <Text style={styles.historicoInfo}>R$ 150,00 | Finalizado</Text>
  //               <Text style={styles.historicoInfo}>55, rua X, São Paulo-SP</Text>
  //               <Text style={styles.historicoInfo}>Tipo de veículo: Moto</Text>
  //             </View>
  //             <View style={styles.historicoItem}>
  //               <Text style={styles.historicoData}>29/01/2025 16:53</Text>
  //               <Text style={styles.historicoInfo}>R$ 250,00 | Finalizado</Text>
  //               <Text style={styles.historicoInfo}>São Paulo-SP</Text>
  //               <Text style={styles.historicoInfo}>Tipo de veículo: Carro</Text>
  //             </View>
  //           </ScrollView>
  //         </ScrollView>
  //       )
  //     default:
  //       return null
  //   }
  // }
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  return (
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
            {/* <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.drawerItem}>Sair</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      )}
    >
      <GestureHandlerRootView style={styles.container}>
        {/* {initialLocation && ( */}
        <MapView
          style={styles.map}
          // initialRegion={{
          //   latitude: initialLocation.latitude,
          //   longitude: initialLocation.longitude,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // }}
        >
          {/* {userLocation && (
              <Marker coordinate={userLocation} title="Você está aqui">
                <Image source={require('@/assets/images/user-location.png')} style={{ width: 30, height: 30 }} />
              </Marker>
            )} */}
          {/* {corrida && (
              <MapViewDirections
                origin={{
                  latitude: corrida.driver_lat,
                  longitude: corrida.driver_long,
                }}
                destination={{
                  latitude: corrida.delivery_lat,
                  longitude: corrida.delivery_long,
                }}
                waypoints={[
                  {
                    latitude: corrida.pickup_lat,
                    longitude: corrida.pickup_long,
                  },
                ]}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={4}
                strokeColor="hotpink"
              />
            )} */}
        </MapView>
        {/* )} */}

        <View style={styles.newHeader}>
          {/* <TouchableOpacity style={styles.menuButton} onPress={() => setIsDrawerOpen(true)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity> */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Bem-vindo, {user?.full_name || 'Usuário'}</Text>
          </View>
        </View>

        {/* {sheetContent === 'initial' && (
          <BlurView intensity={40} style={styles.statusBox}>
            <Text style={styles.statusTitle}>
              Você está <Text style={{ color: disponivel ? '#2ecc71' : '#e74c3c' }}>{disponivel ? 'ON' : 'OFF'}</Text>
            </Text>
            <Text style={styles.statusSubtitle}>Guinchos feitos hoje: X</Text>
            <Text style={styles.statusDesc}>
              {disponivel
                ? 'Você está disponível para receber chamados!'
                : 'Buscaremos serviço de guinchos assim que ficar online.'}
            </Text>
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: disponivel ? '#333' : '#FFC107' }]}
              onPress={() => setDisponivel(!disponivel)}
            >
              <Text style={[styles.statusButtonText, { color: disponivel ? '#fff' : '#000' }]}>
                {disponivel ? 'Ficar OFF' : 'Estou pronto pra trabalhar'}
              </Text>
            </TouchableOpacity>
          </BlurView>
        )} */}
        {/* {renderCorrida()} */}
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
            </BottomSheetView>
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
    </Drawer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  corridaContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
  },
  corridaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  corridaText: {
    fontSize: 14,
    marginBottom: 5,
  },
  corridaButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  corridaButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  corridaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
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
  statusBox: {
    position: 'absolute',
    alignSelf: 'center',
    top: 120,
    width: '90%',
    borderRadius: 10,
    padding: 16,
    zIndex: 2,
    overflow: 'hidden',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FFF',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#FFF',
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
    marginBottom: 10,
    marginTop: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sheetBackButton: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
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
})
