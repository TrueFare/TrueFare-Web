<template>
  <div class="p-6 space-y-8">
    <!-- Top Tabs / Navbar -->
    <ClientOnly>
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
    </ClientOnly>

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
            :value="loadingCounts ? '...' : totalTODAs"
            icon="fa-solid fa-building"
            bgColor="bg-purple-700 text-white"
            textColor="text-purple-400"
          />
          <DashboardCard
            title="Total Tricycles"
            :value="loadingCounts ? '...' : totalTricycles"
            icon="fa-solid fa-bicycle"
            bgColor="bg-blue-700 text-white"
            textColor="text-blue-400"
          />
          <DashboardCard
            title="Total Trips"
            :value="loadingCounts ? '...' : totalTrips"
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
            :value="loadingCounts ? '...' : totalUsers"
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

      <!-- Tricycles -->
      <div v-if="activeTab === 'tricycles'" class="space-y-4">
        <h2 class="text-xl font-bold mb-4">Tricycles</h2>

        <button class="btn btn-primary" @click="showAddTricycle = true">
          <i class="fa-solid fa-plus mr-2"></i>
          Add Driver
        </button>

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
          @created="fetchTricycles"
        />
      </div>

      <!-- Reports -->
      <div v-if="activeTab === 'reports'" class="space-y-4">
        <h2 class="text-xl font-bold">Reports</h2>
        <TicketTable />
      </div>

      <!-- Users -->
      <div v-if="activeTab === 'users'" class="space-y-4">
        <h2 class="text-xl font-bold mb-4">Users</h2>

        <button class="btn btn-primary" @click="showAddAdmin = true">
          <i class="fa-solid fa-plus mr-2"></i>
          Add Admin
        </button>

        <UserSearch @search="handleSearchUser" />

        <UserTable :users="paginatedUsers" @refresh="fetchUsers" />

        <Pagination
          v-model:page="userPage"
          :total-items="users.length"
          :per-page="perUserPage"
        />
        <AddAdmin
          :show="showAddAdmin"
          @close="showAddAdmin = false"
          @created="fetchUsers"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import DashboardCard from "~/components/cards/DashboardCard.vue";
import TodaCard from "~/components/cards/TodaCard.vue";
import TricycleTable from "~/components/tables/TricycleTable.vue";
import ChartFareTrend from "~/components/charts/ChartFareTrend.vue";
import UserTable from "~/components/tables/UserTable.vue";
import Pagination from "~/components/Pagination.vue";
import TricycleSearch from "~/components/search/TricycleSearch.vue";
import TodaSearch from "~/components/search/TodaSearch.vue";
import TicketTable from "~/components/tables/TicketTable.vue";
import UserSearch from "~/components/search/UserSearch.vue";
import TodaAdminView from "~/components/profile/TodaAdminView.vue";
import TodaDriverView from "~/components/profile/TodaDriverView.vue";
import AddToda from "~/components/create/AddToda.vue";
import AddTricycle from "~/components/create/AddTricycle.vue";
import AddAdmin from "~/components/create/AddAdmin.vue";
import TodaProfileCard from "~/components/profile/TodaProfileCard.vue";
import ChartTopToda from "~/components/charts/ChartTopToda.vue";

const activeTab = ref("dashboard");

// Loading state for counts
const loadingCounts = ref(true);

onMounted(() => {
  activeTab.value = "dashboard";
});

// Dashboard counts
const totalCounts = ref({
  todas: 0,
  drivers: 0,
  users: 0,
  trips: 0,
});

// Computed for easy access
const totalTODAs = computed(() => totalCounts.value.todas);
const totalTricycles = computed(() => totalCounts.value.drivers);
const totalUsers = computed(() => totalCounts.value.users);
const totalTrips = computed(() => totalCounts.value.trips);

// Fetch all counts in parallel
const fetchCounts = async () => {
  try {
    const [todasRes, driversRes, usersRes, tripsRes] = await Promise.all([
      $fetch("/api/toda/count"),
      $fetch("/api/driver/count"),
      $fetch("/api/user/count"),
      $fetch("/api/trip/count"),
    ]);

    totalCounts.value = {
      todas: todasRes.count || 0,
      drivers: driversRes.count || 0,
      users: usersRes.count || 0,
      trips: tripsRes.count || 0,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard counts:", error);
  } finally {
    loadingCounts.value = false;
  }
};

// USERS
const users = ref([]);
const fetchUsers = async () => {
  try {
    const response = await $fetch("/api/account");
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

// TRICYCLES
const tricycles = ref([]);
const fetchTricycles = async () => {
  try {
    const response = await $fetch("/api/driver");
    tricycles.value = response.results || [];
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
  }
};

// Pagination for tricycles
const tricyclePage = ref(1);
const perTricyclePage = 6;
const paginatedTricycles = computed(() => {
  const start = (tricyclePage.value - 1) * perTricyclePage;
  return tricycles.value.slice(start, start + perTricyclePage);
});

// Pagination for todas
const todaPage = ref(1);
const perTodaPage = 8;
const paginatedTodas = computed(() => {
  const start = (todaPage.value - 1) * perTodaPage;
  return todas.value.slice(start, start + perTodaPage);
});

// Pagination for users
const userPage = ref(1);
const perUserPage = 6;
const paginatedUsers = computed(() => {
  const start = (userPage.value - 1) * perUserPage;
  return users.value.slice(start, start + perUserPage);
});

// Search tricycles
const searchDriver = ref("");
const handleSearchDriver = async (query) => {
  searchDriver.value = query;
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

// Search todas
const searchToda = ref("");
const handleSearchToda = async (query) => {
  searchToda.value = query;
  if (!query) {
    fetchTodas(); // reset to all
    return;
  }
  try {
    const response = await $fetch("/api/toda/search", {
      params: { search: query },
    });
    todas.value = response.results || response;
    todaPage.value = 1; // reset pagination
  } catch (error) {
    console.error("Failed to search toda:", error);
  }
};

// Search users
const searchUser = ref("");
const handleSearchUser = async (query) => {
  searchUser.value = query;
  if (!query) {
    fetchUsers(); // reset to all
    return;
  }
  try {
    const response = await $fetch("/api/user/search", {
      params: { search: query },
    });
    users.value = response.results || response;
    userPage.value = 1; // reset pagination
  } catch (error) {
    console.error("Failed to search user:", error);
  }
};

// Open TODA Admin View
const showAdminModal = ref(false);
const selectedToda = ref(null);

const openAdminView = (id) => {
  selectedToda.value = id;
  showAdminModal.value = true;
};

// Open TODA Driver View
const showDriverModal = ref(false);
const selectedDriverToda = ref(null);

const openDriverView = (id) => {
  selectedDriverToda.value = id;
  showDriverModal.value = true;
};

// Open TODA Edit Modal
const showEditModal = ref(false);
const selectedTodaData = ref(null);

const openEditToda = async (id) => {
  // Fetch the toda details
  try {
    const response = await $fetch(`/api/toda/${id}`);
    selectedTodaData.value = response.results?.[0] || response;
    showEditModal.value = true;
  } catch (error) {
    console.error("Failed to fetch toda details:", error);
    alert("Failed to load TODA details");
  }
};

const closeEditToda = () => {
  showEditModal.value = false;
  selectedTodaData.value = null;
};

const refreshTodas = () => {
  fetchTodas();
  fetchCounts();
};

// ADD toda/ drivers/ admins
const showAddToda = ref(false);
const showAddTricycle = ref(false);
const showAddAdmin = ref(false);

// On mounted
onMounted(async () => {
  loadingCounts.value = true;
  await fetchCounts();
  fetchUsers();
  fetchTodas();
  fetchTricycles();
});
</script>
