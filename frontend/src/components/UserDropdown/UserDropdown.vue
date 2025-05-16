<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import NotificationBellIcon from './NotificationBellIcon.vue';
import NotificationBellActiveIcon from './NotificationBellActiveIcon.vue';

const authStore = useAuthStore();
const router = useRouter();
const isOpen = ref(false);
const hasNotifications = ref(false);

const logout = () => {
    authStore.clear();
    localStorage.removeItem('token');
    router.push('/auth');
};
</script>

<template>
    <div class="absolute top-5 right-5 z-50" @mouseenter="isOpen = true" @mouseleave="isOpen = false">
        <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow cursor-pointer">
            <img :src="authStore.user?.picture" alt="Avatar" class="w-10 h-10 rounded-full object-cover" />
            <div class="text-left hidden sm:block">
                <p class="text-sm font-semibold text-gray-800">
                    {{ authStore.user?.name }}
                </p>
                <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
            </div>

            <component :is="hasNotifications ? NotificationBellActiveIcon : NotificationBellIcon"
                class="w-5 h-5 text-gray-600" />
        </div>

        <div v-if="isOpen" class="mt-2 bg-white shadow-xl rounded-lg p-4 w-64 transition-all duration-300">
            <ul class="space-y-1 text-sm text-left">
                <li class="cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition">
                    📚 Мої подорожі
                </li>
                <li class="cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition">
                    💡 Обрані місця
                </li>
                <li class="cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition">
                    📝 To-do
                </li>
                <li class="cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition">
                    🧾 Бюджет
                </li>
                <li class="cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition">
                    💬 Чати
                </li>
                <li class="cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition">
                    ⚙️ Налаштування
                </li>
            </ul>

            <button @click="logout"
                class="mt-4 w-full text-red-500 text-sm flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition">
                🚪 Вийти
            </button>
        </div>
    </div>
</template>
  
