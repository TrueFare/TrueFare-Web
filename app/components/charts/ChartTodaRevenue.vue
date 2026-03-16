<template>
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Revenue
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Total Lifetime:
          <span class="font-bold text-purple-600 dark:text-purple-400">
            ₱{{
              totalLifetime.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </span>
        </p>
      </div>

      <!-- Toggle Buttons (Daisy UI Join) -->
      <div class="join border border-gray-200 dark:border-gray-600">
        <button
          v-for="option in ['monthly', 'yearly']"
          :key="option"
          @click="selectedRange = option"
          class="btn btn-sm join-item capitalize"
          :class="
            selectedRange === option
              ? 'btn-primary text-white'
              : 'btn-ghost bg-transparent'
          "
        >
          {{ option }}
        </button>
      </div>
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
import { ref, watch, onMounted, nextTick } from "vue";
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
const selectedRange = ref("monthly");
const totalLifetime = ref(0);
const loading = ref(true);
let chartInstance = null;

const fetchChartData = async () => {
  loading.value = true;
  try {
    const res = await $fetch("/api/analytics/toda-revenue", {
      query: { range: selectedRange.value },
    });
    totalLifetime.value = res.totalLifetime || 0;
    return res;
  } catch (error) {
    console.error("Failed to fetch TODA revenue data:", error);
    return { labels: [], data: [], totalLifetime: 0 };
  } finally {
    loading.value = false;
  }
};

const renderChart = async () => {
  const { labels, data } = await fetchChartData();

  await nextTick();
  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext("2d");

  // Create Gradient for Hover
  const hoverGradient = ctx.createLinearGradient(0, 0, 0, 400);
  hoverGradient.addColorStop(0, "rgba(168, 85, 247, 0.9)"); // purple-500
  hoverGradient.addColorStop(1, "rgba(168, 85, 247, 0.2)"); // purple-500 fade

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Revenue (₱)",
          data,
          backgroundColor: "rgba(107, 114, 128, 0.5)", // Gray-500 plain color
          borderColor: "rgba(107, 114, 128, 0.8)",
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: hoverGradient,
          hoverBorderColor: "rgba(168, 85, 247, 1)",
          hoverBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "₱" + value.toLocaleString();
            },
          },
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const label = labels[index];
          const value = data[index];
          console.log(`Clicked on ${label}: ₱${value}`);
        }
      },
    },
  });
};

onMounted(() => renderChart());

watch(selectedRange, () => renderChart());

defineExpose({
  refresh: renderChart,
});
</script>

<style scoped>
canvas {
  cursor: pointer;
}
</style>
