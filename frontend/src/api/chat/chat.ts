import { clientFetch } from '../clientFetch';

export interface ChatMessage {
  messageId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

export const fetchChatHistory = (): Promise<ChatMessage[]> => {
  return clientFetch.get('/chat').then((res) => res.data);
};

export const sendChatMessageAPI = (message: string): Promise<void> => {
  return clientFetch.post('/chat', { message }).then(() => {});
};
