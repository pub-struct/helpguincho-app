import { useEffect, useRef, useState } from 'react'
import MapView from 'react-native-maps'
import { useRide } from '@/hooks/useRide'
import {
  socketOnRide,
  socketOnNotification,
  socketEmitNotification
} from '@/services/socket/Ride'
import { useSocket } from '@/hooks/useSocket'
import { ISocketRide } from '@/@types/rides'
import { Vibrate } from '@/utils/vibrate'
import { handleErrors } from '@/services/errors/ErrorHandler'
import { finishRide, getRideDetails } from '../services/api'
import { IRideDetails } from '@/@types/rides'
import { TScreen } from '@/@types/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import Toast from 'react-native-toast-message'
import * as Location from 'expo-location'


export function useScreen(navParams: TScreen<'Home'>) {
  const { toggleDrawer } = navParams.navigation

  const [orderVisible, setOrderVisible] = useState<boolean>(false)
  const [orderInfos, setOrderInfos] = useState<IRideDetails>({} as IRideDetails)
  const [status, requestPermission] = Location.useForegroundPermissions()

  const mapRef = useRef<MapView>(null)

  const { socket, isConnected } = useSocket()
  const { user } = useAuth()
  const { pushToken, setBadgeCount, registerForNotifications, isNotificationEnabled } = useNotifications()
  const {
    eventListenerUserLocation,
    onUpdateFinishRide,
    getInitialInfos,
    isRideActive,
    userLocation,
    rideCoords,
    route,
    ride
  } = useRide()

  const handleOrderVisible = () => setOrderVisible(!orderVisible)

  async function getUserPosition() {
    const coords = await getInitialInfos()

    mapRef.current?.animateCamera({
      center: coords?.coords,
      zoom: 15
    })
  }
  async function onSocketRide(data: ISocketRide) {
    try {
      const response = await getRideDetails(data.body.ride_id)

      setOrderInfos(response)
      Vibrate()
      handleOrderVisible()
    } catch (error) {
      handleErrors(error)
    }
  }
  async function onFinish() {
    await finishRide(ride.id)
    onUpdateFinishRide()
    await getUserPosition()
  }
  async function requestUserPermissions() {
    const response = await requestPermission()

    if (response.granted) {
      await getInitialInfos()
    }
  }

  function onUpdateMap(origem: ILocation, destino: ILocation) {
    mapRef.current?.fitToCoordinates([origem, destino], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      animated: true
    })
  }
  function onSocketNotification(data: { message: string}) {
    Toast.show({
      type: 'info',
      text1: 'Atenção',
      text2: data.message
    })
  }

  async function onRequestNotifications() {
    try {
      console.log('🔔 Bell button clicked - requesting notifications...')
      await registerForNotifications()
      Toast.show({
        type: 'success',
        text1: 'Notificações',
        text2: 'Notificações ativadas com sucesso!',
        visibilityTime: 3000,
      })
    } catch (error) {
      console.error('❌ Error in onRequestNotifications:', error)
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao ativar notificações',
        visibilityTime: 3000,
      })
    }
  }

  useEffect(() => {
    eventListenerUserLocation()
  }, [])
  useEffect(() => {
    if (socket) {
      socketOnRide(socket, onSocketRide)
      socketOnNotification(socket, onSocketNotification)
      socketEmitNotification(socket, { user_id: user.id, role: user.role })
    }
  }, [socket, isConnected])

  return {
    requestUserPermissions,
    handleOrderVisible,
    getUserPosition,
    getInitialInfos,
    toggleDrawer,
    onUpdateMap,
    onFinish,
    onRequestNotifications,
    route,
    mapRef,
    status,
    orderInfos,
    rideCoords,
    isRideActive,
    orderVisible,
    userLocation,
    isNotificationEnabled,
  }
}
