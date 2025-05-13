<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { useAuthStore } from '../../stores/auth';
import LogoutIcon from './LogoutIcon.vue';

const { logout } = useAuth0();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.clear();
  logout({ logoutParams: { returnTo: window.location.origin } });
};
</script>

<template>
  <button class="flex gap-2 items-center px-6 text-black" @click="handleLogout">
    <span>Вихід</span>
    <LogoutIcon />
  </button>
</template>
