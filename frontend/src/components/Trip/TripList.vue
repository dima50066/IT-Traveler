<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TripCard from './TripCard.vue';
import TripModal from './TripModal.vue';
import { useTripsStore } from '../../stores/trip';
import type { Trip } from '../../types';

const store = useTripsStore();
const showModal = ref(false);
const editTrip = ref<Trip | null>(null);

const openModal = (trip: Trip | null = null) => {
  editTrip.value = trip;
  showModal.value = true;
};

const closeModal = () => {
  editTrip.value = null;
  showModal.value = false;
};

onMounted(() => {
  store.fetchTrips();
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-end">
      <button
        @click="openModal()"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ➕ Нова подорож
      </button>
    </div>

    <TripCard
      v-for="trip in store.trips"
      :key="trip.id"
      :trip="trip"
      :onEdit="() => openModal(trip)"
      :onDelete="() => store.remove(trip.id)"
    />

    <TripModal v-if="showModal" :trip="editTrip" @close="closeModal" />
  </div>
</template>
