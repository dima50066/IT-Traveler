<script setup>
import { MapboxMap, MapboxMarker } from '@studiometa/vue-mapbox-gl';
import MarkerIcon from '../icons/MarkerIcon.vue';
import { mapSettings } from '../../map/settings';
import { computed, onMounted } from 'vue';
import { getFavoritePlaces } from '../../api/favorite-places';
import { useMutation } from '../../composables/useMutation';
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps({
    markerPosition: Array,
    activeId: String,
    map: Object,
    isNewPlace: Boolean,
});
const emit = defineEmits(['marker-clicked', 'map-clicked', 'get-map']);

const {
    data,
    mutation: getPlaces,
} = useMutation({ mutationFn: getFavoritePlaces });

const favoritePlaces = computed(() => data.value ?? []);

const handleMapClick = ({ lngLat }) => {
    emit('map-clicked', [lngLat.lng, lngLat.lat]);
};

onMounted(() => {
    getPlaces();
});
</script>

<template>
    <MapboxMap class="w-full h-full" :center="[30.523333, 50.450001]" :zoom="10" :access-token="mapSettings.apiToken"
        :map-style="mapSettings.style" @mb-click="handleMapClick"
        @mb-created="(mapInstance) => emit('get-map', mapInstance)">
        <MapboxMarker v-if="isNewPlace && markerPosition" :lngLat="markerPosition" anchor="bottom">
            <MarkerIcon class="h-8 w-8" is-active />
        </MapboxMarker>
        <MapboxMarker v-for="place in favoritePlaces" :key="place.id" :lngLat="place.coordinates" anchor="bottom">
            <button @click.stop="emit('marker-clicked', place.id)">
                <MarkerIcon class="h-8 w-8" />
            </button>
        </MapboxMarker>
    </MapboxMap>
</template>