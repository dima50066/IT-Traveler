<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import IButton from '../IButton/IButton.vue';

const { loginWithRedirect, isLoading } = useAuth0();

const login = () => {
  loginWithRedirect({
    appState: { target: '/map' }
  });
};
</script>

<template>
  <form @submit.prevent="login" class="flex flex-col">
    <IButton
      class="mt-10 w-full"
      variant="gradient"
      type="submit"
      :is-loading="isLoading"
    >
      Увійти через Google
    </IButton>
  </form>
</template>
