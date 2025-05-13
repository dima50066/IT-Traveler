<script setup>
import { computed, onMounted, ref } from 'vue';
import FavoritePlaces from '../FavoritePlaces/FavoritePlaces.vue';
import UserInfo from '../UserInfo/UserInfo.vue';
import LogoutButton from '../../shared/LogoutButton/LogoutButton.vue';
import CreateNewPlaceModal from '../CreateNewPlaceModal/CreateNewPlaceModal.vue';
import { useModal } from '../../composables/useModal';
import { usePointsStore } from '../../stores/points';

const props = defineProps({
  activeId: String,
  map: Object,
  mapMarkerLngLat: Array,
});
const emit = defineEmits(['update-active', 'update-marker']);

const { isOpen, closeModal, openModal } = useModal();
const pointsStore = usePointsStore();
const isAddingPlace = ref(false);
const error = ref(null);

const favoritePlaces = computed(() => pointsStore.points);
const isPlacesLoading = computed(() => pointsStore.loading);

const changePlace = (id) => {
  const place = favoritePlaces.value.find((p) => p.id === id);
  if (!place) return;
  emit('update-active', id);
  emit('update-marker', place.coordinates);
  props.map?.flyTo({ center: place.coordinates });
};

const handleAddPlace = async (formData, resetForm) => {
  const body = { ...formData, coordinates: props.mapMarkerLngLat };
  isAddingPlace.value = true;
  try {
    await pointsStore.addPoint(body);
    resetForm();
    closeModal();
    emit('update-marker', null);
  } catch (err) {
    error.value = err;
  } finally {
    isAddingPlace.value = false;
  }
};

onMounted(() => pointsStore.fetchPoints());
</script>

<template>
  <div class="relative bg-white h-full w-[400px] shrink-0 overflow-auto pb-10 shadow-lg">
    <UserInfo />

    <div class="p-4">
      <div v-if="isPlacesLoading" class="text-gray-500 mb-4">Loading places...</div>

      <FavoritePlaces :items="favoritePlaces" :active-id="props.activeId" :is-places-loading="isPlacesLoading"
        @place-clicked="changePlace" @create="openModal" @updated="pointsStore.fetchPoints" />

      <LogoutButton class="mt-10 w-full" />

      <CreateNewPlaceModal :is-open="isOpen" :is-loading="isAddingPlace" :has-error="!!error" @close="closeModal"
        @submit="handleAddPlace" />
    </div>
  </div>
</template>
