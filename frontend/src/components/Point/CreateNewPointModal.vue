<script setup lang="ts">
import { reactive } from 'vue';
import IButton from '../../shared/IButton/IButton.vue';
import IInput from '../../shared/IInput/IInput.vue';
import IModal from '../../shared/IModal/IModal.vue';
import InputImage from '../../shared/InputImage/InputImage.vue';
import MarkerIcon from '../../shared/icons/MarkerIcon.vue';

const { isOpen, isLoading, hasError } = defineProps({
  isOpen: Boolean,
  isLoading: Boolean,
  hasError: Boolean
});

const emit = defineEmits(['close', 'submit']);

const formData = reactive({
  title: '',
  description: '',
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
  formData.description = '';
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
  <IModal :is-open="isOpen" @close="emit('close')">
    <form
      @submit.prevent="emit('submit', formData, resetForm)"
      class="w-[90vw] sm:min-w-[320px] max-w-md md:max-w-lg bg-white sm:p-6 rounded-lg flex flex-col gap-4 text-sm"
    >
      <div class="flex items-center justify-center gap-1 font-semibold text-base sm:text-lg">
        <MarkerIcon class="h-5 w-5" /> Додати маркер
      </div>

      <div class="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
        <IInput label="Локація" v-model="formData.title" />

        <IInput
          label="День подорожі"
          type="number"
          v-model="formData.dayNumber"
          class="lg:col-start-2"
        />

        <IInput label="Опис" type="textarea" v-model="formData.description" class="lg:col-span-2" />

        <div>
          <label class="block text-xs font-medium mb-1">Тип транспорту</label>
          <select v-model="formData.transportMode" class="w-full border rounded px-2 py-1">
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
        </div>

        <div>
          <label class="block text-xs font-medium mb-1">Категорія</label>
          <select v-model="formData.category" class="w-full border rounded px-2 py-1">
            <option value="accommodation">Житло</option>
            <option value="airport">Аеропорт</option>
            <option value="restaurant">Ресторан</option>
            <option value="museum">Музей</option>
            <option value="nature">Природа</option>
            <option value="shopping">Шопінг</option>
            <option value="station">Станція</option>
            <option value="other">Інше</option>
          </select>
        </div>

        <IInput
          label="Бюджет (грн)"
          type="number"
          v-model="formData.costFromPrevious"
          class="lg:col-span-2"
        />

        <InputImage @uploaded="handleUpload" class="lg:col-span-2">
          Натисніть, щоб додати фото
        </InputImage>
      </div>

      <IButton class="w-full text-sm" variant="gradient" :is-loading="isLoading"> Додати </IButton>

      <p v-if="hasError" class="text-red-500 text-xs text-center">
        Щось пішло не так. Спробуйте ще раз.
      </p>
    </form>
  </IModal>
</template>
