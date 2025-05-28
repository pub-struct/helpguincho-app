import { createContext, ReactNode, useState } from 'react'
import { API } from '@/services/api/config'


interface IAuthContext {
  isAuthenticated: boolean
  deleteAuth: () => Promise<void>
  onUpdateUser: (data: unknown) => void
  updateAuth: (token: string) => Promise<void>
  user: unknown
}
interface IProvider {
  children: ReactNode
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export function AuthProvider({ children }: IProvider) {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [user, setUser] = useState(null)

  async function updateAuth(token: string) {
    setIsAuth(true)
    API.defaults.headers.common.Authorization = `Token ${token}`
  }
  async function deleteAuth() {
    setIsAuth(false)
    API.defaults.headers.common.Authorization = ''
  }

  function onUpdateUser(data: unknown) {
    // setUser(data)
  }

  const value = {
    isAuthenticated: isAuth,
    onUpdateUser,
    deleteAuth,
    updateAuth,
    user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
