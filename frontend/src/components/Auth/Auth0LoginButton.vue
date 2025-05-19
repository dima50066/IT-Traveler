<script setup lang="ts">
import { loginWithGoogle } from '../../api/auth/authService';
</script>

<template>
  <button
    @click="loginWithGoogle"
    type="button"
    class="mt-10 w-full flex items-center justify-center gap-4 border border-gray-300 bg-white text-[#3c4043] rounded-2xl shadow-sm hover:shadow-md transition px-6 py-3 text-base font-semibold"
  >
    <img
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google logo"
      class="w-6 h-6"
    />
    <span>Увійти через Google</span>
  </button>
</template>
