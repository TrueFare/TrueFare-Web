<template>
  <div
    class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition"
  >
    <!-- TODA name and location -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold">{{ name }}</h3>
      <p class="text-gray-500">{{ location }}</p>
    </div>

    <!-- Stats row -->
    <div class="flex justify-between text-sm text-gray-700 dark:text-gray-300">
      <!-- Tricycles -->
      <div class="flex items-center gap-1">
        <i class="fa-solid fa-bicycle text-blue-500"></i>
        <span>{{ tricycles }}</span>
      </div>

      <!-- Trips -->
      <div class="flex items-center gap-1">
        <i class="fa-solid fa-chart-line text-green-500"></i>
        <span>{{ trips }}</span>
      </div>

      <!-- Admins -->
      <div class="flex items-center gap-1">
        <i class="fa-solid fa-user-group text-purple-500"></i>
        <span>{{ admins }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  location: { type: String, required: true },
  tricycles: { type: Number, default: 0 },
  trips: { type: Number, default: 0 },
  admins: { type: Number, default: 0 },
});
</script>
