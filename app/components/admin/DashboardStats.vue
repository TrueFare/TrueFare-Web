<template>
  <div class="space-y-10">
    <!-- Statistic Cards -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    >
      <DashboardCard
        title="Total Revenue"
        :value="loading ? '...' : formatCurrency(totalCounts.revenue)"
        icon="mdi:cash-multiple"
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
        :subText="loading ? '...' : `${totalCounts.pendingReports} pending`"
      />
      <DashboardCard
        title="TODA Admins"
        :value="loading ? '...' : totalCounts.admins"
        icon="mdi:account-group"
        bgColor="bg-purple-900 text-white"
        textColor="text-purple-400"
      />
    </div>

    <!-- Charts Container -->
    <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-inner">
      <h2 class="text-xl font-semibold mb-6">Analytics Overview</h2>

      <!-- Fare Comparison -->
      <div class="mb-6">
        <FareComparison />
      </div>

      <!-- Top Performing Drivers Chart -->
      <div class="mb-6">
        <ChartTopTodaDriver />
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
import { useAuth } from "~/composables/useAuth";
import DashboardCard from "~/components/cards/DashboardCard.vue";
import ChartFareTrend from "~/components/charts/ChartTripNumber.vue";
import ChartFarePriceTrend from "~/components/charts/ChartFarePriceTrend.vue";
import ChartTopTodaDriver from "~/components/charts/ChartTopTodaDriver.vue";
import FareComparison from "~/components/charts/FareComparison.vue";

const { user } = useAuth();
const loading = ref(true);
const totalCounts = ref({
  revenue: 0,
  drivers: 0,
  trips: 0,
  reports: 0,
  pendingReports: 0,
  admins: 0,
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
};

const fetchCounts = async () => {
  const todaId = user.value?.toda_id;
  if (!todaId) return;

  loading.value = true;
  try {
    const [revenueRes, driversRes, tripsRes, reportsRes, adminsRes] =
      await Promise.all([
        $fetch(`/api/toda/revenue/${todaId}`),
        $fetch(`/api/driver/count/toda/${todaId}`),
        $fetch(`/api/trip/count/toda/${todaId}/all-time`),
        $fetch(`/api/report/count/toda/${todaId}`),
        $fetch(`/api/toda/count_admin/${todaId}`),
      ]);

    totalCounts.value = {
      revenue: revenueRes.total || 0,
      drivers: driversRes.count || 0,
      trips: tripsRes.count || 0,
      reports: reportsRes.total || 0,
      pendingReports: reportsRes.pending || 0,
      admins: adminsRes.count || 0,
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
