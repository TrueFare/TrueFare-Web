<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 space-y-4 border border-gray-100 dark:border-gray-700"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h3
          class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <i class="fa-solid fa-building text-purple-500"></i>
          {{ name }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ barangay }}, {{ city }}
        </p>
      </div>

      <!-- TODA ADMIN COUNT -->
      <button
        @click="viewAdmins"
        class="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 px-3 py-1.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition"
        title="View TODA Admins"
      >
        <i class="fa-solid fa-user-shield text-sm"></i>
        <span class="text-sm font-semibold">{{ adminCount }}</span>
      </button>
    </div>

    <!-- Drivers Count -->
    <div
      class="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl"
    >
      <div
        class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium"
      >
        <i class="fa-solid fa-users"></i>
        Drivers
      </div>
      <div class="text-lg font-bold text-blue-700 dark:text-blue-300">
        {{ driverCount }}
      </div>
    </div>

    <!-- Trip Stats -->
    <div class="grid grid-cols-2 gap-3 text-sm">
      <!-- Daily -->
      <div
        class="flex items-center justify-between bg-green-50 dark:bg-green-900/30 p-3 rounded-xl"
      >
        <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
          <i class="fa-solid fa-calendar-day"></i>
          Today
        </div>
        <span class="font-semibold">{{ dailyTrips }}</span>
      </div>

      <!-- Weekly -->
      <div
        class="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-xl"
      >
        <div
          class="flex items-center gap-2 text-yellow-600 dark:text-yellow-400"
        >
          <i class="fa-solid fa-calendar-week"></i>
          Week
        </div>
        <span class="font-semibold">{{ weeklyTrips }}</span>
      </div>

      <!-- Monthly -->
      <div
        class="flex items-center justify-between bg-purple-50 dark:bg-purple-900/30 p-3 rounded-xl"
      >
        <div
          class="flex items-center gap-2 text-purple-600 dark:text-purple-400"
        >
          <i class="fa-solid fa-calendar-alt"></i>
          Month
        </div>
        <span class="font-semibold">{{ monthlyTrips }}</span>
      </div>

      <!-- All Time -->
      <div
        class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-xl"
      >
        <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <i class="fa-solid fa-chart-line"></i>
          All Time
        </div>
        <span class="font-semibold">{{ allTimeTrips }}</span>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2"
    >
      <i class="fa-solid fa-clock"></i>
      Created: {{ formatDate(date_created) }}
    </div>
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

const adminCount = ref(0);
const driverCount = ref(0);
const dailyTrips = ref(0);
const weeklyTrips = ref(0);
const monthlyTrips = ref(0);
const allTimeTrips = ref(0);

const fetchStats = async () => {
  try {
    const id = props.id;

    const [drivers, admins, daily, weekly, monthly, allTime] =
      await Promise.all([
        $fetch(`/api/driver/count/toda/${id}`),
        $fetch(`/api/toda/count_admin/${id}`),
        $fetch(`/api/trip/count/toda/${id}/daily`),
        $fetch(`/api/trip/count/toda/${id}/weekly`),
        $fetch(`/api/trip/count/toda/${id}/monthly`),
        $fetch(`/api/trip/count/toda/${id}/all-time`),
      ]);

    driverCount.value = drivers.count;
    adminCount.value = admins.count;
    dailyTrips.value = daily.count;
    weeklyTrips.value = weekly.count;
    monthlyTrips.value = monthly.count;
    allTimeTrips.value = allTime.count;
  } catch (err) {
    console.error("Failed to fetch TODA satats:", err);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
};

const viewAdmins = () => {
  console.log("View TODA admins for TODA ID:", props.id);
};

onMounted(fetchStats);
</script>
