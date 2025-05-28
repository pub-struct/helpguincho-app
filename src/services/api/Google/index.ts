import axios from 'axios'
import { ENV } from '@/env'


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
export async function tryGetRouteGoogleDetails(params: IParams) {
  const { destino, origem } = params

  const URL = 'https://maps.googleapis.com/maps/api/directions/json'

  const response = await axios.get(URL, {
    params: {
      origin: `${origem.latitude},${origem.longitude}`,
      destination: `${destino.latitude},${destino.longitude}`,
      key: ENV.GOOGLE_API_KEY,
    },
  })

  return response.data
}
