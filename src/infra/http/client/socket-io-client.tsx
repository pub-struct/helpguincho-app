import { BACKEND_URL } from '@/infra'
import { io } from 'socket.io-client'

export const socketIOClient = (token: string) => {
  return io(BACKEND_URL, {
    reconnection: true,
    autoConnect: true,
    reconnectionAttempts: 5,
    timeout: 10000,
    transports: ['websocket', 'polling'],
    auth: async (cb) => {
      cb({ token: token })
    },
  })
}
