<script setup lang="ts">
import { reactive } from 'vue';
import IButton from '../../shared/IButton/IButton.vue';
import IInput from '../../shared/IInput/IInput.vue';
import IModal from '../../shared/IModal/IModal.vue';
import InputImage from '../../shared/InputImage/InputImage.vue';
import MarkerIcon from '../../shared/icons/MarkerIcon.vue';

const props = defineProps({
  isOpen: Boolean,
  isLoading: Boolean,
  hasError: Boolean
});

const emit = defineEmits(['close', 'submit']);

const formData = reactive({
  title: '',
  description: '',
  file: null as File | null,
  coordinates: [0, 0] as [number, number],
  status: 'wishlist' as 'wishlist' | 'visited'
});

const resetForm = () => {
  formData.title = '';
  formData.description = '';
  formData.file = null;
  formData.status = 'wishlist';
};

const handleUpload = (file: File) => {
  formData.file = file;
};
</script>

<template>
  <IModal v-if="props.isOpen" @close="emit('close')">
    <form @submit.prevent="emit('submit', formData, resetForm)" class="min-w-[420px]">
      <div class="flex gap-1 justify-center font-bold text-center mb-10">
        <MarkerIcon /> Додати маркер
      </div>

      <IInput label="Локація" class="mb-4" v-model="formData.title" />
      <IInput label="Опис" type="textarea" class="mb-4" v-model="formData.description" />

      <label class="block text-sm font-medium mb-1">Статус</label>
      <select v-model="formData.status" class="w-full border rounded p-2 mb-4">
        <option value="wishlist">До відвідин</option>
        <option value="visited">Відвідане</option>
      </select>

      <InputImage @uploaded="handleUpload">Натисніть тут, щоб додати фото</InputImage>

      <IButton class="w-full mt-4" variant="gradient" :is-loading="props.isLoading">Додати</IButton>
      <div v-if="props.hasError" class="text-red-500 mt-2">Щось пішло не так</div>
    </form>
  </IModal>
</template>
