<template>
  <div
    class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 space-y-3 hover:shadow-lg transition"
  >
    <!-- Header -->
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ name }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-300">
        {{ barangay }}, {{ city }}
      </p>
    </div>

    <!-- Drivers -->
    <div class="text-sm text-blue-500 font-medium">
      Drivers: {{ driverCount }}
    </div>

    <!-- Trip Stats -->
    <div
      class="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400"
    >
      <div>Today: {{ dailyTrips }}</div>
      <div>This Week: {{ weeklyTrips }}</div>
      <div>This Month: {{ monthlyTrips }}</div>
      <div>All Time: {{ allTimeTrips }}</div>
    </div>

    <!-- Created -->
    <p class="text-xs text-gray-400">Created: {{ formatDate(date_created) }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  id: Number,
  name: String,
  barangay: String,
  city: String,
  date_created: String,
});

// Counts
const driverCount = ref(0);
const dailyTrips = ref(0);
const weeklyTrips = ref(0);
const monthlyTrips = ref(0);
const allTimeTrips = ref(0);

const fetchStats = async () => {
  try {
    const id = props.id;

    const [drivers, daily, weekly, monthly, allTime] = await Promise.all([
      $fetch(`/api/driver/count/toda/${id}`),
      $fetch(`/api/trip/count/toda/${id}/daily`),
      $fetch(`/api/trip/count/toda/${id}/weekly`),
      $fetch(`/api/trip/count/toda/${id}/monthly`),
      $fetch(`/api/trip/count/toda/${id}/all-time`),
    ]);

    driverCount.value = drivers.count;
    dailyTrips.value = daily.count;
    weeklyTrips.value = weekly.count;
    monthlyTrips.value = monthly.count;
    allTimeTrips.value = allTime.count;
  } catch (err) {
    console.error("Failed to fetch TODA stats:", err);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

onMounted(fetchStats);
</script>
