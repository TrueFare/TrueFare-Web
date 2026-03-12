<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold mb-4">Fare Management</h2>

    <!-- Trend Chart -->
    <ChartFarePriceTrend ref="chartRef" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Historical Fares Table -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col h-[500px]">
        <div class="flex justify-between items-center mb-4 shrink-0">
          <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Fare History</h3>
          <button
            class="btn btn-sm btn-outline btn-secondary"
            :disabled="!historicalFares.length"
            @click="exportToCsv('Fare_History', historicalFares)"
          >
            <Icon name="mdi:file-export" class="mr-2" />
            Export to CSV
          </button>
        </div>

        <div v-if="historyLoading" class="flex-1 flex items-center justify-center">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <div v-else class="flex-1 overflow-auto">
          <table class="w-full text-sm text-left border-separate border-spacing-0">
            <thead class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3 border-b dark:border-gray-600">Base Km</th>
                <th class="px-4 py-3 border-b dark:border-gray-600">Base Fare (₱)</th>
                <th class="px-4 py-3 border-b dark:border-gray-600">Fare / km (₱)</th>
                <th class="px-4 py-3 border-b dark:border-gray-600">Effective Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fare in historicalFares" :key="fare.id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td class="px-4 py-3 border-b dark:border-gray-700">{{ fare.base_km }} km</td>
                <td class="px-4 py-3 border-b dark:border-gray-700">₱{{ fare.base_fare }}</td>
                <td class="px-4 py-3 border-b dark:border-gray-700">₱{{ fare.fare_per_km }}</td>
                <td class="px-4 py-3 border-b dark:border-gray-700 text-gray-500 text-xs">{{ formatDate(fare.date_created) }}</td>
              </tr>
              <tr v-if="historicalFares.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-gray-400 italic">No fare history found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="shrink-0 pt-4">
          <Pagination
            v-model:page="farePage"
            :total-items="totalFares"
            :per-page="perFarePage"
          />
        </div>
      </div>

      <!-- Add New Fare Form -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Set New Fare</h3>
        <form @submit.prevent="submitFare" class="space-y-4">
          <div class="form-control">
            <label class="label"><span class="label-text">Base Distance (km)</span></label>
            <input v-model="form.base_km" type="number" step="0.1" class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Base Fare (₱)</span></label>
            <input v-model="form.base_fare" type="number" step="0.5" class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Fare Per Additional km (₱)</span></label>
            <input v-model="form.fare_per_km" type="number" step="0.1" class="input input-bordered" required />
          </div>
          <button type="submit" class="btn btn-primary w-full mt-4" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner"></span>
            Update Fare Structure
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import ChartFarePriceTrend from "~/components/charts/ChartFarePriceTrend.vue";
import Pagination from "~/components/Pagination.vue";

const { exportToCsv } = useCsvExport();
const historicalFares = ref([]);
const totalFares = ref(0);
const farePage = ref(1);
const perFarePage = 10; // Increased limit for scrollable table

const chartRef = ref(null);
const loading = ref(false);
const historyLoading = ref(false);

const form = ref({
  base_km: 1.0,
  base_fare: 15,
  fare_per_km: 2
});

const fetchFares = async () => {
  historyLoading.value = true;
  try {
    const res = await $fetch("/api/fare", {
      params: {
        page: farePage.value,
        limit: perFarePage
      }
    });
    // API already returns sorted by date_created DESC in the updated version
    historicalFares.value = res.results || [];
    totalFares.value = res.total || 0;
    
    // Default form values based on latest if exists (only on first page load or first item)
    if (historicalFares.value.length > 0 && farePage.value === 1) {
      const latest = historicalFares.value[0];
      form.value.base_km = latest.base_km;
      form.value.base_fare = latest.base_fare;
      form.value.fare_per_km = latest.fare_per_km;
    }
  } catch (e) {
    console.error("Failed to fetch fares", e);
  } finally {
    historyLoading.value = false;
  }
};

watch(farePage, () => {
  fetchFares();
});

const submitFare = async () => {
  if (loading.value) return;
  
  if (!confirm("Are you sure you want to update the fare structure? This will affect all new trips.")) return;

  loading.value = true;
  try {
    await $fetch("/api/fare", {
      method: "POST",
      body: form.value
    });
    alert("Fare structure updated successfully!");
    farePage.value = 1;
    await fetchFares();
    if (chartRef.value) chartRef.value.refresh();
  } catch (err) {
    console.error(err);
    alert(err.statusMessage || "Failed to update fare");
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  return d.toLocaleString('en-PH', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

onMounted(() => {
  fetchFares();
});
</script>
