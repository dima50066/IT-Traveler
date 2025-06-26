<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import CrossIcon from '../../shared/icons/CrossIcon.vue';
import type { Trip, CreateTripRequest } from '../../types';
import { useTripsStore } from '../../stores/trip';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'invite', userId: string): void;
  (e: 'open-chat'): void;
}>();

const props = defineProps<{ trip: Trip | null }>();

const store = useTripsStore();
const form = ref<CreateTripRequest>({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'planned',
  budget: { transport: 0, accommodation: 0, food: 0, other: 0 },
  todoList: []
});

watch(
  () => props.trip,
  (val) => {
    if (val) {
      form.value = { ...val, budget: { ...val.budget }, todoList: [...val.todoList] };
    } else {
      form.value = {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'planned',
        budget: { transport: 0, accommodation: 0, food: 0, other: 0 },
        todoList: []
      };
    }
  },
  { immediate: true }
);

onMounted(() => (document.body.style.overflow = 'hidden'));
onUnmounted(() => (document.body.style.overflow = 'initial'));

const submit = async () => {
  if (props.trip) await store.update(props.trip.id, form.value);
  else await store.create(form.value);
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 flex w-full h-full overflow-auto bg-[rgba(0,0,0,0.3)]"
      @click.self="emit('close')"
    >
      <div
        class="relative m-auto bg-white w-[92vw] sm:min-w-[350px] max-w-xl rounded-2xl p-5 sm:p-6 shadow-lg text-black"
      >
        <button class="absolute right-3 top-3" @click="emit('close')">
          <CrossIcon class="w-6 h-6" />
        </button>

        <h2 class="text-lg sm:text-xl font-semibold mb-4">
          {{ props.trip ? 'Редагувати подорож' : 'Нова подорож' }}
        </h2>

        <form @submit.prevent="submit" class="space-y-3 sm:space-y-4">
          <input
            v-model="form.title"
            type="text"
            placeholder="Назва"
            class="border border-gray-300 rounded px-2 py-1.5 sm:px-3 sm:py-2 w-full text-sm sm:text-base"
            required
          />

          <textarea
            v-model="form.description"
            placeholder="Опис"
            class="border border-gray-300 rounded px-2 py-1.5 sm:px-3 sm:py-2 w-full text-sm sm:text-base"
          />

          <div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <input
              v-model="form.startDate"
              type="date"
              class="border border-gray-300 rounded px-2 py-1.5 sm:px-3 sm:py-2 w-full text-sm sm:text-base"
              required
            />
            <input
              v-model="form.endDate"
              type="date"
              class="border border-gray-300 rounded px-2 py-1.5 sm:px-3 sm:py-2 w-full text-sm sm:text-base"
              required
            />
          </div>

          <div v-if="form.budget">
            <label class="block text-sm font-medium mb-1">Бюджет</label>

            <div class="grid grid-cols-2 gap-2">
              <input
                v-model.number="form.budget.transport"
                type="number"
                placeholder="Транспорт"
                class="border border-gray-300 rounded px-2 py-1.5 sm:px-3 sm:py-2 w-full text-sm sm:text-base"
              />
              <input
                v-model.number="form.budget.accommodation"
                type="number"
                placeholder="Проживання"
                class="border border-gray-300 rounded px-2 py-1.5 sm:px-3 sm:py-2 w-full text-sm sm:text-base"
              />
              <input
                v-model.number="form.budget.food"
                type="number"
                placeholder="Їжа"
                class="border border-gray-300 rounded px-2 py-1.5 sm:px-3 sm:py-2 w-full text-sm sm:text-base"
              />
              <input
                v-model.number="form.budget.other"
                type="number"
                placeholder="Інше"
                class="border border-gray-300 rounded px-2 py-1.5 sm:px-3 sm:py-2 w-full text-sm sm:text-base"
              />
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 text-sm sm:text-base transition-colors"
          >
            {{ props.trip ? 'Зберегти зміни' : 'Створити' }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
