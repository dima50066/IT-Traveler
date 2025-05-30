<script setup lang="ts">
import TripList from '../Trip/TripList.vue';
import PointList from '../Point/PointList.vue';
import CreateNewPointModal from '../Point/CreateNewPointModal.vue';
import { onMounted, ref, computed } from 'vue';
import { useTripsStore } from '../../stores/trip';
import { usePointsStore } from '../../stores/points';
import type { Trip, AddPointRequest } from '../../types';
import { useTripLifecycle } from '../../composables/useTripLifecycle';
import type { Map as MapboxMapInstance } from 'mapbox-gl';
import { useModal } from '../../composables/useModal';

const props = defineProps<{
  mapMarkerLngLat: [number, number] | null;
  map: MapboxMapInstance | undefined;
  activeId: string | null;
}>();

const emit = defineEmits<{
  (e: 'update-active', id: string): void;
  (e: 'update-marker', coords: [number, number]): void;
  (e: 'clear-trip'): void;
  (e: 'open-chat', tripId: string): void;
}>();

const tripsStore = useTripsStore();
const pointsStore = usePointsStore();
const activeTrip = computed(() => tripsStore.activeTrip);

const isCreateOpen = ref(false);
const isCreateLoading = ref(false);
const hasCreateError = ref(false);

const { selectTrip, clearTrip } = useTripLifecycle();

const {
  isOpen: isInviteModalOpen,
  openModal: openInviteModal,
  closeModal: closeInviteModal
} = useModal();

onMounted(() => {
  tripsStore.fetchTrips();
});

const handleTripSelect = async (trip: Trip) => {
  await selectTrip(trip);
  await pointsStore.fetchPoints(trip._id);
};

const clearActiveTrip = () => {
  clearTrip();
  pointsStore.clearPoints();
  emit('clear-trip');
};

const handleCreate = async (
  formData: Omit<AddPointRequest, 'tripId'> & { file?: File },
  resetForm: () => void
) => {
  const tripId = activeTrip.value?._id;
  const coords = props.mapMarkerLngLat;

  if (!tripId || !coords) return;

  isCreateLoading.value = true;
  hasCreateError.value = false;

  try {
    await pointsStore.addPoint({
      ...formData,
      tripId,
      coordinates: { lat: coords[1], lng: coords[0] },
      dayNumber: formData.dayNumber ?? 1,
      costFromPrevious: formData.costFromPrevious ?? 0
    });
    resetForm();
    isCreateOpen.value = false;
  } catch (err) {
    return err;
  } finally {
    isCreateLoading.value = false;
  }
};

const handlePlaceClicked = (id: string) => {
  const point = pointsStore.points.find((p) => p._id === id);
  if (point && props.map && point.coordinates) {
    props.map.flyTo({ center: [point.coordinates.lng, point.coordinates.lat], zoom: 14 });
    emit('update-active', id);
  }
};

const openChat = (tripId: string) => {
  emit('open-chat', tripId);
};
</script>

<template>
  <div class="relative bg-white h-full w-[400px] shrink-0 overflow-auto pb-10 shadow-lg">
    <div class="p-4 space-y-8">
      <template v-if="activeTrip">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-xl font-bold">{{ activeTrip.title }}</h2>
          <button @click="clearActiveTrip" class="text-red-500 text-sm hover:underline">
            ← Назад
          </button>
        </div>

        <PointList
          :items="pointsStore.points"
          :active-id="props.activeId"
          :trip-id="activeTrip._id"
          :is-places-loading="pointsStore.loading"
          :is-invite-modal-open="isInviteModalOpen"
          @create="() => (isCreateOpen = true)"
          @place-clicked="handlePlaceClicked"
          @open-chat="openChat"
          @open-invite="openInviteModal"
          @close-invite="closeInviteModal"
        />
      </template>

      <template v-else>
        <TripList @trip-selected="handleTripSelect" />
      </template>

      <CreateNewPointModal
        :isOpen="isCreateOpen"
        :isLoading="isCreateLoading"
        :hasError="hasCreateError"
        @close="() => (isCreateOpen = false)"
        @submit="handleCreate"
      />
    </div>
  </div>
</template>
