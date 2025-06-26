<script setup lang="ts">
import PointCardIconButton from './PointCardIconButton.vue';
import DeleteIcon from './DeleteIcon.vue';
import EditIcon from './EditIcon.vue';

defineProps({
  title: String,
  description: String,
  img: String,
  isActive: Boolean,
  category: String,
  transportMode: String,
  dayNumber: Number
});

const emit = defineEmits(['edit', 'delete', 'notes']);
</script>
<template>
  <section class="text-[#939393] mb-6 last:mb-0">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="drag-handle cursor-move pt-1 self-start sm:self-auto">
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

      <img
        :src="img"
        referrerpolicy="no-referrer"
        class="w-full sm:w-[76px] h-[200px] sm:h-[76px] object-cover rounded"
        alt="place"
      />

      <div class="w-full">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2"
        >
          <div class="flex flex-col">
            <h2 class="font-bold text-sm text-[#2C2C2C]">{{ title }}</h2>
            <div class="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
              <span v-if="dayNumber">День {{ dayNumber }}</span>
              <span v-if="category">• {{ category }}</span>
              <span v-if="transportMode">• {{ transportMode }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <PointCardIconButton @click="emit('edit')">
              <EditIcon />
            </PointCardIconButton>
            <PointCardIconButton @click.stop="emit('delete')">
              <DeleteIcon />
            </PointCardIconButton>
            <PointCardIconButton @click.stop="emit('notes')"> 📝 </PointCardIconButton>
          </div>
        </div>

        <p class="text-xs line-clamp-3 sm:line-clamp-2">{{ description }}</p>
      </div>
    </div>

    <div class="h-[1px] w-full bg-[#ececec] mt-4" :class="{ 'bg-[#f3743d]': isActive }"></div>
  </section>
</template>
