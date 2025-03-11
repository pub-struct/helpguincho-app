'use client'
import { SocketContext } from '@/context/socket'
import { useAuth } from '@/hooks/auth'
import { useRides } from '@/hooks/rides'
import { socketIOClient } from '@/infra/http/client/socket-io-client'
import RidesService from '@/infra/services/rides'
import { getToken } from '@/infra/services/token'
import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const { setRide } = useRides()
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    let newSocket: Socket | null = null
    let isMounted = true
    console.log('SocketProvider')

    const initSocket = async () => {
      const resolvedToken = await getToken()
      if (!resolvedToken || !isMounted) return
      console.log('token', resolvedToken)

      newSocket = socketIOClient(resolvedToken)
      setSocket(newSocket)
      newSocket.on('notification', (data: TNotification) => {
        // console.log(data)
        // addNotification(data)
      })
      newSocket.on('ride', async (data) => {
        console.log(data.body.ride_id)
        if (data.body.ride_id) {
          const ride = await new RidesService().get(data.body.ride_id)
          setRide(ride.body)
        }
      })
      newSocket.on('notification_history', (data: TNotification[]) => {
        // console.log(data)
        // data.forEach((notification) => addNotification(notification))
      })
      newSocket.emit('join_notification', { role: user?.role, user_id: user?.id })
    }

    initSocket()

    return () => {
      isMounted = false
      if (newSocket) {
        newSocket.off()
        newSocket.disconnect()
      }
    }
  }, [user?.role])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}
