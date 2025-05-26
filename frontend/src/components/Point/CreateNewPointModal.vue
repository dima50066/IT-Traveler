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
  notes: '',
  file: null as File | null,
  coordinates: { lat: 0, lng: 0 },
  transportMode: 'walk' as
    | 'car'
    | 'walk'
    | 'public'
    | 'plane'
    | 'train'
    | 'bike'
    | 'boat'
    | 'taxi'
    | 'shuttle',
  category: 'other' as
    | 'accommodation'
    | 'airport'
    | 'restaurant'
    | 'museum'
    | 'nature'
    | 'shopping'
    | 'station'
    | 'other',
  dayNumber: 1,
  costFromPrevious: 0
});

const resetForm = () => {
  formData.title = '';
  formData.notes = '';
  formData.file = null;
  formData.coordinates = { lat: 0, lng: 0 };
  formData.transportMode = 'walk';
  formData.category = 'other';
  formData.dayNumber = 1;
  formData.costFromPrevious = 0;
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
      <IInput label="Нотатки" type="textarea" class="mb-4" v-model="formData.notes" />

      <IInput label="День подорожі" class="mb-4" type="number" v-model="formData.dayNumber" />

      <label class="block text-sm font-medium mb-1">Тип транспорту до цього місьця</label>
      <select v-model="formData.transportMode" class="w-full border rounded p-2 mb-4">
        <option value="car">Автомобіль</option>
        <option value="walk">Пішки</option>
        <option value="public">Громадський</option>
        <option value="plane">Літак</option>
        <option value="train">Поїзд</option>
        <option value="bike">Велосипед</option>
        <option value="boat">Човен</option>
        <option value="taxi">Таксі</option>
        <option value="shuttle">Шатл</option>
      </select>

      <label class="block text-sm font-medium mb-1">Категорія</label>
      <select v-model="formData.category" class="w-full border rounded p-2 mb-4">
        <option value="accommodation">Житло</option>
        <option value="airport">Аеропорт</option>
        <option value="restaurant">Ресторан</option>
        <option value="museum">Музей</option>
        <option value="nature">Природа</option>
        <option value="shopping">Шопінг</option>
        <option value="station">Станція</option>
        <option value="other">Інше</option>
      </select>

      <IInput
        label="Бюджет до цієї точки (грн)"
        class="mb-4"
        type="number"
        v-model="formData.costFromPrevious"
      />

      <InputImage @uploaded="handleUpload">Натисніть тут, щоб додати фото</InputImage>

      <IButton class="w-full mt-4" variant="gradient" :is-loading="props.isLoading">
        Додати
      </IButton>

      <div v-if="props.hasError" class="text-red-500 mt-2">Щось пішло не так</div>
    </form>
  </IModal>
</template>
