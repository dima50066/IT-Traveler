<script setup lang="ts">
import EditPointModal from './EditPointModal.vue';
import PointCard from './PointCard.vue';
import IButton from '../../shared/IButton/IButton.vue';
import ConfirmationModal from '../../shared/ConfirmationModal/ConfirmationModal.vue';
import { useModal } from '../../composables/useModal';
import { computed, ref } from 'vue';
import { usePointsStore } from '../../stores/points';
import type { Point, UpdatePointRequest } from '../../types';

const props = defineProps<{
  items: Point[];
  activeId: string | null;
  isPlacesLoading: boolean;
  tripId: string;
}>();

const emit = defineEmits<{
  (e: 'place-clicked', id: string): void;
  (e: 'create'): void;
}>();

const store = usePointsStore();

const idOfDeletedItem = ref<string | null>(null);
const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
const {
  isOpen: isConfirmationModalOpen,
  openModal: openConfirmationModal,
  closeModal: closeConfirmationModal
} = useModal();

const selectedId = ref<string | null>(null);
const selectedItem = computed<Point | null>(
  () => props.items.find((place) => place._id === selectedId.value) ?? null
);

const isDeleting = ref(false);
const isUpdating = ref(false);
const deleteError = ref<Error | null>(null);

const handleEditPlace = (id: string) => {
  selectedId.value = id;
  openEditModal();
};

const handleSubmit = async (formData: Omit<UpdatePointRequest, 'tripId'>) => {
  isUpdating.value = true;
  try {
    await store.updatePoint({ ...formData, tripId: props.tripId });
    closeEditModal();
  } catch (e) {
    console.error(e);
  } finally {
    isUpdating.value = false;
  }
};

const handleOpenConfirmationModal = (id: string) => {
  idOfDeletedItem.value = id;
  openConfirmationModal();
};

const handleDeletePlace = async () => {
  if (!idOfDeletedItem.value) return;
  isDeleting.value = true;
  try {
    await store.deletePoint(idOfDeletedItem.value, props.tripId);
    closeConfirmationModal();
    idOfDeletedItem.value = null;
  } catch (e) {
    deleteError.value = e instanceof Error ? e : new Error('Unknown error');
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="px-6 text-black">
    <div class="text-[#939393] mb-4">Додані маркери</div>

    <slot name="label"></slot>
    <slot name="list">
      <div v-if="items.length === 0 && !isPlacesLoading">Список порожній</div>

      <PointCard
        v-for="place in items"
        :key="place._id"
        :title="place.title"
        :description="place.description"
        :img="place.img"
        :is-active="place._id === activeId"
        @click="emit('place-clicked', place._id)"
        @edit="handleEditPlace(place._id)"
        @delete="handleOpenConfirmationModal(place._id)"
      />

      <EditPointModal
        :is-open="isEditOpen"
        :place="selectedItem"
        :is-loading="isUpdating"
        @close="closeEditModal"
        @submit="handleSubmit"
      />

      <ConfirmationModal
        :is-open="isConfirmationModalOpen"
        :is-loading="isDeleting"
        :has-error="!!deleteError"
        @cancel="closeConfirmationModal"
        @confirm="handleDeletePlace"
        title="Ви дійсно хочете видалити улюблене місце?"
      />
    </slot>

    <slot></slot>
    <IButton class="w-full mt-10" variant="gradient" @click="emit('create')">
      Додати маркер
    </IButton>
  </div>
</template>
