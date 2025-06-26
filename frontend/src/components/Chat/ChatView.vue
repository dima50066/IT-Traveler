<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import socket from '../../api/socket';
import { fetchChatHistory } from '../../api/chat/chat';
import { useChatStore } from '../../stores/chat';
import { useAuthStore } from '../../stores/auth';
import type { ChatMessage } from '../../types';

const props = defineProps<{ tripId: string }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const chatStore = useChatStore();
const authStore = useAuthStore();
const newMessage = ref('');

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const user = authStore.user;
  if (!user?._id) {
    return;
  }

  const payload: ChatMessage = {
    messageId: crypto.randomUUID(),
    message: newMessage.value.trim(),
    senderId: user._id,
    senderName: user.name || user.email || 'Anonymous',
    tripId: props.tripId,
    timestamp: new Date().toISOString()
  };

  socket.emit('chat:message', payload);
  newMessage.value = '';
};

onMounted(async () => {
  socket.connect();

  socket.on('connect', () => {
    return;
  });

  socket.on('disconnect', () => {
    return;
  });

  socket.on('chat:message', (msg: ChatMessage) => {
    if (
      msg.tripId === props.tripId &&
      !chatStore.messages.some((m) => m.messageId === msg.messageId)
    ) {
      chatStore.addMessage(msg);
    }
  });

  if (props.tripId) {
    const history = await fetchChatHistory(props.tripId);
    chatStore.setMessages(history.messages.reverse());
  }
});

const handleClose = () => {
  emit('close');
};

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>
<template>
  <div
    class="chat-container flex flex-col h-dvh md:h-full p-4 bg-white md:bg-transparent border-none md:border-l md:border-gray-200 shadow-none md:shadow-md"
  >
    <div class="flex justify-end mb-2">
      <button
        @click="handleClose"
        class="text-red-500 hover:underline text-lg md:text-sm md:p-0 p-2 -mr-2 md:-mr-0"
        aria-label="Закрити чат"
      >
        <span class="hidden md:inline">Закрити</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-6 h-6 md:hidden"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <div class="flex-1 overflow-auto mb-4 space-y-3">
      <div v-for="msg in chatStore.messages" :key="msg.messageId" class="break-words">
        <div class="text-[13px] md:text-sm">
          <strong>{{ msg.senderName || msg.senderId }}:</strong>
          {{ msg.message }}
        </div>
        <div class="text-[11px] md:text-xs text-gray-400">
          {{ msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Invalid Date' }}
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="flex gap-2">
      <input
        v-model="newMessage"
        placeholder="Type a message..."
        class="flex-1 border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded text-sm active:scale-95 transition-transform"
      >
        Send
      </button>
    </form>
  </div>
</template>
