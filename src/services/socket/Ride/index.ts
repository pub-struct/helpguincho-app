import { ISocketRide } from '@/@types/rides'
import {
  SOCKET_ON_ERROR,
  SOCKET_ON_RIDE,
  SOCKET_ON_NOTIFICATION,
  SOCKET_ON_NOTIFICATION_HISTORY,
  SOCKET_ON_CONNECT,
  SOCKET_ON_DISCONNECT,
  SOCKET_ON_CONNECT_ERROR
} from '../config'
import { Socket } from 'socket.io-client'

// if (!socket) {
//   throw new DomainError({
//     titleMessage: 'Socket não inicializado',
//     message: 'Certifique-se de que o socket foi inicializado antes de ouvir eventos.',
//   })
// }

export function socketOnRide(socket: Socket, payload: (data: ISocketRide) => void) {
  socket.on(SOCKET_ON_RIDE, payload)
}
export function socketOnNotification(socket: Socket, payload: (data: unknown) => void) {
  socket.on(SOCKET_ON_NOTIFICATION, payload)
}
export function socketOnNotificationHistory(socket: Socket, payload: (data: unknown) => void) {
  socket.on(SOCKET_ON_NOTIFICATION_HISTORY, payload)
}
export function socketEmitNotification(socket: Socket, payload: { role: string; user_id: number }) {
  socket.emit(SOCKET_ON_NOTIFICATION_HISTORY, payload)
}

// SOCKET UTILS
export function socketOnError(socket: Socket, payload: (data: unknown) => void) {
  socket.on(SOCKET_ON_ERROR, payload)
}
export function socketOnConnect(socket: Socket, payload: () => void) {
  socket.on(SOCKET_ON_CONNECT, payload)
}
export function socketOnDisconnect(socket: Socket, payload: () => void) {
  socket.on(SOCKET_ON_DISCONNECT, payload)
}
export function socketOnConnectError(socket: Socket, payload: (e: Error) => void) {
  socket.on(SOCKET_ON_CONNECT_ERROR, payload)
}
