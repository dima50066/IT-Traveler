<script setup lang="ts">
import type { Trip } from '../../types';
import ConfirmationModal from '../../shared/ConfirmationModal/ConfirmationModal.vue';
import { ref } from 'vue';

const { trip, onEdit, onDelete } = defineProps<{
  trip: Trip;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}>();

const isModalOpen = ref(false);
const isLoading = ref(false);
const hasError = ref(false);

const openDeleteModal = () => {
  isModalOpen.value = true;
};

const confirmDelete = async () => {
  isLoading.value = true;
  hasError.value = false;
  try {
    if (onDelete) {
      await onDelete();
    }
    isModalOpen.value = false;
  } catch (error) {
    return error;
  } finally {
    isLoading.value = false;
  }
};

const cancelDelete = () => {
  isModalOpen.value = false;
  hasError.value = false;
};
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
        <button @click.stop="openDeleteModal" class="text-red-500 hover:underline text-sm">
          Видалити
        </button>
      </div>
    </div>

    <ConfirmationModal
      :is-open="isModalOpen"
      title="Ви впевнені, що хочете видалити цю подорож?"
      :is-loading="isLoading"
      :has-error="hasError"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>
