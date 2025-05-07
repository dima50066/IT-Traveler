<script setup lang="ts">
import { ref } from 'vue';
import UploadIcon from './UploadIcon.vue';

const emit = defineEmits(['uploaded']);

const errorMessage = ref('');

const handleUploadImg = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  if (file.size > 3 * 1024 * 1024) {
    errorMessage.value = 'Завеликий файл';
    return;
  }

  errorMessage.value = '';
  emit('uploaded', file);
};
</script>

<template>
  <div>
    <label class="cursor-pointer hover:text-primary">
      <input type="file" accept="image/*" class="hidden" @change="handleUploadImg" />
      <span class="flex gap-1 items-center">
        <UploadIcon />
        <span class="underline text-xs">
          <slot></slot>
        </span>
      </span>
    </label>
    <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
  </div>
</template>
