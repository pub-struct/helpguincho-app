import { createContext, ReactNode, useState } from 'react'
import { API } from '@/services/api/config'
import { IUser } from '@/@types/User'


interface IAuthContext {
  isAuthenticated: boolean
  deleteAuth(): Promise<void>
  onUpdateUser(data: IUser): void
  onUpdateAuth(token: string): void
  user: IUser
}
interface IProvider {
  children: ReactNode
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export function AuthProvider({ children }: IProvider) {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [user, setUser] = useState<IUser>({} as IUser)

  async function deleteAuth() {
    setIsAuth(false)
    API.defaults.headers.common.Authorization = ''
  }

  function onUpdateAuth(token: string) {
    API.defaults.headers.common.Authorization = `Token ${token}`
    setIsAuth(true)
  }
  function onUpdateUser(data: IUser) {
    setUser(data)
  }

  const value = {
    isAuthenticated: isAuth,
    onUpdateUser,
    deleteAuth,
    onUpdateAuth,
    user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
