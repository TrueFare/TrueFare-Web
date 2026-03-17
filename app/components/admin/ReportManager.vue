<template>
  <div class="space-y-4">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
    >
      <div>
        <h2 class="text-xl font-bold">Reports Log</h2>
      </div>

      <button
        class="btn btn-outline btn-secondary"
        :disabled="!items.length"
        @click="exportToCsv('Reports_Log', items)"
      >
        <Icon name="mdi:file-export" class="text-xl" />
        Export to CSV
      </button>
    </div>

    <!-- SEARCH BAR -->
    <div class="flex items-center gap-2 mb-6">
      <div class="relative flex-1 sm:max-w-md">
        <Icon
          name="mdi:magnify"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 text-xl"
        />
        <input
          v-model="searchQuery"
          @input="onSearch"
          type="text"
          placeholder="Search by ID, driver, or details..."
          class="input input-bordered w-full pl-12 rounded-2xl focus:input-primary"
        />
      </div>

      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="btn btn-ghost btn-circle"
        title="Clear search"
      >
        <Icon name="mdi:close-circle" class="text-2xl text-base-content/30" />
      </button>
    </div>

    <TicketTable :items="items" :loading="pending" @refresh="fetchReports" />

    <Pagination
      v-model:page="page"
      :total-items="totalItems"
      :per-page="perPage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import TicketTable from "~/components/tables/TicketTable.vue";
import Pagination from "~/components/Pagination.vue";
import { useAuth } from "~/composables/useAuth";

const { user } = useAuth();
const { exportToCsv } = useCsvExport();

const items = ref([]);
const pending = ref(false);
const searchQuery = ref("");
const page = ref(1);
const perPage = ref(10);
const totalItems = ref(0);

const fetchReports = async () => {
  pending.value = true;
  try {
    const data = await $fetch("/api/report", {
      params: {
        search: searchQuery.value,
        page: page.value,
        limit: perPage.value,
        todaId: user.value?.toda_id || "",
      },
    });
    items.value = data.results || [];
    totalItems.value = data.total || 0;
  } catch (e) {
    console.error("Failed to fetch reports", e);
  } finally {
    pending.value = false;
  }
};

let searchTimeout = null;
const onSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchReports();
  }, 500);
};

const clearSearch = () => {
  searchQuery.value = "";
  page.value = 1;
  fetchReports();
};

watch(page, () => {
  fetchReports();
});

onMounted(() => {
  fetchReports();
});
</script>
