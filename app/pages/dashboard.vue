<template>
  <div class="p-6 space-y-6">
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

    <!-- Tab Content -->
    <div>
      <!-- Dashboard Cards -->
      <div
        v-if="activeTab === 'dashboard'"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
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
      </div>

      <!-- TODAs List -->
      <div v-if="activeTab === 'todas'" class="space-y-4">
        <h2 class="text-xl font-bold mb-4">TODA Associations</h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <TodaCard
            v-for="toda in todas"
            :key="toda.id"
            :name="toda.name"
            :location="toda.location"
            :tricycles="toda.tricycles"
            :trips="toda.trips"
          >
          </TodaCard>
        </div>
      </div>

      <!-- TRICYCLES List -->
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

      <!-- Placeholder for other tabs -->
      <div v-if="activeTab === 'reports'" class="text-gray-500">
        Reports content coming soon...
      </div>
      <div v-if="activeTab === 'users'" class="text-gray-500">
        Users content coming soon...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DashboardCard from "~/components/DashboardCard.vue";
import TodaCard from "~/components/TodaCard.vue";
import TricycleCard from "~/components/TricycleCard.vue";

// Track which tab is active
const activeTab = ref("dashboard");

// Dummy TODAs list (replace later with API or database fetch)
const todas = ref([
  {
    id: 1,
    name: "TODA 1",
    location: "Barangay 1",
    tricycles: 3,
    trips: 2,
    admins: 0,
  },
  {
    id: 2,
    name: "TODA 2",
    location: "Barangay 2",
    tricycles: 3,
    trips: 2,
    admins: 0,
  },
  {
    id: 3,
    name: "TODA 3",
    location: "Barangay 3",
    tricycles: 3,
    trips: 2,
    admins: 0,
  },
  {
    id: 4,
    name: "TODA 4",
    location: "Barangay 4",
    tricycles: 3,
    trips: 2,
    admins: 0,
  },
]);

// Dummy tricycles list
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
</script>
