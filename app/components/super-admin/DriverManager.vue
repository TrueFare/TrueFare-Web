<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold mb-4">Tricycles</h2>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <button class="btn btn-primary" @click="showAddTricycle = true">
        <i class="fa-solid fa-plus mr-2"></i>
        Add Driver
      </button>

      <button
        class="btn btn-outline btn-secondary"
        :disabled="!tricycles.length"
        @click="exportToCsv('Tricycle_Drivers', tricycles)"
      >
        <i class="fa-solid fa-file-csv mr-2"></i>
        Export to CSV
      </button>
    </div>

    <TricycleSearch @search="handleSearchDriver" />

    <TricycleTable
      :drivers="paginatedTricycles"
      @refresh="fetchTricycles"
    />

    <Pagination
      v-model:page="tricyclePage"
      :total-items="tricycles.length"
      :per-page="perTricyclePage"
    />

    <AddTricycle
      :show="showAddTricycle"
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

const { exportToCsv } = useCsvExport();
const emits = defineEmits(['refresh-counts']);

const tricycles = ref([]);
const fetchTricycles = async () => {
  try {
    const response = await $fetch("/api/driver");
    tricycles.value = response.results || [];
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
  }
};

const tricyclePage = ref(1);
const perTricyclePage = 6;
const paginatedTricycles = computed(() => {
  const start = (tricyclePage.value - 1) * perTricyclePage;
  return tricycles.value.slice(start, start + perTricyclePage);
});

const handleSearchDriver = async (query) => {
  if (!query) {
    fetchTricycles();
    return;
  }
  try {
    const response = await $fetch("/api/driver/search", {
      params: { search: query },
    });
    tricycles.value = response.results || response;
    tricyclePage.value = 1;
  } catch (error) {
    console.error("Failed to search drivers:", error);
  }
};

const showAddTricycle = ref(false);

const onDriverCreated = () => {
  fetchTricycles();
  emits('refresh-counts');
}

onMounted(() => {
  fetchTricycles();
});
</script>
