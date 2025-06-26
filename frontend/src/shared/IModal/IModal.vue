<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import CrossIcon from '../icons/CrossIcon.vue';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.body.style.overflow = 'initial';
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="flex w-full h-full fixed top-0 left-0 overflow-auto bg-[rgba(0,0,0,0.3)] z-50"
      @click.self="emit('close')"
    >
      <div class="relative bg-white min-w-[350px] m-auto text-black rounded-2xl p-5">
        <button class="absolute right-3 top-3" @click="emit('close')">
          <CrossIcon class="w-6 h-6" />
        </button>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
