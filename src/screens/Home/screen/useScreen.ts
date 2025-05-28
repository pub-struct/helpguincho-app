import { useEffect, useRef, useState } from 'react'
import MapView from 'react-native-maps'
import { useRide } from '@/hooks/useRide'
import {
  socketOnError,
  socketOnRide,
  socketOnNotification,
  socketOnNotificationHistory,
  socketEmitNotification
} from '@/services/socket/Ride'
import { useSocket } from '@/hooks/useSocket'
import { ISocketRide } from '@/@types/rides'
import { Vibrate } from '@/utils/vibrate'
import { handleErrors } from '@/services/errors/ErrorHandler'
import { finishRide, getRideDetails } from '../services/api'
import { IRideDetails } from '@/@types/rides'
import { TScreen } from '@/@types/navigation'


export function useScreen(navParams: TScreen<'Home'>) {
  const { toggleDrawer } = navParams.navigation

  const [orderVisible, setOrderVisible] = useState<boolean>(false)
  const [orderInfos, setOrderInfos] = useState<IRideDetails>({} as IRideDetails)

  const mapRef = useRef<MapView>(null)
  const { socket, isConnected } = useSocket()

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

  function onUpdateMap(origem: ILocation, destino: ILocation) {
    mapRef.current?.fitToCoordinates([origem, destino], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      animated: true
    })
  }

  useEffect(() => {
    eventListenerUserLocation()
  }, [])
  useEffect(() => {
    if (socket) {
      socketOnRide(socket, onSocketRide)
      socketOnNotification(socket, (data) => {
        console.log('NOTIFICATION ====>', data)
      })
      socketOnNotificationHistory(socket, (data) => {
        console.log('NOTIFICATION HISTORY ====>', data)
      })
      socketOnError(socket, (data) => {
        console.log('SOCKET ERROR ====>', data)
      })
      // socketEmitNotification(socket)
    }
  }, [socket, isConnected])

  return {
    handleOrderVisible,
    getUserPosition,
    toggleDrawer,
    onUpdateMap,
    onFinish,
    route,
    mapRef,
    orderInfos,
    rideCoords,
    isRideActive,
    orderVisible,
    userLocation,
  }
}
