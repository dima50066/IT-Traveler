<script setup lang="ts">
import { ref, watch } from 'vue';
import SidebarPanel from '../components/SidebarPanel/SidebarPanel.vue';
import SearchPanel from '../components/SearchPanel/SearchPanel.vue';
import MapMarkers from '../components/MapMarkers/MapMarkers.vue';
import RouteLine from '../components/RouteLine/RouteLine.vue';
import UserDropdown from '../components/UserDropdown/UserDropdown.vue';
import ChatView from '../components/Chat/ChatView.vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import { usePointsStore } from '../stores/points';
import { useTripsStore } from '../stores/trip';
import type { Map as MapboxMapInstance } from 'mapbox-gl';
import { useRouteLines } from '../composables/useRouteLines';

const pointsStore = usePointsStore();
const tripsStore = useTripsStore();

const activeId = ref<string | null>(null);
const map = ref<MapboxMapInstance | undefined>();
const mapMarkerLngLat = ref<[number, number] | null>(null);
const searchText = ref('');
const isNewPlace = ref(false);
const isChatOpen = ref(false);
const { removeLines } = useRouteLines();

const handleGetMap = (mapInstance: MapboxMapInstance) => {
  map.value = mapInstance;
};

const clearActiveTrip = () => {
  if (map.value) removeLines(map.value);
  tripsStore.setActiveTrip(null);
  pointsStore.clearPoints();
  mapMarkerLngLat.value = null;
  isNewPlace.value = false;
  isChatOpen.value = false;
};

watch(
  () => tripsStore.activeTrip,
  (newTrip) => {
    if (newTrip) pointsStore.fetchPoints(newTrip._id);
  }
);

const openChat = (tripId: string) => {
  if (tripsStore.activeTrip?._id === tripId) {
    isChatOpen.value = true;
  } else {
  }
};

const closeChat = () => {
  isChatOpen.value = false;
};
</script>

<template>
  <main class="flex h-screen overflow-hidden">
    <SidebarPanel
      v-if="map !== undefined"
      :active-id="activeId"
      :map="map"
      :map-marker-lng-lat="mapMarkerLngLat"
      @update-active="(id: string) => (activeId = id)"
      @clear-trip="clearActiveTrip"
      @update-marker="
        (coords: [number, number]) => {
          mapMarkerLngLat = coords;
          isNewPlace = true;
        }
      "
      @open-chat="openChat"
      @get-map="handleGetMap"
    />

    <div
      v-if="isChatOpen && tripsStore.activeTrip?.chatId"
      class="w-[300px] h-full border-l border-gray-200 bg-white"
    >
      <ChatView :trip-id="tripsStore.activeTrip?._id || ''" @close="closeChat" />
    </div>

    <div class="flex-1 h-full relative">
      <SearchPanel
        v-model:search-text="searchText"
        @place-selected="
          (lngLat: [number, number], name: string) => {
            if (map) {
              map.flyTo({ center: lngLat, zoom: 14 });
            }
            mapMarkerLngLat = lngLat;
            searchText = name;
          }
        "
      />

      <MapMarkers
        :map="map"
        :marker-position="mapMarkerLngLat"
        :active-id="activeId"
        :is-new-place="isNewPlace"
        @cancel-new-marker="
          () => {
            mapMarkerLngLat = null;
            isNewPlace = false;
          }
        "
        @marker-clicked="
          (id: string) => {
            activeId = id;
            isNewPlace = false;
          }
        "
        @map-clicked="
          (lngLat: [number, number]) => {
            mapMarkerLngLat = lngLat;
            isNewPlace = true;
          }
        "
        @get-map="handleGetMap"
      />

      <RouteLine :map="map" :points="pointsStore.points" />
    </div>

    <UserDropdown />
  </main>
</template>
