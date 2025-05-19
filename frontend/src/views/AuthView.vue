<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import { useAuthStore } from '../stores/auth';
import { fetchOrCreateUser } from '../api/user';
import { useRouter, useRoute } from 'vue-router';
import GoogleLoginButton from '../components/Auth/Auth0LoginButton.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isLoading = ref(true);

onMounted(async () => {
  const token = route.query.token as string | undefined;

  if (token) {
    try {
      authStore.setToken(token);
      const user = await fetchOrCreateUser(token);
      authStore.setUser(user);
      router.replace('/map');
    } catch (err) {
      console.error('❌ Token invalid or user fetch failed:', err);
      isLoading.value = false;
    }
  } else {
    isLoading.value = false;
  }
});
</script>

<template>
  <BaseLayout>
    <section class="w-full bg-white p-10 rounded-2xl text-center">
      <h2 class="text-2xl font-bold mb-6">Авторизація</h2>
      <p class="text-[#939393] mb-10">Натисни кнопку нижче, щоб увійти через Google</p>

      <GoogleLoginButton v-if="!isLoading" />

      <p v-else class="text-[#939393]">Завантаження...</p>
    </section>
  </BaseLayout>
</template>
