<script setup lang="ts">
import type { Trip } from '../../types';

defineProps<{
  trip: Trip;
  onEdit?: () => void;
  onDelete?: () => void;
}>();
</script>

<template>
  <div
    class="border rounded-lg p-4 shadow hover:shadow-md transition-all bg-white cursor-pointer"
    @click="$emit('click')"
  >
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-xl font-semibold">{{ trip.title }}</h2>
        <p class="text-sm text-gray-600">{{ trip.description }}</p>
        <p class="text-sm mt-1">
          📅 {{ new Date(trip.startDate).toLocaleDateString() }} –
          {{ new Date(trip.endDate).toLocaleDateString() }}
        </p>
        <p class="text-sm">🧍 Учасники: {{ trip.collaborators.length + 1 }}</p>
        <p class="text-sm">
          📌 Статус: <span class="font-medium">{{ trip.status }}</span>
        </p>
      </div>

      <div class="space-x-2">
        <button @click.stop="onEdit?.()" class="text-blue-500 hover:underline text-sm">
          Редагувати
        </button>
        <button @click.stop="onDelete?.()" class="text-red-500 hover:underline text-sm">
          Видалити
        </button>
      </div>
    </div>
  </div>
</template>
