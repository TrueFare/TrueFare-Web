<template>
  <div class="flex items-center gap-2 mb-4">
    <input
      v-model="query"
      @input="onSearch"
      type="text"
      placeholder="Search driver by name..."
      class="w-full sm:w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      @click="clearSearch"
      class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
    >
      Clear
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["search"]);

const query = ref("");

const onSearch = () => {
  emit("search", query.value);
};

const clearSearch = () => {
  query.value = "";
  emit("search", "");
};
</script>
