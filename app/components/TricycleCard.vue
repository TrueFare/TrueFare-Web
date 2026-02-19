<template>
  <div
    class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition"
  >
    <!-- Tricycle Owner -->
    <div class="mb-2">
      <h3 class="text-lg font-semibold">{{ f_name }} {{ l_name }}</h3>
      <p class="text-gray-500 text-sm">{{ toda }}</p>
    </div>

    <!-- Tricycle Details -->
    <div
      class="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 mt-2"
    >
      <!-- Franchise -->
      <div class="flex items-center gap-1">
        <i class="fa-solid fa-id-card text-blue-500"></i>
        <span>{{ franchise }}</span>
      </div>
      <!-- Placeholder for optional stats -->
      <div class="flex items-center gap-1">
        <i class="fa-solid fa-calendar-check text-green-500"></i>
        <span>{{ status }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  f_name: { type: String, required: true },
  l_name: { type: String, required: true },
  toda: { type: String, required: true },
  franchise: { type: String, default: "-" },
  status: { type: String, default: "-" },
});
</script>
