<template>
  <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden flex flex-col">
    <!-- Header (Static) -->
    <div class="p-6 border-b border-base-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <Icon name="mdi:history" class="text-primary" />
        Activity Log
      </h2>
      
      <div class="flex flex-wrap items-center gap-2">
        <div class="join">
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="Search actor or ID..." 
            class="input input-bordered input-sm join-item w-40 md:w-auto"
            @input="handleSearch"
          />
          <select v-model="filters.table_name" class="select select-bordered select-sm join-item" @change="fetchActivities">
            <option value="">All Tables</option>
            <option v-for="table in tableList" :key="table" :value="table">{{ formatLabel(table) }}</option>
          </select>
          <select v-model="filters.action" class="select select-bordered select-sm join-item" @change="fetchActivities">
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
          </select>
        </div>
        <button class="btn btn-ghost btn-sm btn-circle" @click="fetchActivities" :disabled="loading">
          <Icon name="mdi:refresh" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Scrollable Body with Fixed Height -->
    <div v-if="loading && !activities.length" class="flex items-center justify-center p-12 h-[500px]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else class="overflow-auto max-h-[500px] relative">
      <table class="table table-zebra w-full table-pin-rows">
        <thead class="bg-base-200 text-base-content/70">
          <tr class="border-none uppercase text-[10px] tracking-widest font-black">
            <th class="px-6 py-4 bg-base-200">Actor</th>
            <th class="px-6 py-4 bg-base-200">Action</th>
            <th class="px-6 py-4 bg-base-200">Target</th>
            <th class="px-6 py-4 bg-base-200">Changes</th>
            <th class="px-6 py-4 bg-base-200">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="activities.length === 0">
            <td colspan="5" class="text-center py-12 text-base-content/30 italic font-medium">
              No activities found.
            </td>
          </tr>
          <tr v-for="activity in activities" :key="activity.id" class="text-sm border-base-200 hover:bg-base-200/50">
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <span class="font-bold whitespace-nowrap">{{ activity.actor_name }}</span>
                <span class="text-[10px] uppercase font-black tracking-tighter text-base-content/40">{{ activity.actor_role }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="badge badge-sm font-bold border-none text-[10px] tracking-widest uppercase py-2.5" :class="actionClass(activity.action)">
                {{ activity.action }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <span class="font-bold text-primary">{{ formatLabel(activity.table_name) }}</span>
                <span class="text-[10px] text-base-content/40 font-mono">ID: {{ activity.record_id }}</span>
              </div>
            </td>
            <td class="px-6 py-4 max-w-xs">
              <div v-if="activity.changes" class="flex flex-col gap-1">
                <div v-for="(change, field) in filteredChanges(activity.table_name, activity.changes)" :key="field" class="text-[11px] leading-tight">
                  <span class="font-black text-base-content/50 uppercase mr-1">{{ field }}:</span>
                  <span class="text-error line-through mr-1 opacity-70">{{ change.old }}</span>
                  <Icon name="mdi:arrow-right" class="text-[10px] text-base-content/30 align-middle" />
                  <span class="text-success font-bold ml-1">{{ change.new }}</span>
                </div>
                <div v-if="Object.keys(filteredChanges(activity.table_name, activity.changes)).length === 0" class="text-[10px] italic text-base-content/30">
                  <span v-if="activity.action === 'CREATE'">New record created</span>
                  <span v-else-if="activity.action === 'DELETE'">Record deleted</span>
                  <span v-else>No important fields changed</span>
                </div>
              </div>
              <span v-else class="text-[10px] italic text-base-content/30">-</span>
            </td>
            <td class="px-6 py-4 text-[10px] font-bold uppercase text-base-content/30 whitespace-nowrap">
              {{ formatDate(activity.date_created) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';

const activities = ref([]);
const loading = ref(false);
const filters = reactive({
  search: '',
  table_name: '',
  action: '',
});

const tableList = ['admin', 'super_admin', 'driver', 'fare', 'report', 'toda', 'trip', 'user'];

const importantFields = {
  admin: ['email', 'toda_id'],
  super_admin: ['email', 'toda_id'],
  driver: ['plate_number', 'franchise_number', 'is_registered', 'toda_id'],
  fare: ['base_km', 'base_fare', 'fare_per_km'],
  report: ['status'],
  toda: ['name', 'barangay', 'city'],
  trip: ['trip_start', 'trip_end', 'driver_id'],
  user: ['email'],
};

let searchTimeout;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchActivities();
  }, 500);
};

const fetchActivities = async () => {
  loading.value = true;
  try {
    const data = await $fetch('/api/audit', { query: filters });
    activities.value = data.activities || [];
  } catch (err) {
    console.error('Failed to fetch activities:', err);
  } finally {
    loading.value = false;
  }
};

const actionClass = (action) => {
  switch (action) {
    case 'CREATE': return 'bg-success/20 text-success';
    case 'UPDATE': return 'bg-info/20 text-info';
    case 'DELETE': return 'bg-error/20 text-error';
    default: return 'bg-base-200 text-base-content/50';
  }
};

const formatLabel = (label) => {
  if (!label) return '';
  return label.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const filteredChanges = (table, changes) => {
  if (!changes) return {};
  const important = importantFields[table] || [];
  const filtered = {};
  for (const field in changes) {
    if (important.includes(field)) {
      filtered[field] = changes[field];
    }
  }
  return filtered;
};

onMounted(fetchActivities);
</script>
