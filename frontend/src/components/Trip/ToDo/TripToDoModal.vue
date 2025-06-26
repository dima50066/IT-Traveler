<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import ToDoItem from './ToDoItem.vue';
import IButton from '../../../shared/IButton/IButton.vue';
import Draggable from 'vuedraggable';
import CrossIcon from '../../../shared/icons/CrossIcon.vue';
import type { Trip } from '../../../types';
import { useTripsStore } from '../../../stores/trip';

const props = defineProps<{ isOpen: boolean; trip: Trip }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const newTodoText = ref('');
const batchList = ref('');
const showBatchModal = ref(false);
const isClearing = ref(false);

const tripsStore = useTripsStore();

onMounted(() => (document.body.style.overflow = 'hidden'));
onUnmounted(() => (document.body.style.overflow = 'initial'));

const handleClose = () => emit('close');

const todos = computed(() => [...props.trip.todoList].sort((a, b) => a.order - b.order));

const addTodo = async () => {
  const t = newTodoText.value.trim();
  if (t) {
    await tripsStore.addTodo(props.trip._id, t);
    newTodoText.value = '';
  }
};

const handleReorder = async () => {
  const ids = todos.value.map((i) => i.id);
  await tripsStore.reorderTodos(props.trip._id, ids);
};

const markAll = async (done: boolean) => tripsStore.markAll(props.trip._id, done);

const clearCompleted = async () => {
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.35)]"
      @click.self="handleClose"
    >
      <div
        class="relative w-[92vw] sm:min-w-[340px] max-w-md md:max-w-lg bg-white rounded-2xl p-4 sm:p-6 shadow-xl text-sm sm:text-base"
      >
        <button class="absolute top-3 right-3" @click="handleClose">
          <CrossIcon class="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <h2 class="text-lg sm:text-2xl font-semibold mb-4">📝 Список завдань</h2>

        <form @submit.prevent="addTodo" class="flex flex-col gap-2 mb-4">
          <input
            v-model="newTodoText"
            placeholder="Нове завдання…"
            class="flex-1 border rounded px-2 py-1 sm:px-3 sm:py-2"
          />
          <IButton type="submit" variant="gradient" class="text-xs sm:text-sm"> Додати </IButton>
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

        <div class="flex flex-wrap gap-2 mt-5">
          <IButton variant="primary" class="text-xs sm:text-sm" @click="markAll(true)">
            ✅ Завершити всі
          </IButton>
          <IButton variant="primary" class="text-xs sm:text-sm" @click="markAll(false)">
            🔄 Зняти завершення
          </IButton>
          <IButton
            variant="primary"
            class="text-xs sm:text-sm"
            :disabled="isClearing"
            @click="clearCompleted"
          >
            🧹 {{ isClearing ? 'Очищення…' : 'Очистити завершені' }}
          </IButton>
          <IButton variant="primary" class="text-xs sm:text-sm" @click="showBatchModal = true">
            📥 Додати список
          </IButton>
        </div>

        <Teleport to="body">
          <div
            v-if="showBatchModal"
            class="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(0,0,0,0.4)]"
            @click.self="showBatchModal = false"
          >
            <div
              class="bg-white w-[90vw] sm:w-auto max-w-md p-4 sm:p-6 rounded-lg text-sm sm:text-base"
            >
              <h3 class="text-base sm:text-lg font-semibold mb-2">📋 Встав список завдань</h3>

              <textarea
                v-model="batchList"
                class="w-full h-36 sm:h-40 border rounded p-2 resize-none"
                placeholder="Кожен рядок — окреме завдання"
              />

              <div class="flex justify-end gap-2 mt-4">
                <IButton variant="ghost" class="text-xs sm:text-sm" @click="showBatchModal = false">
                  Скасувати
                </IButton>
                <IButton variant="gradient" class="text-xs sm:text-sm" @click="handleBatchAdd">
                  Додати
                </IButton>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
    </div>
  </Teleport>
</template>
