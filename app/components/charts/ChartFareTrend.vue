<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4"
    >
      <h2 class="text-lg font-semibold">Fare Trend</h2>

      <!-- Toggle Buttons -->
      <div class="flex flex-col sm:flex-row gap-2">
        <button
          v-for="option in ['weekly', 'monthly', 'yearly']"
          :key="option"
          @click="selectedRange = option"
          :class="[
            'px-3 py-1 rounded-lg text-sm font-medium transition',
            selectedRange === option
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
          ]"
        >
          {{ option.charAt(0).toUpperCase() + option.slice(1) }}
        </button>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="w-full h-64 sm:h-72 md:h-80 lg:h-96">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
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
  Legend
);

const chartRef = ref(null);
const selectedRange = ref("monthly");
let chartInstance = null;

const fetchChartData = async () => {
  const res = await $fetch("/api/analytics/fare-trend", {
    query: { range: selectedRange.value },
  });

  return res;
};

const renderChart = async () => {
  await nextTick(); // ⭐ wait for DOM render

  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext("2d");

  const { labels, data } = await fetchChartData();

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Trips",
          data,
          tension: 0.4,
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

onMounted(() => renderChart());

watch(selectedRange, () => renderChart());
</script>