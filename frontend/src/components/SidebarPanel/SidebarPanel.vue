<script setup lang="ts">
import TripList from '../Trip/TripList.vue';
import { onMounted } from 'vue';
import { useTripsStore } from '../../stores/trip';

const store = useTripsStore();

onMounted(() => {
  store.fetchTrips();
});
</script>

<template>
  <div class="relative bg-white h-full w-[400px] shrink-0 overflow-auto pb-10 shadow-lg">
    <div class="p-4">
      <TripList />
    </div>
  </div>
</template>
