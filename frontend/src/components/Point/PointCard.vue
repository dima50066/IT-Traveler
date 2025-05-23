<script setup>
import PointCardIconButton from './PointCardIconButton.vue';
import DeleteIcon from './DeleteIcon.vue';
import EditIcon from '../Point/EditIcon.vue';
import { defineEmits } from 'vue';

const props = defineProps({
  title: {
    required: true,
    type: String
  },
  description: {
    required: true,
    type: String
  },
  img: String,
  isActive: {
    required: true,
    type: Boolean
  }
});

const emit = defineEmits(['edit', 'delete']);
</script>

<template>
  <section class="text-[#939393] mb-6 last:mb-0">
    <div class="flex gap-4">
      <img
        :src="props.img"
        referrerpolicy="no-referrer"
        class="w-[76px] h-[76px] object-cover"
        alt="place"
      />
      <div class="w-full">
        <div class="flex justify-between items-center mb-2">
          <h2 class="font-bold text-sm text-[#2C2C2C]">{{ props.title }}</h2>
          <div class="flex gap-2">
            <PointCardIconButton @click="emit('edit')">
              <EditIcon />
            </PointCardIconButton>
            <PointCardIconButton @click.stop="emit('delete')">
              <DeleteIcon />
            </PointCardIconButton>
          </div>
        </div>
        <p class="text-xs line-clamp-3">
          {{ props.description }}
        </p>
      </div>
    </div>

    <div
      class="h-[1px] w-full bg-[#ececec] mt-4"
      :class="{ 'bg-[#f3743d]': props.isActive, 'bg-[#ececec]': !props.isActive }"
    ></div>
  </section>
</template>
