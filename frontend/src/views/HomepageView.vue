<script setup>
import { ref } from 'vue';
import SidebarPanel from '../components/SidebarPanel/SidebarPanel.vue';
import SearchPanel from '../components/SearchPanel/SearchPanel.vue';
import MapMarkers from '../components/MapMarkers/MapMarkers.vue';
import 'mapbox-gl/dist/mapbox-gl.css';

const activeId = ref(null);
const map = ref(null);
const mapMarkerLngLat = ref(null);
const searchText = ref('');
const isNewPlace = ref(false);
</script>

<template>
  <main class="flex h-screen">
    <SidebarPanel :active-id="activeId" :map="map" :map-marker-lng-lat="mapMarkerLngLat"
      @update-active="(id) => (activeId = id)" @update-marker="(coords) => {
        mapMarkerLngLat = coords;
        isNewPlace = false;
      }" />


    <div class="w-full h-full relative">
      <SearchPanel v-model:search-text="searchText" @place-selected="(lngLat, name) => {
        map?.flyTo({ center: lngLat, zoom: 14 });
        mapMarkerLngLat = lngLat;
        searchText = name;
      }" />

      <MapMarkers :map="map" :marker-position="mapMarkerLngLat" :active-id="activeId" :is-new-place="isNewPlace"
        @marker-clicked="(id) => {
        activeId = id;
        isNewPlace = false;
      }" @map-clicked="(lngLat) => {
        mapMarkerLngLat = lngLat;
        isNewPlace = true;
      }" @get-map="(mapInstance) => (map = mapInstance)" />
    </div>
  </main>
</template>