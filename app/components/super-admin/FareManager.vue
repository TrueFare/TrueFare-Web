<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold mb-4">Fare Management</h2>

    <!-- Trend Chart -->
    <ChartFarePriceTrend ref="chartRef" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Historical Fares Table -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow p-6 overflow-x-auto">
        <h3 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Fare History</h3>
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
            <tr>
              <th class="px-4 py-3">Base Km</th>
              <th class="px-4 py-3">Base Fare (₱)</th>
              <th class="px-4 py-3">Fare / km (₱)</th>
              <th class="px-4 py-3">Effective Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fare in historicalFares" :key="fare.id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-4 py-3">{{ fare.base_km }} km</td>
              <td class="px-4 py-3">₱{{ fare.base_fare }}</td>
              <td class="px-4 py-3">₱{{ fare.fare_per_km }}</td>
              <td class="px-4 py-3 text-gray-500 text-xs">{{ formatDate(fare.date_created) }}</td>
            </tr>
          </tbody>
        </table>
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
import { ref, onMounted } from "vue";
import ChartFarePriceTrend from "~/components/charts/ChartFarePriceTrend.vue";

const historicalFares = ref([]);
const chartRef = ref(null);
const loading = ref(false);

const form = ref({
  base_km: 1.0,
  base_fare: 15,
  fare_per_km: 2
});

const fetchFares = async () => {
  try {
    const res = await $fetch("/api/fare");
    // Sort by date_created descending for the table
    historicalFares.value = (res.results || []).sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
    
    // Default form values based on latest if exists
    if (historicalFares.value.length > 0) {
      const latest = historicalFares.value[0];
      form.value.base_km = latest.base_km;
      form.value.base_fare = latest.base_fare;
      form.value.fare_per_km = latest.fare_per_km;
    }
  } catch (e) {
    console.error("Failed to fetch fares", e);
  }
};

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
