<script setup>
import { ref, watch } from 'vue';
import { searchPlaces as backendSearchPlaces } from '../../api/favorite-places/index.ts';

const props = defineProps({
  searchText: String
});
const emit = defineEmits(['place-selected', 'update:search-text']);

const searchResults = ref([]);
const showDropdown = ref(false);
const error = ref(null);

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const searchPlaces = async () => {
  if (!props.searchText.trim()) {
    searchResults.value = [];
    showDropdown.value = false;
    error.value = null;
    return;
  }
  try {
    const results = await backendSearchPlaces(props.searchText);
    searchResults.value = results;
    showDropdown.value = true;
    error.value = null;
  } catch (err) {
    console.error('Search failed:', err);
    error.value = 'Не вдалося виконати пошук. Спробуйте ще раз.';
  }
};

const debouncedSearch = debounce(searchPlaces, 500);
watch(
  () => props.searchText,
  () => debouncedSearch()
);

const selectPlace = (place) => {
  const loc = place.location;
  if (!loc) return;
  emit('place-selected', [loc.lng, loc.lat], place.name);
  emit('update:search-text', place.name);
  showDropdown.value = false;
};
</script>

<template>
  <div class="absolute top-4 left-4 z-10 w-[300px]">
    <input
      :value="searchText"
      @input="$emit('update:search-text', $event.target.value)"
      type="text"
      placeholder="Пошук місця..."
      class="px-4 py-2 rounded shadow bg-white border border-gray-300 w-full"
    />
    <div v-if="error" class="text-red-500 mt-1">{{ error }}</div>
    <ul
      v-if="showDropdown && searchResults.length"
      class="bg-white shadow rounded mt-1 max-h-60 overflow-auto"
    >
      <li
        v-for="(result, index) in searchResults"
        :key="index"
        @click="selectPlace(result)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ result.name }}
      </li>
    </ul>
  </div>
</template>
