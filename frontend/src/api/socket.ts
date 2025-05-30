import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';
import { useTripsStore } from '../stores/trip';
import type { ChatMessage } from '../types';

interface SocketAuth {
  token: string;
}

interface SocketQuery {
  tripId: string;
}

interface JoinTripEvent {
  userId: string;
  tripId: string;
}

interface JoinedTripEvent {
  tripId: string;
  chatId: string;
}

interface ChatErrorEvent {
  message: string;
}

const socket: Socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true
});

export const connectSocket = (tripId: string) => {
  const authStore = useAuthStore();
  const token = authStore.token;

  if (!token) {
    throw new Error('No token available for socket connection');
  }

  if (!tripId) {
    throw new Error('No tripId provided for socket connection');
  }

  socket.auth = { token } as SocketAuth;
  socket.io.opts.query = { tripId } as SocketQuery;

  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const setupSocketListeners = () => {
  const chatStore = useChatStore();
  const tripsStore = useTripsStore();

  socket.on('connect', () => {
    return;
  });

  socket.on('disconnect', () => {
    return;
  });

  socket.on('chat:join:trip', (data: JoinTripEvent) => {
    const authStore = useAuthStore();
    const userId = authStore.userId;
    if (!userId) {
      throw new Error('User not authenticated for chat:join:trip');
    }
    socket.emit('chat:join:trip', { userId, tripId: data.tripId });
  });

  socket.on('chat:joined', (data: JoinedTripEvent) => {
    tripsStore.setActiveTripChatId(data.tripId, data.chatId);
  });

  socket.on('chat:message', (message: ChatMessage) => {
    chatStore.addMessage(message);
  });

  socket.on('chat:error', (error: ChatErrorEvent) => {
    throw new Error(`Chat error: ${error.message}`);
  });
};

export const sendChatMessage = (tripId: string, message: string) => {
  const authStore = useAuthStore();
  const userId = authStore.userId;
  const userName = authStore.userName || 'Anonymous';

  if (!userId) {
    throw new Error('User not authenticated for sending message');
  }

  const chatMessage: ChatMessage = {
    messageId: '',
    tripId,
    senderId: userId,
    senderName: userName,
    message,
    timestamp: new Date().toISOString()
  };
  socket.emit('chat:message', chatMessage);
};

export default socket;
