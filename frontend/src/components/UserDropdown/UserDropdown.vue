<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import NotificationBellIcon from './NotificationBellIcon.vue';
import NotificationBellActiveIcon from './NotificationBellActiveIcon.vue';
import { useTripsStore } from '../../stores/trip';

const authStore = useAuthStore();
const router = useRouter();
const tripsStore = useTripsStore();
const isOpen = ref(false);
const hasNotifications = ref(false);
const isNotificationPanelOpen = ref(false);
const fallbackAvatar =
  'https://res.cloudinary.com/divyszzpf/image/upload/v1754304127/e2ft3t0ptrwg6rco1rsm_rwgw4q.png';

const logout = () => {
  authStore.clear();
  localStorage.removeItem('token');
  router.push('/auth');
};

watch(
  () => tripsStore.notifications.length,
  (newLength) => {
    hasNotifications.value = newLength > 0;
  }
);

const toggleNotificationPanel = () => {
  isNotificationPanelOpen.value = !isNotificationPanelOpen.value;
};
</script>

<template>
  <div class="absolute top-5 right-5 z-50" @mouseenter="isOpen = true" @mouseleave="isOpen = false">
    <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow cursor-pointer">
      <img
        :src="authStore.user?.picture || fallbackAvatar"
        alt="Avatar"
        class="w-10 h-10 rounded-full object-cover"
      />

      <div class="text-left hidden sm:block">
        <p class="text-sm font-semibold text-gray-800">
          {{ authStore.user?.name }}
        </p>
        <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
      </div>
      <component
        :is="hasNotifications ? NotificationBellActiveIcon : NotificationBellIcon"
        class="w-5 h-5 text-gray-600"
        @click.stop="toggleNotificationPanel"
      />
    </div>

    <div
      v-if="isOpen"
      class="mt-2 bg-white shadow-xl rounded-lg p-4 w-64 transition-all duration-300"
    >
      <button
        @click="logout"
        class="w-full text-red-500 text-sm flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition"
      >
        🚪 Вийти
      </button>
    </div>
  </div>
</template>
