<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useTripsStore } from '../../../stores/trip';
import type { TodoItem, UpdateTodoRequest } from '../../../types';

const props = defineProps<{
  item: TodoItem;
  tripId: string;
}>();

const isEditing = ref(false);
const editedText = ref(props.item.text);
const isLoading = ref(false);
const store = useTripsStore();

const startEdit = () => {
  editedText.value = props.item.text;
  isEditing.value = true;
  nextTick(() => {
    const input = document.getElementById(`todo-${props.item.id}`) as HTMLInputElement;
    input?.focus();
  });
};

const saveEdit = async () => {
  if (!editedText.value || editedText.value === props.item.text) {
    isEditing.value = false;
    return;
  }
  isLoading.value = true;
  const updates: UpdateTodoRequest = {
    text: editedText.value,
    order: props.item.order
  };
  await store.updateTodo(props.tripId, props.item.id, updates);
  isEditing.value = false;
  isLoading.value = false;
};

const toggleDone = async () => {
  isLoading.value = true;
  await store.toggleTodo(props.tripId, props.item.id);
  isLoading.value = false;
};

const deleteItem = async () => {
  isLoading.value = true;

  await store.deleteTodo(props.tripId, props.item.id);
  isLoading.value = false;
};
</script>

<template>
  <div
    class="flex items-center justify-between py-2 border-b gap-3"
    :class="{ 'opacity-50 pointer-events-none': isLoading }"
  >
    <div class="flex items-center gap-2 w-full">
      <div class="drag-handle cursor-move pt-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      <input type="checkbox" :checked="item.done" @change="toggleDone" class="cursor-pointer" />

      <div v-if="!isEditing" @dblclick="startEdit" class="flex-1 cursor-pointer">
        <span :class="{ 'line-through text-gray-400': item.done }">{{ item.text }}</span>
      </div>

      <input
        v-else
        :id="`todo-${item.id}`"
        v-model="editedText"
        @keyup.enter="saveEdit"
        @blur="saveEdit"
        class="flex-1 border rounded px-2 py-1 text-sm"
      />
    </div>

    <button @click="startEdit" title="Редагувати" class="text-sm text-blue-500">✏️</button>
    <button @click="deleteItem" title="Видалити" class="text-sm text-red-500">🗑️</button>
  </div>
</template>
