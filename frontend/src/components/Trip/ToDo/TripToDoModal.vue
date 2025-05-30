<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import ToDoItem from './ToDoItem.vue';
import IButton from '../../../shared/IButton/IButton.vue';
import Draggable from 'vuedraggable';
import CrossIcon from '../../../shared/icons/CrossIcon.vue';
import type { Trip } from '../../../types';
import { useTripsStore } from '../../../stores/trip';

const props = defineProps<{
  isOpen: boolean;
  trip: Trip;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const newTodoText = ref('');
const batchList = ref('');
const showBatchModal = ref(false);
const isClearing = ref(false);
const tripsStore = useTripsStore();

onMounted(() => {
  document.body.style.overflow = 'hidden';
});
onUnmounted(() => {
  document.body.style.overflow = 'initial';
});

const handleClose = () => {
  emit('close');
};

const todos = computed(() => {
  return [...props.trip.todoList].sort((a, b) => a.order - b.order);
});

const addTodo = async () => {
  const trimmed = newTodoText.value.trim();
  if (trimmed) {
    await tripsStore.addTodo(props.trip._id, trimmed);
    newTodoText.value = '';
  }
};

const handleReorder = async () => {
  const ids = todos.value.map((item) => item.id);
  await tripsStore.reorderTodos(props.trip._id, ids);
};

const markAll = async (done: boolean) => {
  await tripsStore.markAll(props.trip._id, done);
};

const clearCompleted = async () => {
  console.log('Clearing completed todos for tripId:', props.trip._id);
  isClearing.value = true;
  await tripsStore.clearCompleted(props.trip._id);
  isClearing.value = false;
};

const handleBatchAdd = async () => {
  const lines = batchList.value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length) {
    await tripsStore.batchAdd(props.trip._id, lines);
    batchList.value = '';
    showBatchModal.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)] z-50 flex items-center justify-center"
      @click.self="handleClose"
    >
      <div class="relative bg-white rounded-2xl p-8 w-full max-w-xl">
        <button class="absolute right-4 top-4" @click="handleClose">
          <CrossIcon class="w-6 h-6" />
        </button>

        <h2 class="text-2xl font-semibold mb-4">📝 Список завдань</h2>

        <form @submit.prevent="addTodo" class="flex gap-2 mb-4">
          <input
            v-model="newTodoText"
            placeholder="Нове завдання..."
            class="flex-1 px-3 py-2 border rounded"
          />
          <IButton type="submit" variant="gradient">Додати</IButton>
        </form>

        <Draggable
          :list="todos"
          item-key="id"
          handle=".drag-handle"
          animation="200"
          @end="handleReorder"
        >
          <template #item="{ element }">
            <ToDoItem :item="element" :trip-id="trip._id" />
          </template>
        </Draggable>

        <div class="flex flex-wrap gap-2 mt-6">
          <IButton variant="primary" @click="markAll(true)">✅ Завершити всі</IButton>
          <IButton variant="primary" @click="markAll(false)">🔄 Зняти завершення</IButton>
          <IButton variant="primary" :disabled="isClearing" @click="clearCompleted">
            🧹 {{ isClearing ? 'Очищення...' : 'Очистити завершені' }}
          </IButton>
          <IButton variant="primary" @click="showBatchModal = true">📥 Додати список</IButton>
        </div>

        <Teleport to="body">
          <div
            v-if="showBatchModal"
            class="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50"
            @click.self="showBatchModal = false"
          >
            <div class="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 class="text-lg font-semibold mb-2">📋 Встав список завдань</h3>
              <textarea
                v-model="batchList"
                class="w-full h-40 p-2 border rounded resize-none"
                placeholder="Кожен рядок — окреме завдання"
              ></textarea>
              <div class="flex justify-end mt-4 gap-2">
                <IButton variant="ghost" @click="showBatchModal = false">Скасувати</IButton>
                <IButton variant="gradient" @click="handleBatchAdd">Додати</IButton>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
    </div>
  </Teleport>
</template>
