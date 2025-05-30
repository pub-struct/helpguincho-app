import { acceptRide, rejectRide } from '../../services/api'
import { handleErrors } from '@/services/errors/ErrorHandler'
import { useEffect, useState } from 'react'
import { useRide } from '@/hooks/useRide'
import { IOrderModalProps } from '.'


export function useScreen(props: IOrderModalProps) {
  const { visible, onClose, onUpdateMap, ...rest } = props
  // console.log(JSON.stringify(rest, null, 2))
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { userLocation, onUpdateRide, getPolyline } = useRide()

  async function onRejectRide() {
    try {
      setIsLoading(true)
      await rejectRide(rest.id)

      onClose()
    } catch (error) {
      handleErrors(error)
    } finally {
      setIsLoading(false)
    }
  }
  async function onConfirmRide() {
    try {
      setIsLoading(true)
      await acceptRide(rest.id)

      const { origem, destino, km, time } = await getPolyline(
        {
          latitude: userLocation?.latitude || 0,
          longitude: userLocation?.longitude || 0
        },
        {
          latitude: rest.pickup_lat,
          longitude: rest.pickup_long
        }
      )
      onUpdateMap(origem, destino)
      onUpdateRide({ ...rest, km, time })
      onClose()
    } catch (error) {
      handleErrors(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(visible ? false : true)
  }, [visible])

  return {
    rest,
    visible,
    isLoading,
    onRejectRide,
    onConfirmRide,
  }
}
