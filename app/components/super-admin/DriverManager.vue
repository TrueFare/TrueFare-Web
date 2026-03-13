<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold mb-4">Tricycles</h2>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <button class="btn btn-primary" @click="showAddTricycle = true">
        <Icon name="mdi:plus" class="text-xl" />
        Add Driver
      </button>

      <button
        class="btn btn-outline btn-secondary"
        :disabled="!tricycles.length"
        @click="exportToCsv('Tricycle_Drivers', tricycles)"
      >
        <Icon name="mdi:file-export" class="text-xl" />
        Export to CSV
      </button>
    </div>

    <TricycleSearch @search="handleSearchDriver" />

    <TricycleTable
      :drivers="tricycles"
      :loading="loading"
      @refresh="fetchTricycles"
    />

    <Pagination
      v-model:page="tricyclePage"
      :total-items="totalTricycles"
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
import { ref, watch, onMounted } from "vue";
import TricycleTable from "~/components/tables/TricycleTable.vue";
import Pagination from "~/components/Pagination.vue";
import TricycleSearch from "~/components/search/TricycleSearch.vue";
import AddTricycle from "~/components/create/AddTricycle.vue";

const { exportToCsv } = useCsvExport();
const emits = defineEmits(['refresh-counts']);

const tricycles = ref([]);
const totalTricycles = ref(0);
const tricyclePage = ref(1);
const perTricyclePage = 6;
const loading = ref(false);

const fetchTricycles = async () => {
  loading.value = true;
  try {
    const response = await $fetch("/api/driver", {
      params: {
        page: tricyclePage.value,
        limit: perTricyclePage
      }
    });
    tricycles.value = response.results || [];
    totalTricycles.value = response.total || 0;
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
  } finally {
    loading.value = false;
  }
};

watch(tricyclePage, () => {
  fetchTricycles();
});

const handleSearchDriver = async (query) => {
  if (!query) {
    tricyclePage.value = 1;
    fetchTricycles();
    return;
  }
  try {
    const response = await $fetch("/api/driver/search", {
      params: { search: query },
    });
    // Search results are typically not paginated in the same way or use a different endpoint
    // For simplicity, we'll just show what the search returns
    tricycles.value = response.results || response;
    totalTricycles.value = tricycles.value.length;
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
