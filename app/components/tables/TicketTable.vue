<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center p-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else>
      <div v-if="items.length === 0" class="p-6 text-center text-gray-500">
        No reports found.
      </div>

      <div v-else>
        <!-- DESKTOP TABLE -->
        <div
          class="hidden sm:block bg-base-100 rounded-2xl shadow border border-base-200 overflow-x-auto"
        >
          <table class="table table-zebra w-full">
            <thead class="bg-base-200 text-base-content/70">
              <tr class="border-none uppercase text-[10px] tracking-widest font-black">
                <th class="px-6 py-4">Report ID</th>
                <th class="px-6 py-4">Reporter</th>
                <th class="px-6 py-4">Driver</th>
                <th class="px-6 py-4">Trip ID</th>
                <th class="px-6 py-4">Details</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in items"
                :key="r.id"
                class="transition duration-150 hover:bg-base-200/50 border-base-200"
              >
                <td class="px-6 py-4 font-black text-primary">
                  #{{ r.id }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-base-content">{{ r.user_name || ('User ' + r.user_id) }}</span>
                    <span class="text-[10px] uppercase font-bold text-base-content/30">{{ formatDate(r.date_created) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 font-medium">
                   <div class="flex flex-col">
                    <span class="font-bold text-base-content">{{ r.driver_name || ('Driver ' + r.driver_id) }}</span>
                    <span class="text-[10px] uppercase font-bold text-primary">{{ r.plate_number }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-info font-black">
                  #{{ r.trip_id }}
                </td>
                <td class="px-6 py-4 max-w-xs">
                  <p class="truncate text-base-content/60 text-xs italic" :title="r.report_details">
                    "{{ r.report_details }}"
                  </p>
                </td>
                <td class="px-6 py-4">
                  <div
                    class="badge badge-sm gap-1 font-bold uppercase text-[9px] tracking-widest py-3 px-2"
                    :class="r.status === 0 ? 'badge-warning' : 'badge-success'"
                  >
                    <Icon :name="r.status === 0 ? 'mdi:clock-outline' : 'mdi:check-circle'" />
                    {{ statusText(r.status) }}
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <button class="btn btn-ghost btn-xs text-primary font-black uppercase tracking-widest" @click="openReport(r)">View</button>
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
            class="card bg-base-100 shadow-md p-6 space-y-4 border border-base-200"
          >
            <!-- Header -->
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-bold flex items-center gap-2">
                  <Icon name="mdi:alert" class="text-warning text-xl" />
                  Report #{{ r.id }}
                </h3>
                <p class="text-sm text-base-content/60">{{ r.user_name || ('User ' + r.user_id) }}</p>
              </div>
              <div class="text-right">
                <div class="text-[10px] font-bold uppercase tracking-wider text-base-content/30">{{ formatDate(r.date_created) }}</div>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="flex flex-col bg-info/10 p-3 rounded-xl border border-info/10">
                <span class="text-[10px] font-bold uppercase tracking-wider text-info/60 mb-1">Reporter</span>
                <span class="font-bold truncate">{{ r.user_name || ('User ' + r.user_id) }}</span>
              </div>
              <div class="flex flex-col bg-success/10 p-3 rounded-xl border border-success/10">
                <span class="text-[10px] font-bold uppercase tracking-wider text-success/60 mb-1">Driver</span>
                <span class="font-bold truncate">{{ r.driver_name || ('Driver ' + r.driver_id) }}</span>
              </div>
            </div>

            <!-- Details -->
            <div class="text-sm text-base-content/70 line-clamp-2 italic bg-base-200/50 p-3 rounded-xl border border-base-content/5">
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
    <ClientOnly>
      <div
        v-if="showModal"
        class="fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="card bg-base-100 shadow-2xl w-full max-w-2xl max-h-[90dvh] overflow-hidden flex flex-col relative border border-base-200">
          <!-- CLOSE -->
          <button
            class="absolute right-4 top-4 btn btn-sm btn-circle btn-ghost z-10"
            @click="closeModal"
          >
            ✕
          </button>

          <!-- HEADER -->
          <div class="bg-gradient-to-r from-warning to-orange-600 p-6 text-white shrink-0">
            <h2 class="text-2xl font-black flex items-center gap-2 uppercase tracking-tight">
              <Icon name="mdi:alert-decagram" class="text-3xl" />
              Report #{{ selectedReport?.id }}
            </h2>
            <p class="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Submitted on {{ formatDate(selectedReport?.date_created) }}</p>
          </div>

          <!-- BODY -->
          <div class="p-6 overflow-y-auto space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
                <p class="text-[10px] text-base-content/40 uppercase font-black mb-1 tracking-widest">Reporter</p>
                <p class="font-bold text-base-content">{{ selectedReport?.user_name || ('User ' + selectedReport?.user_id) }}</p>
              </div>
              <div class="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
                <p class="text-[10px] text-base-content/40 uppercase font-black mb-1 tracking-widest">Driver Involved</p>
                <p class="font-bold text-base-content">
                  {{ selectedReport?.driver_name || ('Driver ' + selectedReport?.driver_id) }}
                  <span class="block text-[10px] text-primary">{{ selectedReport?.plate_number }}</span>
                </p>
              </div>
              <div class="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
                <p class="text-[10px] text-base-content/40 uppercase font-black mb-1 tracking-widest">Trip ID</p>
                <p class="font-bold text-primary">#{{ selectedReport?.trip_id }}</p>
              </div>
            </div>

            <div>
              <p class="text-[10px] text-base-content/40 uppercase font-black mb-2 tracking-widest">Report Details</p>
              <div class="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 text-base-content leading-relaxed italic">
                "{{ selectedReport?.report_details }}"
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="flex-1">
                <p class="text-[10px] text-base-content/40 uppercase font-black mb-2 tracking-widest">Current Status</p>
                <div 
                  class="badge badge-lg gap-2 py-4 px-4 font-black uppercase text-[10px] tracking-widest"
                  :class="selectedReport?.status === 0 ? 'badge-warning' : 'badge-success'"
                >
                  <Icon :name="selectedReport?.status === 0 ? 'mdi:clock-outline' : 'mdi:check-circle'" />
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
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(["refresh"]);

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
    emit('refresh');
  } catch (e) {
    console.error('Failed to update report status', e);
    alert('Failed to update status');
  } finally {
    updating.value = false;
  }
};

const statusText = (s) => {
  if (s === null || s === undefined) return 'Unknown';
  if (s === 0) return 'Pending';
  if (s === 1) return 'Resolved';
  return String(s);
};

const formatDate = (d) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleString('en-PH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch (e) {
    return d;
  }
};
</script>
