<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold mb-4">TODA Associations</h2>

    <button class="btn btn-primary" @click="showAddToda = true">
      <i class="fa-solid fa-plus mr-2"></i>
      Add TODA
    </button>

    <TodaSearch @search="handleSearchToda" />

    <div
      v-if="todas.length === 0"
      class="flex flex-col items-center justify-center py-20 text-gray-400"
    >
      <i class="fa-solid fa-building-circle-xmark text-5xl mb-4"></i>
      <p class="text-lg font-semibold">No TODAs available</p>
      <p class="text-sm">Create or register a TODA to get started.</p>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <TodaCard
        v-for="toda in paginatedTodas"
        :key="toda.id"
        :id="toda.id"
        :name="toda.name"
        :barangay="toda.barangay"
        :city="toda.city"
        :date_created="toda.date_created"
        :date_update="toda.date_updated"
        @view-admins="openAdminView"
        @view-drivers="openDriverView"
        @edit="openEditToda"
      />
    </div>
    <Pagination
      v-model:page="todaPage"
      :total-items="todas.length"
      :per-page="perTodaPage"
    />

    <TodaAdminView
      :show="showAdminModal"
      :todaId="selectedToda"
      @close="showAdminModal = false"
    />

    <TodaDriverView
      :show="showDriverModal"
      :todaId="selectedDriverToda"
      @close="showDriverModal = false"
    />

    <TodaProfileCard
      :show="showEditModal"
      :toda="selectedTodaData"
      @close="closeEditToda"
      @updated="refreshTodas"
    />

    <AddToda
      :show="showAddToda"
      @close="showAddToda = false"
      @created="refreshTodas"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TodaCard from "~/components/cards/TodaCard.vue";
import Pagination from "~/components/Pagination.vue";
import TodaSearch from "~/components/search/TodaSearch.vue";
import TodaAdminView from "~/components/profile/TodaAdminView.vue";
import TodaDriverView from "~/components/profile/TodaDriverView.vue";
import AddToda from "~/components/create/AddToda.vue";
import TodaProfileCard from "~/components/profile/TodaProfileCard.vue";

const emits = defineEmits(['refresh-counts']);

const todas = ref([]);
const fetchTodas = async () => {
  try {
    const response = await $fetch("/api/toda");
    todas.value = response.results || [];
  } catch (error) {
    console.error("Failed to fetch todas:", error);
  }
};

const todaPage = ref(1);
const perTodaPage = 8;
const paginatedTodas = computed(() => {
  const start = (todaPage.value - 1) * perTodaPage;
  return todas.value.slice(start, start + perTodaPage);
});

const handleSearchToda = async (query) => {
  if (!query) {
    fetchTodas();
    return;
  }
  try {
    const response = await $fetch("/api/toda/search", {
      params: { search: query },
    });
    todas.value = response.results || response;
    todaPage.value = 1;
  } catch (error) {
    console.error("Failed to search toda:", error);
  }
};

const showAdminModal = ref(false);
const selectedToda = ref(null);
const openAdminView = (id) => {
  selectedToda.value = id;
  showAdminModal.value = true;
};

const showDriverModal = ref(false);
const selectedDriverToda = ref(null);
const openDriverView = (id) => {
  selectedDriverToda.value = id;
  showDriverModal.value = true;
};

const showEditModal = ref(false);
const selectedTodaData = ref(null);
const openEditToda = async (id) => {
  try {
    const response = await $fetch(`/api/toda/${id}`);
    selectedTodaData.value = response.results?.[0] || response;
    showEditModal.value = true;
  } catch (error) {
    console.error("Failed to fetch toda details:", error);
  }
};

const closeEditToda = () => {
  showEditModal.value = false;
  selectedTodaData.value = null;
};

const refreshTodas = () => {
  fetchTodas();
  emits('refresh-counts');
};

const showAddToda = ref(false);

onMounted(() => {
  fetchTodas();
});
</script>
