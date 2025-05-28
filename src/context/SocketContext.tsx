import { socketOnConnect, socketOnConnectError, socketOnDisconnect } from '@/services/socket/Ride'
import { socketIOClient } from '@/services/socket/socketClient'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'


interface IProvider {
  children: ReactNode
}

interface ISocketContext {
  socket: Socket | null
  isConnected: boolean
  initSocket: (token: string) => void
  disconnectSocket: () => void
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
  initSocket() {},
  disconnectSocket() {},
})

export function SocketProvider({ children }: IProvider) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  function initSocket(token: string) {
    if (socket) return

    const socketInstance = socketIOClient(token)

    socketOnConnect(socketInstance, () => {
      console.log('✅ Socket conectado')
      setIsConnected(true)
    })
    socketOnDisconnect(socketInstance, () => {
      console.log('❌ Socket desconectado')
      setIsConnected(false)
    })
    socketOnConnectError(socketInstance, (error) => {
      console.log('Erro de conexão do socket:', error.message)
    })

    setSocket(socketInstance)
  }
  function disconnectSocket() {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }

  useEffect(() => {
    return () => {
      disconnectSocket()
    }
  }, [])

  const value = {
    socket,
    isConnected,
    initSocket,
    disconnectSocket
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
