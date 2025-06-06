<script setup lang="ts">
import { ref, watch } from 'vue';
import IModal from '../../shared/IModal/IModal.vue';
import IInput from '../../shared/IInput/IInput.vue';
import IButton from '../../shared/IButton/IButton.vue';
import { usePointsStore } from '../../stores/points';
import type { Point, PointNote } from '../../types';

const props = defineProps<{
  isOpen: boolean;
  point: Point | null;
  tripId: string;
}>();

const emit = defineEmits(['close']);

const newNote = ref('');
const localNotes = ref<PointNote[]>([]);
const store = usePointsStore();
const isLoading = ref(false);

watch(
  () => props.point,
  async (newVal) => {
    if (newVal?._id) {
      try {
        isLoading.value = true;
        localNotes.value = await store.fetchPointNotes(newVal._id);
      } catch (e) {
        console.error('❌ Не вдалося отримати нотатки:', e);
      } finally {
        isLoading.value = false;
      }
    }
  },
  { immediate: true }
);

const submitNote = async () => {
  if (!props.point || !newNote.value.trim()) return;
  try {
    await store.addNoteToPoint(props.point._id, newNote.value.trim(), props.tripId);
    localNotes.value = await store.fetchPointNotes(props.point._id);
    newNote.value = '';
  } catch (e) {
    console.error('❌ Помилка при додаванні нотатки:', e);
  }
};

const deleteNote = async (index: number) => {
  if (!props.point) return;
  try {
    localNotes.value = await store.removeNote(props.point._id, index);
  } catch (e) {
    console.error('❌ Помилка при видаленні нотатки:', e);
  }
};
</script>

<template>
  <IModal :is-open="isOpen" @close="emit('close')">
    <div class="min-w-[500px] max-w-[600px]">
      <h2 class="text-xl font-semibold mb-4">Нотатки до точки</h2>

      <div v-if="isLoading" class="text-gray-500 mb-4">Завантаження нотаток...</div>

      <div v-else-if="localNotes.length">
        <ul class="mb-4 max-h-[300px] overflow-auto pr-2">
          <li
            v-for="(note, index) in localNotes"
            :key="index"
            class="mb-2 border-b pb-2 text-sm flex justify-between items-start gap-2"
          >
            <div class="flex-1">
              <div class="text-gray-600">
                {{ new Date(note.createdAt).toLocaleString() }}
              </div>
              <div class="text-black">{{ note.text }}</div>
            </div>
            <button
              @click="deleteNote(index)"
              class="text-red-500 hover:underline text-xs"
              title="Видалити"
            >
              Видалити
            </button>
          </li>
        </ul>
      </div>
      <div v-else class="text-gray-400 mb-4">Ще немає нотаток</div>

      <form @submit.prevent="submitNote">
        <IInput label="Нова нотатка" type="textarea" v-model="newNote" />
        <IButton class="w-full mt-4" variant="gradient">Додати</IButton>
      </form>
    </div>
  </IModal>
</template>
