import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_TOKEN } from '../config'


const storage = AsyncStorage

export async function storageSetToken(token: string) {
  const stringify = JSON.stringify(token)

  await storage.setItem(STORAGE_TOKEN, stringify)
}
export async function storageGetToken() {
  const data = await storage.getItem(STORAGE_TOKEN)
  const res = data ? JSON.parse(data) : ''

  return res
}
