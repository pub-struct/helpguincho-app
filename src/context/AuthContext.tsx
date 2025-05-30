import { createContext, ReactNode, useEffect, useState } from 'react'
import { API } from '@/services/api/config'
import { IUser } from '@/@types/User'
import { storageGetToken, storageSetToken } from '@/services/storage/Auth'
import { handleErrors } from '@/services/errors/ErrorHandler'
import * as SplashScreen from 'expo-splash-screen'
import { validateAccessToken } from '@/services/api/Auth'


interface IAuthContext {
  isAuthenticated: TAuthVar
  deleteAuth(): Promise<void>
  onUpdateUser(data: IUser): void
  onAuthenticate(token: string): Promise<void>
  user: IUser
}
interface IProvider {
  children: ReactNode
  fontsLoaded: boolean
}
type TAuthVar = 'LOGGED' | 'UNLOGGED' | 'LOADING'

export const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export function AuthProvider({ children, fontsLoaded }: IProvider) {
  const [isAuthenticated, setIsAuthenticated] = useState<TAuthVar>('LOADING')
  const [control, setControl] = useState<boolean>(false)
  const [user, setUser] = useState<IUser>({} as IUser)

  const onUpdateUser = (data: IUser) => setUser(data)
  const hideSplash = async () => await SplashScreen.hideAsync()

  async function onAuthenticate(token: string) {
    API.defaults.headers.common.Authorization = `Token ${token}`
    setIsAuthenticated('LOGGED')
    await storageSetToken(token)
  }
  async function deleteAuth() {
    setIsAuthenticated('UNLOGGED')
    API.defaults.headers.common.Authorization = ''
    await storageSetToken('')
  }
  async function getInfosFromDevice() {
    try {
      const tokenDevice = await storageGetToken()
      if (!tokenDevice) {
        setIsAuthenticated('UNLOGGED')
        return
      }

      const { factoryData, token } = await validateAccessToken(tokenDevice)

      const isTokenValid = token !== 'none'

      if (isTokenValid) {
        await onAuthenticate(tokenDevice)
        onUpdateUser(factoryData)
        return
      }
      setIsAuthenticated('UNLOGGED')
    } catch (error) {
      handleErrors(error)
      setIsAuthenticated('UNLOGGED')
    } finally {
      setControl(true)
    }
  }

  useEffect(() => {
    getInfosFromDevice()
  }, [])
  useEffect(() => {
    if (!fontsLoaded) return
    if (isAuthenticated === 'LOADING') return
    if (!control) return

    hideSplash()
  }, [fontsLoaded, isAuthenticated, control])

  const value = {
    isAuthenticated,
    onUpdateUser,
    deleteAuth,
    onAuthenticate,
    user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
