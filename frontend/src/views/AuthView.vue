<script setup>
import Auth0LoginButton from '../components/Auth/Auth0LoginButton.vue'
import BaseLayout from '../layouts/BaseLayout.vue'

</script>

<template>
  <BaseLayout>
    <section class="w-full bg-white p-10 rounded-2xl text-center">
      <h2 class="text-2xl font-bold mb-6">Авторизація</h2>
      <p class="text-[#939393] mb-10">
        Натисни кнопку нижче, щоб увійти через Google
      </p>
      <Auth0LoginButton />
    </section>
  </BaseLayout>
</template>
