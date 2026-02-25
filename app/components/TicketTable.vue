<template>
  <div>
    <div v-if="pending" class="flex items-center justify-center p-8">
      <span class="loading loading-spinner text-primary"></span>
    </div>

    <div v-else>
      <div v-if="items.length === 0" class="p-6 text-center text-gray-500">
        No reports found.
      </div>

      <div class="grid gap-4 max-w-3xl mx-auto">
        <div
          v-for="r in items"
          :key="r.id"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 space-y-4 border border-gray-100 dark:border-gray-700"
        >
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation text-yellow-500"></i>
                Report #{{ r.id }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ r.user_name || ('User ' + r.user_id) }}</p>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-400">{{ formatDate(r.date_created) }}</div>
            </div>
          </div>

          <!-- Stats Grid (mirrors TodaCard layout) -->
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
              <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                <i class="fa-solid fa-user"></i>
                Reporter
              </div>
              <div class="text-sm font-semibold text-blue-700 dark:text-blue-300">{{ r.user_name || ('User ' + r.user_id) }}</div>
            </div>

            <div class="flex items-center justify-between bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
              <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
                <i class="fa-solid fa-user-tie"></i>
                Driver
              </div>
              <span class="font-semibold">{{ r.driver_name || ('Driver ' + r.driver_id) }}</span>
            </div>

            <div class="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-xl">
              <div class="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <i class="fa-solid fa-road"></i>
                Trip
              </div>
              <span class="font-semibold">{{ r.trip_id }}</span>
            </div>

            <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-xl">
              <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <i class="fa-solid fa-info-circle"></i>
                Status
              </div>
              <span class="font-semibold">{{ statusText(r.status) }}</span>
            </div>
          </div>

          <!-- Details -->
          <div class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ r.report_details }}</div>

          <!-- Footer -->
          <div class="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
            <i class="fa-solid fa-clock"></i>
            Created: {{ formatDate(r.date_created) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  autoFetch: { type: Boolean, default: true },
});

const items = ref([]);
const pending = ref(false);

const fetchReports = async () => {
  pending.value = true;
  try {
    const resp = await $fetch('/api/report');
    // many API handlers in this project return an object with `results` array
    items.value = resp.results || resp || [];
  } catch (e) {
    console.error('Failed to fetch reports', e);
    items.value = [];
  } finally {
    pending.value = false;
  }
};

const statusText = (s) => {
  if (s === null || s === undefined) return 'Unknown';
  if (s === 0) return 'Pending';
  if (s === 1) return 'Resolved';
  return String(s);
};

const statusClass = (s) => {
  if (s === 0) return 'badge-warning';
  if (s === 1) return 'badge-success';
  return 'badge-neutral';
};

const formatDate = (d) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return d;
  }
};

if (typeof window !== 'undefined') {
  fetchReports();
}
</script>
