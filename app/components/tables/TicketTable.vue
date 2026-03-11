<template>
  <div>
    <div v-if="pending" class="flex items-center justify-center p-8">
      <span class="loading loading-spinner text-primary"></span>
    </div>

    <div v-else>
      <div v-if="items.length === 0" class="p-6 text-center text-gray-500">
        No reports found.
      </div>

      <div v-else>
        <!-- DESKTOP TABLE -->
        <div
          class="hidden sm:block bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-200 dark:border-gray-800 overflow-x-auto"
        >
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 sticky top-0 z-10">
              <tr>
                <th class="px-6 py-4 font-semibold">Report ID</th>
                <th class="px-6 py-4 font-semibold">Reporter</th>
                <th class="px-6 py-4 font-semibold">Driver</th>
                <th class="px-6 py-4 font-semibold">Trip ID</th>
                <th class="px-6 py-4 font-semibold">Details</th>
                <th class="px-6 py-4 font-semibold">Status</th>
                <th class="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(r, index) in items"
                :key="r.id"
                class="border-t dark:border-gray-800 transition duration-150 hover:bg-gray-50 dark:hover:bg-gray-800"
                :class="index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'"
              >
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  #{{ r.id }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-semibold text-gray-800 dark:text-gray-200">{{ r.user_name || ('User ' + r.user_id) }}</span>
                    <span class="text-xs text-gray-500">{{ formatDate(r.date_created) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  {{ r.driver_name || ('Driver ' + r.driver_id) }}
                </td>
                <td class="px-6 py-4 text-blue-600 dark:text-blue-400 font-medium">
                  {{ r.trip_id }}
                </td>
                <td class="px-6 py-4 max-w-xs">
                  <p class="truncate text-gray-600 dark:text-gray-400 text-xs" :title="r.report_details">
                    {{ r.report_details }}
                  </p>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="r.status === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'"
                  >
                    {{ statusText(r.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button class="text-blue-600 hover:text-blue-900 font-medium" @click="openReport(r)">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MOBILE CARDS -->
        <div class="sm:hidden flex flex-col gap-4">
          <div
            v-for="r in items"
            :key="r.id"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4 border border-gray-100 dark:border-gray-700"
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

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="flex flex-col bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
                <span class="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Reporter</span>
                <span class="font-semibold truncate">{{ r.user_name || ('User ' + r.user_id) }}</span>
              </div>
              <div class="flex flex-col bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
                <span class="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Driver</span>
                <span class="font-semibold truncate">{{ r.driver_name || ('Driver ' + r.driver_id) }}</span>
              </div>
            </div>

            <!-- Details -->
            <div class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 italic">
              "{{ r.report_details }}"
            </div>

            <div class="flex justify-end">
              <button class="btn btn-sm btn-primary" @click="openReport(r)">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- REPORT MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90dvh] overflow-hidden flex flex-col relative">
        <!-- CLOSE -->
        <button
          class="absolute right-4 top-4 btn btn-sm btn-circle z-10"
          @click="closeModal"
        >
          ✕
        </button>

        <!-- HEADER -->
        <div class="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 text-white shrink-0">
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation"></i>
            Report #{{ selectedReport?.id }}
          </h2>
          <p class="opacity-90">Submitted on {{ formatDate(selectedReport?.date_created) }}</p>
        </div>

        <!-- BODY -->
        <div class="p-6 overflow-y-auto space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
              <p class="text-xs text-gray-500 uppercase font-bold mb-1">Reporter</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ selectedReport?.user_name || ('User ' + selectedReport?.user_id) }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
              <p class="text-xs text-gray-500 uppercase font-bold mb-1">Driver Involved</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ selectedReport?.driver_name || ('Driver ' + selectedReport?.driver_id) }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
              <p class="text-xs text-gray-500 uppercase font-bold mb-1">Trip ID</p>
              <p class="font-semibold text-blue-600">#{{ selectedReport?.trip_id }}</p>
            </div>
          </div>

          <div>
            <p class="text-xs text-gray-500 uppercase font-bold mb-2">Report Details</p>
            <div class="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {{ selectedReport?.report_details }}
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex-1">
              <p class="text-xs text-gray-500 uppercase font-bold mb-2">Current Status</p>
              <div 
                class="badge badge-lg gap-2 p-4 font-bold"
                :class="selectedReport?.status === 0 ? 'badge-warning' : 'badge-success'"
              >
                {{ statusText(selectedReport?.status) }}
              </div>
            </div>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="border-t dark:border-gray-700 p-5 flex justify-end gap-3 shrink-0">
          <button 
            v-if="selectedReport?.status === 0"
            class="btn btn-success text-white"
            :disabled="updating"
            @click="updateStatus(1)"
          >
            <span v-if="updating" class="loading loading-spinner loading-sm"></span>
            Mark as Resolved
          </button>
          <button class="btn btn-ghost" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';

defineProps({
  autoFetch: { type: Boolean, default: true },
});

const items = ref([]);
const pending = ref(false);
const updating = ref(false);

const showModal = ref(false);
const selectedReport = ref(null);

/* =============================
   LOCK BACKGROUND SCROLL
============================= */
watch(showModal, (visible) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = visible ? 'hidden' : '';
    document.documentElement.style.overflow = visible ? 'hidden' : '';
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
});

const openReport = (report) => {
  selectedReport.value = report;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedReport.value = null;
};

const fetchReports = async () => {
  pending.value = true;
  try {
    const resp = await $fetch('/api/report');
    items.value = resp.results || resp || [];
  } catch (e) {
    console.error('Failed to fetch reports', e);
    items.value = [];
  } finally {
    pending.value = false;
  }
};

const updateStatus = async (newStatus) => {
  if (!selectedReport.value) return;
  updating.value = true;
  try {
    await $fetch('/api/report', {
      method: 'POST',
      body: {
        id: selectedReport.value.id,
        status: newStatus
      }
    });
    // Update local state
    selectedReport.value.status = newStatus;
    const index = items.value.findIndex(i => i.id === selectedReport.value.id);
    if (index !== -1) {
      items.value[index].status = newStatus;
    }
  } catch (e) {
    console.error('Failed to update report status', e);
    alert('Failed to update status');
  } finally {
    updating.value = false;
  }
};

defineExpose({
  items
});

const statusText = (s) => {
  if (s === null || s === undefined) return 'Unknown';
  if (s === 0) return 'Pending';
  if (s === 1) return 'Resolved';
  return String(s);
};

const formatDate = (d) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return d;
  }
};

onMounted(() => {
  fetchReports();
});
</script>
