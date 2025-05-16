<script setup>
import { useAuthStore } from '../../stores/auth';
import LogoutIcon from './LogoutIcon.vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.clear();
  router.push('/');
};
</script>

<template>
  <button class="flex gap-2 items-center px-6 text-black" @click="handleLogout">
    <span>Вихід</span>
    <LogoutIcon />
  </button>
</template>
