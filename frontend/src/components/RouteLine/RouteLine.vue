<script setup lang="ts">
import { watch } from 'vue';
import type { Map as MapboxMapInstance } from 'mapbox-gl';
import type { Point } from '../../types';
import { useRouteLines } from '../../composables/useRouteLines';

const props = defineProps<{
  map: MapboxMapInstance | undefined;
  points: Point[];
}>();

const { drawLines, removeLines } = useRouteLines();

watch(
  () => props.points,
  async () => {
    if (props.map) {
      removeLines(props.map);
      await drawLines(props.map, props.points);
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="route-line"></div>
</template>
