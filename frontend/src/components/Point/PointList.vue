<script setup lang="ts">
import EditPointModal from './EditPointModal.vue';
import PointCard from './PointCard.vue';
import IButton from '../../shared/IButton/IButton.vue';
import ConfirmationModal from '../../shared/ConfirmationModal/ConfirmationModal.vue';
import CollaboratorInviteModal from '../Chat/CollaboratorInviteModal.vue';
import IModal from '../../shared/IModal/IModal.vue';
import PointNotesModal from './PointNotesModal.vue';

import { useModal } from '../../composables/useModal';
import { computed, ref, watch } from 'vue';
import { usePointsStore } from '../../stores/points';
import { useTripsStore } from '../../stores/trip';
import type { Point, UpdatePointRequest } from '../../types';
import Draggable from 'vuedraggable';

const props = defineProps<{
  items: Point[];
  activeId: string | null;
  isPlacesLoading: boolean;
  tripId: string;
  isInviteModalOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'place-clicked', id: string): void;
  (e: 'create'): void;
  (e: 'open-chat', tripId: string): void;
  (e: 'close-invite'): void;
  (e: 'open-invite'): void;
}>();

const store = usePointsStore();
const tripsStore = useTripsStore();

const idOfDeletedItem = ref<string | null>(null);
const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
const {
  isOpen: isConfirmationModalOpen,
  openModal: openConfirmationModal,
  closeModal: closeConfirmationModal
} = useModal();

const {
  isOpen: isNotesModalOpen,
  openModal: openNotesModal,
  closeModal: closeNotesModal
} = useModal();

const selectedId = ref<string | null>(null);
const selectedNotesId = ref<string | null>(null);

const selectedItem = computed<Point | null>(
  () => props.items.find((place) => place._id === selectedId.value) ?? null
);
const selectedNotesPoint = computed<Point | null>(
  () => props.items.find((place) => place._id === selectedNotesId.value) ?? null
);

const isDeleting = ref(false);
const isUpdating = ref(false);
const deleteError = ref<Error | null>(null);

const handleEditPlace = (id: string) => {
  selectedId.value = id;
  openEditModal();
};

const handleOpenNotes = (id: string) => {
  selectedNotesId.value = id;
  openNotesModal();
};

const handleSubmit = async (formData: Omit<UpdatePointRequest, 'tripId'>) => {
  isUpdating.value = true;
  try {
    await store.updatePoint({ ...formData, tripId: props.tripId });
    closeEditModal();
  } catch (e) {
    return e;
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

const points = ref<Point[]>([...props.items]);

watch(
  () => props.items,
  (newItems) => {
    points.value = [...newItems];
  }
);

const onReorder = async () => {
  const ids = points.value.map((p) => p._id);
  await store.reorderPoints(props.tripId, ids);
};

const openTripChat = () => {
  if (tripsStore.activeTrip?.chatId) {
    emit('open-chat', props.tripId);
  }
};
</script>

<template>
  <div class="px-6 text-black">
    <div class="text-[#939393] mb-4">Додані маркери</div>

    <Draggable
      v-model="points"
      item-key="_id"
      handle=".drag-handle"
      animation="200"
      @end="onReorder"
    >
      <template #item="{ element }">
        <PointCard
          :title="element.title"
          :description="element.description"
          :img="element.img"
          :is-active="element._id === activeId"
          :category="element.category"
          :transport-mode="element.transportMode"
          :day-number="element.dayNumber"
          @click="emit('place-clicked', element._id)"
          @edit="handleEditPlace(element._id)"
          @delete="handleOpenConfirmationModal(element._id)"
          @notes="handleOpenNotes(element._id)"
        />
      </template>
    </Draggable>

    <EditPointModal
      :is-open="isEditOpen"
      :place="selectedItem || undefined"
      :is-loading="isUpdating"
      @close="closeEditModal"
      @submit="handleSubmit"
    />

    <PointNotesModal
      :is-open="isNotesModalOpen"
      :point="selectedNotesPoint"
      @close="closeNotesModal"
      :trip-id="props.tripId"
    />

    <ConfirmationModal
      :is-open="isConfirmationModalOpen"
      :is-loading="isDeleting"
      :has-error="!!deleteError"
      @cancel="closeConfirmationModal"
      @confirm="handleDeletePlace"
      title="Ви дійсно хочете видалити улюблене місце?"
    />

    <IModal :is-open="props.isInviteModalOpen" @close="emit('close-invite')">
      <CollaboratorInviteModal :trip-id="props.tripId" @close="emit('close-invite')" />
    </IModal>

    <IButton class="w-full mt-10" variant="gradient" @click="emit('create')">
      Додати маркер
    </IButton>
    <button
      v-if="tripsStore.activeTrip?.chatId"
      @click="openTripChat"
      class="mt-4 w-full bg-blue-500 text-white p-2 rounded"
    >
      💬 Відкрити чат тріпа
    </button>
    <IButton @click="emit('open-invite')" class="mt-4 w-full bg-green-500 text-white p-2 rounded">
      👥 Додати колаборатора
    </IButton>
  </div>
</template>
