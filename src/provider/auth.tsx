'use client'
import { AuthContext } from '@/context/auth'
import { HttpStatusCode } from '@/infra'
import AuthService from '@/infra/services/auth'
import { setToken } from '@/infra/services/token'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { usePathname, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import LoadingScreen from '@/app/(tabs)/LoadingScreen'
import { Alert } from 'react-native'
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)

  const login = async (email: string, password: string) => {
    try {
      const response = await new AuthService().login({ email, password })
      console.log(email, password)
      if (response.statusCode === HttpStatusCode.unauthorized) {
        Alert.alert('Não encontramos nenhum usuário com essas credenciais, verifique suas credenciais')
        return
      }
      if (response.body.role !== 'driver') {
        Alert.alert('Você não tem permissão para acessar essa página, precisa ser um motorista cadastrado.')
        return
      }
      // toast.success('Login realizado com sucesso!')
      setUser(response.body)
      await setToken(response.body.token)
      router.push('/HomeScreen')
    } catch (error) {}
  }

  const logout = async () => {
    try {
      const res = await new AuthService().logout()
      if (res.statusCode === 401) {
        setUser(null)
      }
      await AsyncStorage.removeItem('token')
      setUser(null)
    } catch (error) {}
  }
  const session = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await new AuthService().session()
      if (res.statusCode !== 200) {
        router.push('/LoginScreen')
        await logout()
        // await deleteCookies()
        return {}
      }
      setUser(res.body)
      return res
    },
  })
  if (session.isPending) {
    return <LoadingScreen />
  }
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
