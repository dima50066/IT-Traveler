<script setup lang="ts">
import { onMounted, onUnmounted, Teleport, ref, watch } from 'vue';
import CrossIcon from '../../shared/icons/CrossIcon.vue';
import type { Trip, CreateTripRequest } from '../../types';
import { useTripsStore } from '../../stores/trip';

const emit = defineEmits(['close']);
const props = defineProps<{ trip: Trip | null }>();

const store = useTripsStore();
const form = ref<CreateTripRequest>({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'planned',
  budget: {
    transport: 0,
    accommodation: 0,
    food: 0,
    other: 0
  },
  todoList: []
});

watch(
  () => props.trip,
  (val) => {
    if (val) {
      form.value = {
        ...val,
        budget: { ...val.budget },
        todoList: [...val.todoList]
      };
    } else {
      form.value = {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'planned',
        budget: {
          transport: 0,
          accommodation: 0,
          food: 0,
          other: 0
        },
        todoList: []
      };
    }
  },
  { immediate: true }
);

onMounted(() => {
  document.body.style.overflow = 'hidden';
});
onUnmounted(() => {
  document.body.style.overflow = 'initial';
});

const submit = async () => {
  if (props.trip) {
    await store.update(props.trip.id, form.value);
  } else {
    await store.create(form.value);
  }
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <div
      class="flex w-full h-full fixed top-0 left-0 overflow-auto bg-[rgba(0,0,0,0.3)]"
      @click.self="emit('close')"
    >
      <div
        class="relative bg-white min-w-[350px] m-auto text-black rounded-2xl p-10 w-full max-w-xl"
      >
        <button class="absolute right-3 top-3">
          <CrossIcon class="w-6 h-6" @click="emit('close')" />
        </button>
        <h2 class="text-xl font-semibold mb-4">
          {{ props.trip ? 'Редагувати подорож' : 'Нова подорож' }}
        </h2>

        <form @submit.prevent="submit" class="space-y-4">
          <input v-model="form.title" type="text" placeholder="Назва" class="border border-gray-300 rounded px-3 py-2 w-full" required />
          <textarea v-model="form.description" placeholder="Опис" class="border border-gray-300 rounded px-3 py-2 w-full" />

          <div class="flex space-x-2">
            <input v-model="form.startDate" type="date" class="border border-gray-300 rounded px-3 py-2 w-full" required />
            <input v-model="form.endDate" type="date" class="border border-gray-300 rounded px-3 py-2 w-full" required />
          </div>

          <div v-if="form.budget">
            <label class="block text-sm font-medium mb-1">Бюджет</label>
            <div class="grid grid-cols-2 gap-2">
              <input
                v-model.number="form.budget.transport"
                type="number"
                placeholder="Транспорт"
                class="border border-gray-300 rounded px-3 py-2 w-full"
              />
              <input
                v-model.number="form.budget.accommodation"
                type="number"
                placeholder="Проживання"
                class="border border-gray-300 rounded px-3 py-2 w-full"
              />
              <input
                v-model.number="form.budget.food"
                type="number"
                placeholder="Їжа"
                class="border border-gray-300 rounded px-3 py-2 w-full"
              />
              <input
                v-model.number="form.budget.other"
                type="number"
                placeholder="Інше"
                class="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {{ props.trip ? 'Зберегти зміни' : 'Створити' }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
