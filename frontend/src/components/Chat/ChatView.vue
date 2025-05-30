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
  <div class="chat-container p-4 border rounded shadow-md h-full flex flex-col">
    <div class="flex justify-end mb-2">
      <button @click="handleClose" class="text-red-500 hover:underline text-sm">Закрити</button>
    </div>
    <div class="messages flex-1 overflow-auto mb-4">
      <div v-for="msg in chatStore.messages" :key="msg.messageId" class="mb-2 break-words">
        <strong>{{ msg.senderName || msg.senderId }}:</strong>
        {{ msg.message }}
        <div class="text-xs text-gray-400">
          {{ msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Invalid Date' }}
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="flex gap-2">
      <input
        v-model="newMessage"
        placeholder="Type a message..."
        class="flex-1 border px-2 py-1 rounded text-sm"
      />
      <button type="submit" class="px-4 py-1 bg-blue-500 text-white rounded text-sm">Send</button>
    </form>
  </div>
</template>
