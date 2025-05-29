import { ISocketRide } from '@/@types/rides'
import {
  SOCKET_ERROR,
  SOCKET_RIDE,
  SOCKET_NOTIFICATION,
  SOCKET_NOTIFICATION_HISTORY,
  SOCKET_CONNECT,
  SOCKET_DISCONNECT,
  SOCKET_CONNECT_ERROR,
  SOCKET_JOIN_NOTIFICATION
} from '../config'
import { Socket } from 'socket.io-client'

// if (!socket) {
//   throw new DomainError({
//     titleMessage: 'Socket não inicializado',
//     message: 'Certifique-se de que o socket foi inicializado antes de ouvir eventos.',
//   })
// }

export function socketOnRide(socket: Socket, payload: (data: ISocketRide) => void) {
  socket.on(SOCKET_RIDE, payload)
}
export function socketOnNotification(socket: Socket, payload: (data: unknown) => void) {
  socket.on(SOCKET_NOTIFICATION, payload)
}
export function socketOnNotificationHistory(socket: Socket, payload: (data: unknown) => void) {
  socket.on(SOCKET_NOTIFICATION_HISTORY, payload)
}
export function socketEmitNotification(socket: Socket, payload: { role: string; user_id: number }) {
  socket.emit(SOCKET_JOIN_NOTIFICATION, payload)
}

// SOCKET UTILS
export function socketOnError(socket: Socket, payload: (data: unknown) => void) {
  socket.on(SOCKET_ERROR, payload)
}
export function socketOnConnect(socket: Socket, payload: () => void) {
  socket.on(SOCKET_CONNECT, payload)
}
export function socketOnDisconnect(socket: Socket, payload: () => void) {
  socket.on(SOCKET_DISCONNECT, payload)
}
export function socketOnConnectError(socket: Socket, payload: (e: Error) => void) {
  socket.on(SOCKET_CONNECT_ERROR, payload)
}
