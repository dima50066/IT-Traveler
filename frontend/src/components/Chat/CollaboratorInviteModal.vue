<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTripsStore } from '../../stores/trip';
import { useAuthStore } from '../../stores/auth';

const props = defineProps<{ tripId: string }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const tripsStore = useTripsStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const selectedUserId = ref('');

const suggestions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return [];

  return authStore.allUsers.filter(
    (user) => user.email.toLowerCase().includes(query) || user.name?.toLowerCase().includes(query)
  );
});

const inviteCollaborator = async () => {
  if (!selectedUserId.value) {
    return;
  }

  try {
    await tripsStore.invite(props.tripId, { userId: selectedUserId.value });
    emit('close');
  } catch (error) {
    return error;
  }
};

onMounted(async () => {
  await authStore.loadUsers();
});
</script>
<template>
  <div class="p-4 sm:p-6 max-w-md mx-auto">
    <h3 class="text-lg font-bold mb-4 text-center sm:text-left">Запросити колаборанта</h3>

    <input
      v-model="searchQuery"
      placeholder="Введіть email або ім'я"
      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
    />

    <ul v-if="suggestions.length" class="border rounded max-h-40 overflow-auto mb-4 divide-y">
      <li
        v-for="user in suggestions"
        :key="user._id"
        @click="
          () => {
            selectedUserId = user._id;
            searchQuery = user.email;
          }
        "
        class="p-2 hover:bg-blue-100 cursor-pointer"
      >
        <div class="font-semibold truncate">{{ user.name || 'Без імені' }}</div>
        <div class="text-sm text-gray-500 truncate">{{ user.email }}</div>
      </li>
    </ul>

    <div class="flex flex-col sm:flex-row gap-2">
      <button
        @click="inviteCollaborator"
        class="bg-blue-500 text-white p-2 rounded text-center w-full sm:w-auto"
      >
        Запросити
      </button>
      <button
        @click="$emit('close')"
        class="bg-gray-500 text-white p-2 rounded text-center w-full sm:w-auto"
      >
        Закрити
      </button>
    </div>
  </div>
</template>
