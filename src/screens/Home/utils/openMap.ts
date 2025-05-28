import { Linking, Platform } from 'react-native'


interface IParams {
  latitude: number
  longitude: number
  nome: string
}
/**
 * Opens a map application with the specified coordinates and label.
 *
 * @param {IParams} infos - The parameters containing latitude, longitude, and label.
 * @returns {Promise<void>} - A promise that resolves when the URL is opened.
 */
export async function openMap(infos: IParams): Promise<void> {
  const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' })
  const latLng = `${infos.latitude},${infos.longitude}`
  const label = infos.nome
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`
  })

  await Linking.openURL(url!)
}
