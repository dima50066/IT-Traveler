<script setup>
import EditPlaceModal from '../EditPlaceModal/EditPlaceModal.vue';
import FavoritePlace from '../FavoritePlace/FavoritePlace.vue';
import IButton from '../../shared/IButton/IButton.vue';
import ConfirmationModal from '../../shared/ConfirmationModal/ConfirmationModal.vue';
import { useModal } from '../../composables/useModal';
import { computed, ref } from 'vue';
import { usePointsStore } from '../../stores/points';

const props = defineProps({
  items: {
    required: true,
    type: Array
  },
  activeId: {
    required: true,
    type: [String, null]
  },
  isPlacesLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['place-clicked', 'create']);

const store = usePointsStore();

const idOfDeletedItem = ref(null);
const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
const {
  isOpen: isConfirmationModalOpen,
  openModal: openConfirmationModal,
  closeModal: closeConfirmationModal
} = useModal();

const selectedId = ref(null);
const selectedItem = computed(() => props.items.find((place) => place.id === selectedId.value));

const isDeleting = ref(false);
const isUpdating = ref(false);
const deleteError = ref(null);

const handleEditPlace = (id) => {
  selectedId.value = id;
  openEditModal();
};

const handleSubmit = async (formData) => {
  isUpdating.value = true;
  try {
    await store.updatePoint(formData);
    closeEditModal();
  } catch (e) {
    console.error('❌ Error updating point:', e);
  } finally {
    isUpdating.value = false;
  }
};

const handleOpenConfirmationModal = (id) => {
  idOfDeletedItem.value = id;
  openConfirmationModal();
};

const handleDeletePlace = async () => {
  isDeleting.value = true;
  try {
    await store.deletePoint(idOfDeletedItem.value);
    closeConfirmationModal();
    idOfDeletedItem.value = null;
  } catch (e) {
    deleteError.value = e;
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

      <FavoritePlace
        v-for="place in props.items"
        :key="place.id"
        :title="place.title"
        :description="place.description"
        :img="place.img"
        :is-active="place.id === props.activeId"
        @click="emit('place-clicked', place.id)"
        @edit="handleEditPlace(place.id)"
        @delete="handleOpenConfirmationModal(place.id)"
      />

      <EditPlaceModal
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
