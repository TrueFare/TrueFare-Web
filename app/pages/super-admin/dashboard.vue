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
            value="6"
            icon="fa-solid fa-building"
            bgColor="bg-purple-700 text-white"
            textColor="text-purple-400"
          />
          <DashboardCard
            title="Total Tricycles"
            value="24"
            icon="fa-solid fa-bicycle"
            bgColor="bg-blue-700 text-white"
            textColor="text-blue-400"
          />
          <DashboardCard
            title="Total Trips"
            value="5"
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
            value="1"
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

      <!-- ========================= -->
      <!-- TODAs -->
      <!-- ========================= -->
      <div v-if="activeTab === 'todas'" class="space-y-4">
        <h2 class="text-xl font-bold mb-4">TODA Associations</h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <TodaCard
            v-for="toda in todos"
            :key="toda.id"
            :name="toda.name"
            :location="toda.location"
            :tricycles="toda.tricycles"
            :trips="toda.trips"
          />
        </div>
      </div>

      <!-- ========================= -->
      <!-- TRICYCLES -->
      <!-- ========================= -->
      <div v-if="activeTab === 'tricycles'" class="space-y-4">
        <h2 class="text-xl font-bold mb-4">TRICYCLES</h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <TricycleCard
            v-for="tricycle in tricycles"
            :key="tricycle.id"
            :f_name="tricycle.f_name"
            :l_name="tricycle.l_name"
            :toda="tricycle.toda"
            :franchise="tricycle.franchise"
            :status="tricycle.status"
          />
        </div>
      </div>

      <!-- Reports -->
      <div v-if="activeTab === 'reports'" class="text-gray-500">
        Reports content coming soon...
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
import { ref } from "vue";
import DashboardCard from "~/components/DashboardCard.vue";
import TodaCard from "~/components/TodaCard.vue";
import TricycleCard from "~/components/TricycleCard.vue";
import ChartFareTrend from "~/components/charts/ChartFareTrend.vue";
import UserCard from "~/components/UserCard.vue";

const activeTab = ref("dashboard");

const todos = ref([
  { id: 1, name: "TODA 1", location: "Barangay 1", tricycles: 3, trips: 2 },
  { id: 2, name: "TODA 2", location: "Barangay 2", tricycles: 3, trips: 2 },
  { id: 3, name: "TODA 3", location: "Barangay 3", tricycles: 3, trips: 2 },
  { id: 4, name: "TODA 4", location: "Barangay 4", tricycles: 3, trips: 2 },
]);

const tricycles = ref([
  {
    id: 1,
    f_name: "Juan",
    l_name: "Dela Cruz",
    toda: "TODA 1",
    franchise: "#34123",
    status: "Active",
  },
  {
    id: 2,
    f_name: "Pedro",
    l_name: "Santos",
    toda: "TODA 1",
    franchise: "#34132",
    status: "Active",
  },
  {
    id: 3,
    f_name: "Maria",
    l_name: "Reyes",
    toda: "TODA 2",
    franchise: "#34167",
    status: "Inactive",
  },
  {
    id: 4,
    f_name: "Jose",
    l_name: "Garcia",
    toda: "TODA 3",
    franchise: "#34562",
    status: "Active",
  },
]);

import { onMounted } from "vue";

const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await $fetch("/api/user");
    users.value = response.results || [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
