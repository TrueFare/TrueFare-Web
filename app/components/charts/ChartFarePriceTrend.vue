<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
    <h2 class="text-lg font-semibold mb-4">Historical Fare Trend</h2>
    <div class="w-full h-64 sm:h-72 md:h-80 lg:h-96">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

const chartRef = ref(null);
let chartInstance = null;

const fetchFareHistory = async () => {
  try {
    const res = await $fetch("/api/fare");
    // Sort by date_created ascending
    const sorted = (res.results || []).sort(
      (a, b) => new Date(a.date_created) - new Date(b.date_created),
    );
    return sorted;
  } catch (e) {
    console.error("Failed to fetch fare history", e);
    return [];
  }
};

const renderChart = async () => {
  await nextTick();
  if (!chartRef.value) return;

  const data = await fetchFareHistory();
  if (data.length === 0) return;

  const ctx = chartRef.value.getContext("2d");
  const labels = data.map((f) => new Date(f.date_created).toLocaleDateString());
  const baseFares = data.map((f) => f.base_fare);
  const farePerKms = data.map((f) => f.fare_per_km);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Base Fare (₱)",
          data: baseFares,
          borderColor: "#4F46E5",
          backgroundColor: "#4F46E5",
          tension: 0.1,
          pointRadius: 4,
        },
        {
          label: "Fare per km (₱)",
          data: farePerKms,
          borderColor: "#10B981",
          backgroundColor: "#10B981",
          tension: 0.1,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
};

onMounted(() => renderChart());

defineExpose({
  refresh: renderChart,
});
</script>
