<script setup lang="ts">
import { RouterView } from 'vue-router';
import { setupAuthInterceptor } from './api/auth/interceptor';

setupAuthInterceptor();
</script>

<template>
  <router-view />
</template>
