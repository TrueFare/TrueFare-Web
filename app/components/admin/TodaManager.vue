<template>
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-black uppercase tracking-tight text-base-content">
          {{ todaName || 'Loading...' }}
        </h2>
        <p class="text-xs font-bold uppercase tracking-widest text-primary">
          Manage your TODA members
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button class="btn btn-primary shadow-lg shadow-primary/20" @click="showAddTricycle = true">
          <Icon name="mdi:plus" class="text-xl" />
          Add Driver
        </button>

        <button
          class="btn btn-outline btn-secondary"
          :disabled="!drivers.length"
          @click="exportToCsv('TODA_Drivers', drivers)"
        >
          <Icon name="mdi:file-export" class="text-xl" />
          Export to CSV
        </button>
      </div>
    </div>

    <TricycleSearch @search="handleSearchDriver" />

    <TricycleTable
      :drivers="paginatedDrivers"
      @refresh="fetchDrivers"
    />

    <Pagination
      v-model:page="page"
      :total-items="drivers.length"
      :per-page="perPage"
    />

    <AddTricycle
      :show="showAddTricycle"
      :toda-id="user?.toda_id"
      @close="showAddTricycle = false"
      @created="onDriverCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TricycleTable from "~/components/tables/TricycleTable.vue";
import Pagination from "~/components/Pagination.vue";
import TricycleSearch from "~/components/search/TricycleSearch.vue";
import AddTricycle from "~/components/create/AddTricycle.vue";

const { user } = useAuth();
const { exportToCsv } = useCsvExport();
const emits = defineEmits(['refresh-counts']);

const drivers = ref([]);
const todaName = ref("");
const page = ref(1);
const perPage = 6;

const fetchTodaDetails = async () => {
  if (!user.value?.toda_id) return;
  try {
    const response = await $fetch(`/api/toda/${user.value.toda_id}`);
    if (response?.results?.[0]) {
      todaName.value = response.results[0].name;
    } else if (response?.name) {
      todaName.value = response.name;
    }
  } catch (error) {
    console.error("Failed to fetch TODA details:", error);
  }
};

const fetchDrivers = async () => {
  if (!user.value?.toda_id) return;
  
  try {
    const response = await $fetch(`/api/toda/driver/${user.value.toda_id}`);
    drivers.value = response.data || [];
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
  }
};

const paginatedDrivers = computed(() => {
  const start = (page.value - 1) * perPage;
  return drivers.value.slice(start, start + perPage);
});

const handleSearchDriver = async (query) => {
  if (!query) {
    fetchDrivers();
    return;
  }
  
  if (!user.value?.toda_id) return;

  try {
    const response = await $fetch("/api/toda/driver/search", {
      params: { 
        search: query,
        toda_id: user.value.toda_id
      },
    });
    // The search API returns the result directly (based on my read_file earlier)
    drivers.value = response.results || response || [];
    page.value = 1;
  } catch (error) {
    console.error("Failed to search drivers:", error);
  }
};

const showAddTricycle = ref(false);

const onDriverCreated = () => {
  fetchDrivers();
  emits('refresh-counts');
}

onMounted(() => {
  fetchTodaDetails();
  fetchDrivers();
});
</script>
