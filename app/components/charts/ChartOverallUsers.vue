<template>
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
  >
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Overall Users
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Total across all categories
      </p>
    </div>

    <!-- Chart Container -->
    <div class="w-full h-64 sm:h-72 md:h-80 lg:h-96 relative">
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10"
      >
        <span class="loading loading-spinner loading-lg text-secondary"></span>
      </div>
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(PieController, ArcElement, Tooltip, Legend);

const chartRef = ref(null);
const loading = ref(true);
let chartInstance = null;

const fetchChartData = async () => {
  loading.value = true;
  try {
    const res = await $fetch("/api/analytics/overall-users");
    return [
      res.users || 0,
      res.drivers || 0,
      res.admins || 0,
      res.superAdmins || 0,
    ];
  } catch (error) {
    console.error("Failed to fetch overall user data:", error);
    return [0, 0, 0, 0];
  } finally {
    loading.value = false;
  }
};

const renderChart = async () => {
  const data = await fetchChartData();

  await nextTick();
  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext("2d");

  // Define base colors
  const baseColors = [
    "rgba(59, 130, 246, 0.7)", // Blue-500
    "rgba(34, 197, 94, 0.7)", // Green-500
    "rgba(168, 85, 247, 0.7)", // Purple-500
    "rgba(249, 115, 22, 0.7)", // Orange-500
  ];

  const borderColors = [
    "rgba(59, 130, 246, 1)",
    "rgba(34, 197, 94, 1)",
    "rgba(168, 85, 247, 1)",
    "rgba(249, 115, 22, 1)",
  ];

  const hoverColors = [
    "rgba(59, 130, 246, 0.9)",
    "rgba(34, 197, 94, 0.9)",
    "rgba(168, 85, 247, 0.9)",
    "rgba(249, 115, 22, 0.9)",
  ];

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Users", "Drivers", "Admins", "Super Admins"],
      datasets: [
        {
          data: data,
          backgroundColor: baseColors,
          borderColor: borderColors,
          borderWidth: 2,
          hoverBackgroundColor: hoverColors,
          hoverBorderColor: borderColors,
          hoverBorderWidth: 3,
          offset: 10, // Adds distance on hover
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14,
              weight: "bold",
            },
            color: document.documentElement.classList.contains("dark")
              ? "#f3f4f6"
              : "#374151",
          },
        },
        tooltip: {
          padding: 12,
          bodyFont: {
            size: 14,
          },
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return ` ${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
      },
    },
  });
};

onMounted(() => renderChart());

defineExpose({
  refresh: renderChart,
});
</script>

<style scoped>
canvas {
  cursor: pointer;
}
</style>
