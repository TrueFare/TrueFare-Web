<template>
  <div
    class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 flex flex-col space-y-2 hover:shadow-lg transition"
  >
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ name }}
    </h3>
    <p class="text-sm text-gray-500 dark:text-gray-300">
      Barangay: <span class="font-medium">{{ barangay }}</span>
    </p>
    <p class="text-sm text-gray-500 dark:text-gray-300">
      Password: <span class="font-medium">{{ password }}</span>
    </p>
    <p class="text-sm text-gray-400 dark:text-gray-400">
      Created: {{ formatDate(date_created) }}
    </p>
    <p v-if="date_update" class="text-sm text-gray-400 dark:text-gray-400">
      Updated: {{ formatDate(date_update) }}
    </p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  name: String,
  password: String,
  barangay: String,
  date_created: String,
  date_update: String,
});

// Simple JS date formatting
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
