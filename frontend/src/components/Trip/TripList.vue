<script setup lang="ts">
import TripCard from './TripCard.vue';
import TripModal from './TripModal.vue';
import { useTripsStore } from '../../stores/trip';
import type { Trip } from '../../types';
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'trip-selected', trip: Trip): void;
  (e: 'open-chat', tripId: string): void;
}>();

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

const handleInvite = async (userId: string) => {
  if (editTrip.value?._id) {
    try {
      await store.invite(editTrip.value._id, { userId });
      closeModal();
    } catch (error) {
      return error;
    }
  }
};

const openTripChat = () => {
  if (editTrip.value?.chatId) {
    emit('open-chat', editTrip.value._id);
  }
};

const handleDelete = async (tripId: string) => {
  try {
    await store.remove(tripId);
    await store.fetchTrips();
  } catch (error) {
    throw error;
  }
};
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
      @click="$emit('trip-selected', trip)"
      :onEdit="() => openModal(trip)"
      :onDelete="() => handleDelete(trip.id)"
    />

    <TripModal
      v-if="showModal"
      :trip="editTrip"
      @close="closeModal"
      @invite="handleInvite"
      @open-chat="openTripChat"
    />
  </div>
</template>
