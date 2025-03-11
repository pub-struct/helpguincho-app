import { io } from 'socket.io-client';
//import { BACKEND_URL } from '@/infra'; 
const BACKEND_URL = 'https://api.help-guincho.co';

export const socketIOClient = (token: string) => {
  return io(BACKEND_URL || 'https://backacesse.syncronuspro.com.br', {
    reconnection: true,
    autoConnect: true,
    reconnectionAttempts: 5,
    timeout: 10000,
    transports: ['websocket', 'polling'],
    auth: async (cb) => {
      cb({ token: token });
    },
  });
};