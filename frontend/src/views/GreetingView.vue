<script setup>
import { useRouter } from 'vue-router';
import IButton from '../shared/IButton/IButton.vue';
import BaseLayout from '../layouts/BaseLayout.vue';

const router = useRouter();

const goToAuth = () => {
    router.push('/auth');
};
</script>

<template>
    <BaseLayout>
        <div class="text-center">
            <img class="inline mb-6" src="../assets/img/map-pin.svg" alt="" />
            <h1 class="font-bold text-4xl mb-7">IT traveler</h1>
            <p class="leading-6 mb-11">
                Простий і зручний веб додаток, який дозволить тобі відмічати твої улюблені місця, а також
                ті, в яких би ти дуже хотів побувати. Тож не зволікай і спробуй сам.
            </p>
            <IButton @click="goToAuth">Почати роботу</IButton>
        </div>
    </BaseLayout>
</template>