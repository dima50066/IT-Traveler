<script setup lang="ts">
import { ref, watch } from 'vue';
import IButton from '../../shared/IButton/IButton.vue';
import IInput from '../../shared/IInput/IInput.vue';
import IModal from '../../shared/IModal/IModal.vue';
import InputImage from '../../shared/InputImage/InputImage.vue';
import MarkerIcon from '../../shared/icons/MarkerIcon.vue';
import fallbackImage from '../../assets/img/ukraine.png';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  place: { type: Object, default: null },
  isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'submit']);

const form = ref({
  title: '',
  notes: '',
  img: '',
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
  dayNumber: '1',
  costFromPrevious: '0'
});

watch(
  () => props.place,
  (newPlace) => {
    if (newPlace) {
      form.value = {
        title: newPlace.title,
        notes: newPlace.notes || '',
        img: newPlace.img || '',
        coordinates: {
          lat: newPlace.coordinates?.[0] ?? newPlace.coordinates?.lat ?? 0,
          lng: newPlace.coordinates?.[1] ?? newPlace.coordinates?.lng ?? 0
        },
        transportMode: newPlace.transportMode || 'walk',
        category: newPlace.category || 'other',
        dayNumber: String(newPlace.dayNumber ?? 1),
        costFromPrevious: String(newPlace.costFromPrevious ?? 0)
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (!props.place) return;

  emit('submit', {
    id: props.place._id || props.place.id,
    ...form.value,
    dayNumber: Number(form.value.dayNumber),
    costFromPrevious: Number(form.value.costFromPrevious)
  });
};

const handleImageChange = (image: string) => {
  form.value.img = image;
};
</script>

<template>
  <IModal v-if="props.isOpen" @close="emit('close')">
    <div class="w-[750px]">
      <div class="flex gap-2 items-center mb-10">
        <MarkerIcon height="18" width="18" />
        <span class="font-bold text-base">Редагувати маркер</span>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="flex gap-5">
          <div class="w-5/12">
            <img
              class="w-full h-[276px] object-cover rounded-md"
              :src="form.img || fallbackImage"
              alt="place img"
            />
          </div>

          <div class="w-7/12">
            <IInput label="Локація" v-model="form.title" class="mb-4" />
            <IInput label="Нотатки" type="textarea" v-model="form.notes" class="mb-4" />

            <IInput
              label="День подорожі"
              type="number"
              min="1"
              class="mb-4"
              v-model="form.dayNumber"
            />

            <IInput
              label="Бюджет до цієї точки (грн)"
              type="number"
              min="0"
              class="mb-4"
              v-model="form.costFromPrevious"
            />

            <label class="block text-sm font-medium mb-1">Тип транспорту до цього місця</label>
            <select v-model="form.transportMode" class="w-full border rounded p-2 mb-4">
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
            <select v-model="form.category" class="w-full border rounded p-2 mb-4">
              <option value="accommodation">Житло</option>
              <option value="airport">Аеропорт</option>
              <option value="restaurant">Ресторан</option>
              <option value="museum">Музей</option>
              <option value="nature">Природа</option>
              <option value="shopping">Шопінг</option>
              <option value="station">Станція</option>
              <option value="other">Інше</option>
            </select>

            <IButton class="mt-4 w-full" variant="gradient" :disabled="props.isLoading">
              Зберегти
            </IButton>
          </div>
        </div>

        <InputImage class="mt-3" @update="handleImageChange">
          <span class="text-xs">Натисніть тут, щоб додати інше фото</span>
        </InputImage>
      </form>
    </div>
  </IModal>
</template>
