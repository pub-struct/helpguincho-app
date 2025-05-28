import { ENV } from '@/env'
import { io } from 'socket.io-client'


export function socketIOClient(token: string) {
  return io(ENV.BASE_URL_SOCKET, {
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
