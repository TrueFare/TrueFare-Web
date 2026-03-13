<template>
  <div class="space-y-10">
    <!-- Statistic Cards -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4"
    >
      <DashboardCard
        title="TODA Associations"
        :value="loading ? '...' : totalCounts.todas"
        icon="mdi:office-building"
        bgColor="bg-purple-700 text-white"
        textColor="text-purple-400"
      />
      <DashboardCard
        title="Total Tricycles"
        :value="loading ? '...' : totalCounts.drivers"
        icon="mdi:motorbike"
        bgColor="bg-blue-700 text-white"
        textColor="text-blue-400"
      />
      <DashboardCard
        title="Total Trips"
        :value="loading ? '...' : totalCounts.trips"
        icon="mdi:chart-line"
        bgColor="bg-green-700 text-white"
        textColor="text-green-400"
      />
      <DashboardCard
        title="Total Reports"
        :value="loading ? '...' : totalCounts.reports"
        icon="mdi:alert-circle"
        bgColor="bg-yellow-700 text-white"
        textColor="text-yellow-400"
      />
      <DashboardCard
        title="TODA Admins"
        :value="loading ? '...' : totalCounts.admins"
        icon="mdi:account-group"
        bgColor="bg-purple-900 text-white"
        textColor="text-purple-400"
      />
      <DashboardCard
        title="Users"
        :value="loading ? '...' : totalCounts.users"
        icon="mdi:account"
        bgColor="bg-orange-900 text-white"
        textColor="text-orange-400"
      />
    </div>

    <!-- Charts Container -->
    <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-inner">
      <h2 class="text-xl font-semibold mb-6">Analytics Overview</h2>

      <!-- Revenue Chart -->
      <div class="mb-6">
        <ChartTodaRevenue />
      </div>

      <!-- Fare Comparison -->
      <div class="mb-6">
        <FareComparison />
      </div>

      <!-- Two Charts Side-by-Side -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartFareTrend />
        <ChartFarePriceTrend />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DashboardCard from "~/components/cards/DashboardCard.vue";
import ChartFareTrend from "~/components/charts/ChartTripNumber.vue";
import ChartFarePriceTrend from "~/components/charts/ChartFarePriceTrend.vue";
import ChartTodaRevenue from "~/components/charts/ChartTodaRevenue.vue";
import FareComparison from "~/components/charts/FareComparison.vue";

const loading = ref(true);
const totalCounts = ref({
  todas: 0,
  drivers: 0,
  users: 0,
  trips: 0,
  admins: 0,
  reports: 0,
});

const fetchCounts = async () => {
  loading.value = true;
  try {
    const [todasRes, driversRes, usersRes, tripsRes, adminsRes, reportsRes] =
      await Promise.all([
        $fetch("/api/toda/count"),
        $fetch("/api/driver/count"),
        $fetch("/api/user/count"),
        $fetch("/api/trip/count"),
        $fetch("/api/toda/count_admin"),
        $fetch("/api/report/count"),
      ]);

    totalCounts.value = {
      todas: todasRes.count || 0,
      drivers: driversRes.count || 0,
      users: usersRes.count || 0,
      trips: tripsRes.count || 0,
      admins: adminsRes.count || 0,
      reports: reportsRes.count || 0,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard counts:", error);
  } finally {
    loading.value = false;
  }
};

defineExpose({
  refresh: fetchCounts,
});

onMounted(() => {
  fetchCounts();
});
</script>
