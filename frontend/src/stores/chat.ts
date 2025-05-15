import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ChatMessage } from '../api/chat/chat';

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([]);

  const addMessage = (msg: ChatMessage) => {
    messages.value.push(msg);
  };

  const setMessages = (all: ChatMessage[]) => {
    messages.value = all;
  };

  return {
    messages,
    addMessage,
    setMessages
  };
});
