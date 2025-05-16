<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';
import NotificationBellIcon from './NotificationBellIcon.vue';
import NotificationBellActiveIcon from './NotificationBellActiveIcon.vue';

const authStore = useAuthStore();
const user = authStore.user;
const isLoading = !user; 
const hasNotifications = false;
</script>

<template>
  <div class="flex items-center justify-between gap-4 p-4 border-b border-gray-200">
    <div class="flex items-center gap-3">
      <span v-if="isLoading" class="text-gray-500">Loading user info...</span>
      <template v-else>
        <img v-if="user.picture" :src="user.picture" :alt="user.name" class="rounded-full w-12 h-12 object-cover" />
        <div class="flex flex-col">
          <span class="font-semibold text-lg text-gray-800">{{ user.name }}</span>
          <span class="text-sm text-gray-500">{{ user.email }}</span>
        </div>
      </template>
    </div>

    <button>
      <component :is="hasNotifications ? NotificationBellActiveIcon : NotificationBellIcon" />
    </button>
  </div>
</template>
