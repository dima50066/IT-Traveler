<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import socket from '../../api/socket';
import { fetchChatHistory, ChatMessage } from '../../api/chat/chat';
import { useChatStore } from '../../stores/chat';
import { useAuthStore } from '../../stores/auth';

const chatStore = useChatStore();
const authStore = useAuthStore();
const newMessage = ref('');

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const user = authStore.user;
  if (!user?._id) {
    console.warn('⛔ User not ready or missing _id');
    return;
  }

  const payload = {
    message: newMessage.value.trim(),
    senderId: user._id,
    senderName: user.name || user.email || 'Анонім'
  };

  socket.emit('chat:message', payload);
  newMessage.value = '';
};

onMounted(async () => {
  socket.connect();

  socket.on('connect', () => {
    console.log('✅ Connected to WebSocket');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from WebSocket');
  });

  socket.on('chat:message', (msg: ChatMessage) => {
    console.log('📩 Socket received:', msg);

    const exists = chatStore.messages.some((m) => m.messageId === msg.messageId);
    if (!exists) {
      chatStore.addMessage(msg);
    }
  });

  const history = await fetchChatHistory();
  chatStore.setMessages(history.reverse());
});

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>

<template>
  <div>Тест</div>
  <div class="chat-container p-4 border rounded shadow-md h-full flex flex-col">
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
