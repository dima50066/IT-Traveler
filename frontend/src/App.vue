<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import { setupAuthInterceptor } from './api/auth/interceptor';

const { getAccessTokenSilently } = useAuth0();

setupAuthInterceptor(getAccessTokenSilently);
</script>

<template>
  <router-view />
</template>
