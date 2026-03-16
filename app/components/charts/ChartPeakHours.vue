<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
        Peak Trip Hours
      </h2>
      <div class="text-xs text-gray-500">
        Trips per hour of the day
      </div>
    </div>

    <div v-if="loading" class="flex justify-center p-10">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else class="w-full h-64 sm:h-72 md:h-80 lg:h-96">
      <canvas ref="chartRef"></canvas>
    </div>

    <div v-if="!loading && totalTrips === 0" class="text-center py-4 text-gray-500 italic">
      No trip data available yet
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

const chartRef = ref(null);
const loading = ref(true);
const totalTrips = ref(0);
let chartInstance = null;

const fetchPeakHoursData = async () => {
  try {
    const res = await $fetch("/api/analytics/peak-hours");
    totalTrips.value = res.data.reduce((acc, curr) => acc + curr, 0);
    return res;
  } catch (error) {
    console.error("Failed to fetch peak hours data:", error);
    return { labels: [], data: [] };
  }
};

const renderChart = async () => {
  loading.value = true;
  const { labels, data } = await fetchPeakHoursData();
  loading.value = false;

  await nextTick();

  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext("2d");
  
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Number of Trips",
          data,
          backgroundColor: "rgba(147, 51, 234, 0.6)", // purple-600 with transparency
          borderColor: "rgb(147, 51, 234)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `Trips: ${context.parsed.y}`;
            },
          },
        },
      },
    },
  });
};

onMounted(() => {
  renderChart();
});
</script>
