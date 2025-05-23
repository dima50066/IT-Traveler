<script setup lang="ts">
import { ref } from 'vue';
import SidebarPanel from '../components/SidebarPanel/SidebarPanel.vue';
import SearchPanel from '../components/SearchPanel/SearchPanel.vue';
import MapMarkers from '../components/MapMarkers/MapMarkers.vue';
import UserDropdown from '../components/UserDropdown/UserDropdown.vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Map as MapboxMapInstance } from 'mapbox-gl';

const activeId = ref<string | null>(null);
const map = ref<MapboxMapInstance | undefined>();
const mapMarkerLngLat = ref<[number, number] | null>(null);
const searchText = ref('');
const isNewPlace = ref(false);

const handleGetMap = (mapInstance: MapboxMapInstance) => {
  map.value = mapInstance;
};
</script>

<template>
  <main class="flex h-screen">
    <SidebarPanel
      v-if="map !== undefined"
      :active-id="activeId"
      :map="map"
      :map-marker-lng-lat="mapMarkerLngLat"
      @update-active="(id: string) => (activeId = id)"
      @update-marker="
        (coords: [number, number]) => {
          mapMarkerLngLat = coords;
          isNewPlace = true;
        }
      "
    />

    <div class="w-full h-full relative">
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

      <UserDropdown />
    </div>
  </main>
</template>
