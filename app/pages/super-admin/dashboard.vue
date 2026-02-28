<template>
  <div class="p-6 space-y-8">
    <!-- Top Tabs / Navbar -->
    <div class="tabs tabs-boxed mb-6">
      <button
        class="tab"
        :class="{ 'tab-active': activeTab === 'dashboard' }"
        @click="activeTab = 'dashboard'"
      >
        Dashboard
      </button>
      <button
        class="tab"
        :class="{ 'tab-active': activeTab === 'todas' }"
        @click="activeTab = 'todas'"
      >
        TODAs
      </button>
      <button
        class="tab"
        :class="{ 'tab-active': activeTab === 'tricycles' }"
        @click="activeTab = 'tricycles'"
      >
        Tricycles
      </button>
      <button
        class="tab"
        :class="{ 'tab-active': activeTab === 'reports' }"
        @click="activeTab = 'reports'"
      >
        Reports
      </button>
      <button
        class="tab"
        :class="{ 'tab-active': activeTab === 'users' }"
        @click="activeTab = 'users'"
      >
        Users
      </button>
    </div>

    <!-- ========================= -->
    <!-- TAB CONTENT -->
    <!-- ========================= -->
    <div>
      <!-- ========================= -->
      <!-- DASHBOARD -->
      <!-- ========================= -->
      <div v-if="activeTab === 'dashboard'" class="space-y-10">
        <!-- Statistic Cards -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          <DashboardCard
            title="TODA Associations"
            :value="totalTODAs"
            icon="fa-solid fa-building"
            bgColor="bg-purple-700 text-white"
            textColor="text-purple-400"
          />
          <DashboardCard
            title="Total Tricycles"
            :value="totalTricycles"
            icon="fa-solid fa-bicycle"
            bgColor="bg-blue-700 text-white"
            textColor="text-blue-400"
          />
          <DashboardCard
            title="Total Trips"
            :value="totalTrips"
            icon="fa-solid fa-chart-line"
            bgColor="bg-green-700 text-white"
            textColor="text-green-400"
          />
          <DashboardCard
            title="Total Reports"
            value="1"
            icon="fa-solid fa-triangle-exclamation"
            bgColor="bg-yellow-700 text-white"
            textColor="text-yellow-400"
            subText="1 pending"
          />
          <DashboardCard
            title="TODA Admins"
            value="1"
            icon="fa-solid fa-user-group"
            bgColor="bg-purple-900 text-white"
            textColor="text-purple-400"
          />
          <DashboardCard
            title="Users"
            :value="totalUsers"
            icon="fa-solid fa-user"
            bgColor="bg-orange-900 text-white"
            textColor="text-orange-400"
          />
        </div>

        <!-- Charts Container -->
        <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-inner">
          <h2 class="text-xl font-semibold mb-6">Analytics Overview</h2>

          <!-- Two Charts Side-by-Side -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartFareTrend />

            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-center text-gray-400"
            >
              Another chart here
            </div>
          </div>
        </div>
      </div>

      <!-- Todas -->
      <div v-if="activeTab === 'todas'" class="space-y-4">
        <h2 class="text-xl font-bold mb-4">TODA Associations</h2>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <TodaCard
            v-for="toda in todas"
            :key="toda.id"
            :id="toda.id"
            :name="toda.name"
            :barangay="toda.barangay"
            :city="toda.city"
            :date_created="toda.date_created"
            :date_update="toda.date_updated"
          />
        </div>
      </div>

      <!-- Tricycles -->
      <div v-if="activeTab === 'tricycles'" class="space-y-4">
        <h2 class="text-xl font-bold mb-4">Tricycles</h2>

        <TricycleSearch @search="handleSearch" />

        <TricycleTable
          :drivers="paginatedTricycles"
          @refresh="fetchTricycles"
        />

        <Pagination
          v-model:page="tricyclePage"
          :total-items="tricycles.length"
          :per-page="perPage"
        />
      </div>

      <!-- Reports -->
      <div v-if="activeTab === 'reports'" class="text-gray-500">
            <h2 class="text-xl font-bold">Reports</h2>
        <TicketTable />
      </div>

      <!-- Users -->
      <div v-if="activeTab === 'users'" class="space-y-4">
        <h2 class="text-xl font-bold mb-4">Users</h2>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <UserCard
            v-for="user in users"
            :key="user.id"
            :first_name="user.first_name"
            :last_name="user.last_name"
            :email="user.email"
            :contact_number="user.contact_number"
            :status="'Active'"
            :date_created="user.date_created"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import DashboardCard from "~/components/cards/DashboardCard.vue";
import TodaCard from "~/components/cards/TodaCard.vue";
import TricycleTable from "~/components/tables/TricycleTable.vue";
import ChartFareTrend from "~/components/charts/ChartFareTrend.vue";
import UserCard from "~/components/cards/UserCard.vue";
import Pagination from "~/components/Pagination.vue";
import TricycleSearch from "~/components/search/TricycleSearch.vue";
import TicketTable from "~/components/tables/TicketTable.vue";

const activeTab = ref("dashboard");

import { onMounted } from "vue";

// USERS
const users = ref([]);
const fetchUsers = async () => {
  try {
    const response = await $fetch("/api/user");
    users.value = response.results || [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

// TODAS
const todas = ref([]);
const fetchTodas = async () => {
  try {
    const response = await $fetch("/api/toda");
    todas.value = response.results || [];
  } catch (error) {
    console.error("Failed to fetch todas:", error);
  }
};

//TRICYCLE
const tricycles = ref([]);
const fetchTricycles = async () => {
  try {
    const response = await $fetch("/api/driver");
    tricycles.value = response.results || [];
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
  }
};

//Pagination
const tricyclePage = ref(1);
const perPage = 6;
const paginatedTricycles = computed(() => {
  const start = (tricyclePage.value - 1) * perPage;
  return tricycles.value.slice(start, start + perPage);
});

// SEARCH TRIKE
const searchQuery = ref("");

const handleSearch = async (query) => {
  searchQuery.value = query;

  if (!query) {
    fetchTricycles(); // reset to all
    return;
  }

  try {
    const response = await $fetch("/api/driver/search", {
      params: { search: query },
    });
    tricycles.value = response.results || response;
    tricyclePage.value = 1; // reset pagination
  } catch (error) {
    console.error("Failed to search drivers:", error);
  }
};


// DASHBOARD
// TODA Total
const { data: todaCount } = await useAsyncData("todaCount", () =>
  $fetch("/api/toda/count")
);

const totalTODAs = computed(() => todaCount.value?.count || 0);

// Trike Total
const { data: driverCount } = await useAsyncData("driverCount", () =>
  $fetch("/api/driver/count")
);

const totalTricycles = computed(() => driverCount.value?.count || 0);

// User Total
const { data: userCount } = await useAsyncData("userCount", () =>
  $fetch("/api/user/count")
);

const totalUsers = computed(() => userCount.value?.count || 0);

// Trips Total
const { data: tripCount } = await useAsyncData("tripCount", () =>
  $fetch("/api/user/count")
);

const totalTrips = computed(() => tripCount.value?.count || 0);

onMounted(() => {
  fetchUsers();
  fetchTodas();
  fetchTricycles();
});
</script>
