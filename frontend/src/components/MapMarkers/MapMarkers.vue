<script setup lang="ts">
import { MapboxMap, MapboxMarker } from '@studiometa/vue-mapbox-gl';
import MarkerIcon from '../../shared/icons/MarkerIcon.vue';
import { mapSettings } from '../../map/settings';
import { computed, onMounted, onBeforeUnmount } from 'vue';
import { usePointsStore } from '../../stores/points';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { MapLayerMouseEvent } from 'mapbox-gl';
import type { Map as MapboxMapInstance } from 'mapbox-gl';

type Coordinates = [number, number];

defineProps<{
  markerPosition: Coordinates | null;
  activeId: string | null;
  map: MapboxMapInstance | undefined;
  isNewPlace: boolean;
}>();

const emit = defineEmits<{
  (e: 'marker-clicked', id: string): void;
  (e: 'map-clicked', lngLat: [number, number]): void;
  (e: 'get-map', mapInstance: MapboxMapInstance): void;
  (e: 'cancel-new-marker'): void;
}>();

const pointsStore = usePointsStore();
const favoritePlaces = computed(() => pointsStore.points);

const handleMapClick = (event: MapLayerMouseEvent) => {
  const lngLat: [number, number] = [event.lngLat.lng, event.lngLat.lat];
  emit('map-clicked', lngLat);
};

onMounted(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      emit('cancel-new-marker');
    }
  };

  document.addEventListener('keydown', handleKey);

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKey);
  });
});
</script>

<template>
  <MapboxMap
    class="w-full h-full"
    :center="[30.523333, 50.450001]"
    :zoom="10"
    :access-token="mapSettings.apiToken"
    :map-style="mapSettings.style"
    @mb-click="handleMapClick"
    @mb-created="(mapInstance: MapboxMapInstance) => emit('get-map', mapInstance)"
  >
    <MapboxMarker v-if="isNewPlace && markerPosition" :lngLat="markerPosition" anchor="bottom">
      <MarkerIcon class="h-8 w-8" is-active />
    </MapboxMarker>
    <MapboxMarker
      v-for="place in favoritePlaces"
      :key="place._id"
      :lngLat="place.coordinates"
      anchor="bottom"
    >
      <button @click.stop="emit('marker-clicked', place._id)">
        <MarkerIcon class="h-8 w-8" />
      </button>
    </MapboxMarker>
  </MapboxMap>
</template>
