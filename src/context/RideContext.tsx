import { IRideState, TUpdateRideState } from '@/@types/rides'
import { getRoutePolyline } from '@/screens/Home/services/api'
import { rethrowIfAppError } from '@/services/errors/rethrowIfAppError'
import { getLocationPermission } from '@/utils/permissions/location'
import {
  LocationAccuracy,
  LocationObject,
  LocationSubscription,
  watchPositionAsync
} from 'expo-location'
import { createContext, ReactNode, useEffect, useRef, useState } from 'react'


interface IProvider {
  children: ReactNode
}
interface IContext {
  userLocation: ILocation | null
  rideCoords: ILocation | null
  route: ILocation[]
  ride: IRideState
  isRideActive: boolean
  onUpdateFinishRide(): void
  eventListenerUserLocation(): Promise<void>
  getInitialInfos(): Promise<LocationObject | null>
  onUpdateRide(rideData: TUpdateRideState): void
  getPolyline(origem: ILocation, destino: ILocation): Promise<{origem: ILocation; destino: ILocation; km: string; time: number}>
}

export const RideContext = createContext<IContext>({} as IContext)

const defaultRideValue: IRideState = {
  id: 0,
  status: 'none',
  pickup_location: 'none',
  pickup_lat: 0,
  pickup_long: 0,
  delivery_address: 'none',
  delivery_lat: 0,
  delivery_long: 0,
  km: '',
  time: 0
}

export function RideProvider({ children }: IProvider) {
  const [userLocation, setUserLocation] = useState<ILocation | null>(null)
  const [ride, setRide] = useState<IRideState>(defaultRideValue)
  const [route, setRoute] = useState<ILocation[]>([])
  const [rideCoords, setRideCoords] = useState<ILocation | null>(null)

  const isRideActive = ride.status === 'accepted' || ride.status === 'pending'

  const locationSubscriptionRef = useRef<LocationSubscription | null>(null)
  const isMountedRef = useRef(true)

  async function getInitialInfos() {
    const cords = await getLocationPermission()

    if (cords) {
      setUserLocation({
        latitude: cords.coords.latitude,
        longitude: cords.coords.longitude,
      })
    }

    return cords
  }
  async function eventListenerUserLocation() {
    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove()
    }

    locationSubscriptionRef.current = await watchPositionAsync({
      accuracy: LocationAccuracy.BestForNavigation,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      const data = {
        latitude: response.coords.latitude,
        longitude: response.coords.longitude,
      }

      if (isMountedRef.current) {
        setUserLocation(data)
      }
    })
  }
  async function getPolyline(origem: ILocation, destino: ILocation) {
    try {
      const { coordenadas, km, time } = await getRoutePolyline({ destino, origem })
      setRideCoords(destino)
      setRoute(coordenadas)

      return { origem, destino, km, time }
    } catch (error) {
      throw rethrowIfAppError(error)
    }
  }

  function cleanListenerUserLocation() {
    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove()
      locationSubscriptionRef.current = null
    }
  }
  function onUpdateFinishRide() {
    setRide(defaultRideValue)
    setRideCoords(null)
    setRoute([])
  }
  function onUpdateRide(rideData: TUpdateRideState) {
    setRide({
      id: rideData.id,
      status: rideData.status,
      pickup_location: rideData.pickup_location,
      pickup_lat: rideData.pickup_lat,
      pickup_long: rideData.pickup_long,
      delivery_address: rideData.delivery_address,
      delivery_lat: rideData.delivery_lat,
      delivery_long: rideData.delivery_long,
      km: rideData.km,
      time: rideData.time
    })
  }

  useEffect(() => {
    getInitialInfos()

    return () => {
      isMountedRef.current = false
      cleanListenerUserLocation()
    }
  }, [])

  const value = {
    eventListenerUserLocation,
    onUpdateFinishRide,
    getInitialInfos,
    onUpdateRide,
    getPolyline,
    userLocation,
    isRideActive,
    rideCoords,
    route,
    ride,
  }

  return (
    <RideContext.Provider value={value}>
      {children}
    </RideContext.Provider>
  )
}
