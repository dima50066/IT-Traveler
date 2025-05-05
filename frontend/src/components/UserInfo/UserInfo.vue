<script setup>
import { useAuth0 } from '@auth0/auth0-vue';

const { user, isLoading } = useAuth0();
</script>

<template>
  <div class="flex items-center gap-3">
    <span v-if="isLoading">Loading...</span>
    <span v-else>{{ user?.name }}</span>
  </div>
</template>
