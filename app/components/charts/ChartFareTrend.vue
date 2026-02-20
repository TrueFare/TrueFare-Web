<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Fare Trend</h2>

      <!-- Toggle Buttons -->
      <div class="flex gap-2">
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

    <!-- Chart -->
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
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
const selectedRange = ref("monthly");
let chartInstance = null;

/*
  Dummy data for now.
  Later replace with API call depending on selectedRange.
*/
const getChartData = (range) => {
  if (range === "weekly") {
    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [25, 26, 27, 26, 28, 30, 29],
    };
  }

  if (range === "monthly") {
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [25, 27, 26, 29, 30, 32],
    };
  }

  return {
    labels: ["2021", "2022", "2023", "2024", "2025"],
    data: [20, 22, 25, 28, 32],
  };
};

const renderChart = () => {
  const { labels, data } = getChartData(selectedRange.value);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartRef.value, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Average Fare",
          data,
          tension: 0.4,
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
};

onMounted(() => {
  renderChart();
});

watch(selectedRange, () => {
  renderChart();
});
</script>
