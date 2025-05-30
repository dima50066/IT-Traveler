import { clientFetch } from '../clientFetch';
import { ChatMessage } from '../../types';

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  tripTitle: string;
}

export const fetchChatHistory = (tripId: string): Promise<ChatHistoryResponse> => {
  return clientFetch
    .get(`/chat/${tripId}/chat/messages`)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const sendChatMessageAPI = (tripId: string, message: string): Promise<ChatMessage> => {
  return clientFetch
    .post(`/chat/${tripId}/chat/messages`, { message })
    .then((res) => res.data.message)
    .catch((err) => {
      throw err;
    });
};
