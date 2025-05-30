import { tryGetRouteGoogleDetails } from '@/services/api/Google'
import polyline from '@mapbox/polyline'
import * as API from '@/services/api/Rides'
import { factoryRide } from '../factory'
import { rethrowIfAppError } from '@/services/errors/rethrowIfAppError'
import Toast from 'react-native-toast-message'


interface IParams {
  origem: {
    latitude: number
    longitude: number
  }
  destino: {
    latitude: number
    longitude: number
  }
}

export async function getRoutePolyline(params: IParams) {
  const response = await tryGetRouteGoogleDetails(params)
  // console.log('ROTAS ====>', JSON.stringify(response, null, 2))
  const km = response.routes[0].legs[0].distance.text as string
  const time = response.routes[0].legs[0].duration.value as number

  const pontos = polyline.decode(response.routes[0].overview_polyline.points)
  const coordenadas = pontos.map(([lat, lng]) => ({ latitude: lat, longitude: lng }))

  return { coordenadas, km, time }
}

export async function getRideDetails(rideId: number) {
  try {
    const response = await API.tryGetRideDetail(rideId)

    return factoryRide(response)
  } catch (error) {
    throw rethrowIfAppError(error)
  }
}

export async function rejectRide(rideId: number) {
  try {
    const response = await API.tryRejectRide(rideId)

    return response
  } catch (error) {
    throw rethrowIfAppError(error)
  }
}

export async function acceptRide(rideId: number) {
  try {
    const response = await API.tryAcceptRide(rideId)

    Toast.show({
      type: 'success',
      text1: 'Corrida aceita',
      text2: response.message,
    })

    return response
  } catch (error) {
    throw rethrowIfAppError(error)
  }
}

export async function sendPhotos(rideId: number, photos: Array<{ uri: string }>) {
  const formData = new FormData()

  photos.forEach((photo, index) => {
    if (photo) {
      formData.append('photos', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: `photo_${index}.jpg`,
      // eslint-disable-next-line tseslint/no-explicit-any
      } as any)
    }
  })

  try {
    const response = await API.trySendPhotos(rideId, formData)

    Toast.show({
      type: 'success',
      text1: 'Fotos enviadas',
    })

    return {
      message: response.length > 0 ? 'Fotos enviadas com sucesso' : 'Nenhuma foto enviada',
    }
  } catch (error) {
    throw rethrowIfAppError(error)
  }
}

export async function finishRide(rideId: number) {
  try {
    const response = await API.tryFinishRide(rideId)

    Toast.show({
      type: 'success',
      text1: 'Corrida Finalizada',
      text2: response.message,
    })

    return response
  } catch (error) {
    throw rethrowIfAppError(error)
  }
}
