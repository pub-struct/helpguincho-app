import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_ACTIVE_RIDE } from '../config'


const storage = AsyncStorage

export async function storageSetRideActive(value: boolean) {
  const stringify = value ? '1' : '0'
  await storage.setItem(STORAGE_ACTIVE_RIDE, stringify)
}

export async function storageGetRideActive() {
  const value = await storage.getItem(STORAGE_ACTIVE_RIDE)
  const parsedValue = value ? JSON.parse(value) : '0'

  return parsedValue === '1'
}
