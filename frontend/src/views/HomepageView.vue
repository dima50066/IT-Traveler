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
const isSidebarOpen = ref(false);

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
    isSidebarOpen.value = false;
  }
};

const closeChat = () => {
  isChatOpen.value = false;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <main class="h-screen overflow-hidden relative select-none md:flex">
    <button
      class="absolute z-[999] top-4 left-4 p-2 bg-white rounded shadow md:hidden"
      aria-label="Toggle menu"
      @click="toggleSidebar"
    >
      <svg
        v-if="!isSidebarOpen"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
      <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <div
      v-show="isSidebarOpen"
      class="fixed inset-0 bg-black/40 z-40 md:hidden"
      @click="closeSidebar"
    />

    <transition name="slide">
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
        class="fixed md:static inset-y-0 left-0 w-[90vw] max-w-xs md:w-80 bg-white z-50 md:z-auto transform md:transform-none"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      />
    </transition>

    <div class="h-full w-full md:flex-1 relative">
      <div
        v-if="!isSidebarOpen && !isChatOpen"
        class="absolute bottom-20 left-0 w-full px-4 pb-4 z-50 lg:static lg:px-0 lg:pb-0"
      >
        <SearchPanel
          v-model:search-text="searchText"
          @place-selected="
            (lngLat: [number, number], name: string) => {
              if (map) map.flyTo({ center: lngLat, zoom: 14 });
              mapMarkerLngLat = lngLat;
              searchText = name;
            }
          "
        />
      </div>

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

      <UserDropdown v-if="!isSidebarOpen && !isChatOpen" class="absolute right-4 top-4 z-30" />
    </div>

    <div
      v-if="isChatOpen && tripsStore.activeTrip?.chatId"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
    >
      <div class="absolute inset-0 bg-white" @click.self="closeChat">
        <ChatView :trip-id="tripsStore.activeTrip?._id || ''" @close="closeChat" class="h-full" />
      </div>
    </div>

    <div
      v-if="isChatOpen && tripsStore.activeTrip?.chatId"
      class="hidden md:block w-[300px] h-full bg-white z-30"
    >
      <ChatView :trip-id="tripsStore.activeTrip?._id || ''" @close="closeChat" />
    </div>
  </main>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
