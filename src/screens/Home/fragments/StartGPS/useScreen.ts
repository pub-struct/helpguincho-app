import { useState } from 'react'
import { useRide } from '@/hooks/useRide'
import { openMap } from '../../utils/openMap'
import { IStartGPSProps } from '.'


export function useScreen(props: IStartGPSProps) {
  const { onUpdateMap, onFinish } = props

  const [visible, setVisible] = useState<boolean>(false)
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    ride,
    rideCoords,
    userLocation,
    getPolyline,
  } = useRide()

  const handleVisible = () => setVisible(!visible)

  async function onStartGPS() {
    await openMap({
      latitude: rideCoords?.latitude || 0,
      longitude: rideCoords?.longitude || 0,
      nome: isButtonVisible ? 'Local de entrega' : 'Local do Veículo'
    })
  }
  async function onFinishRide() {
    setIsLoading(true)
    await onFinish()

    setIsButtonVisible(false)
    setIsLoading(false)
  }
  async function onDelivery() {
    const { origem, destino } = await getPolyline(
      {
        latitude: userLocation?.latitude || 0,
        longitude: userLocation?.longitude || 0
      },
      {
        latitude: ride.delivery_lat,
        longitude: ride.delivery_long
      }
    )

    onUpdateMap(origem, destino)
    setIsButtonVisible(true)
    handleVisible()
  }

  return {
    visible,
    isLoading,
    isButtonVisible,
    onDelivery,
    onStartGPS,
    onFinishRide,
    handleVisible,
  }
}
