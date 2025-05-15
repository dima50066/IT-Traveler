import { io, Socket } from 'socket.io-client';

const socket: Socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true
});

export default socket;
