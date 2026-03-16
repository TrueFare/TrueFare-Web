<template>
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in"
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          Top Performing Drivers
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">By Revenue (₱)</p>
      </div>

      <!-- Toggle Buttons and Dropdown -->
      <div class="flex flex-col sm:flex-row gap-3 items-center">
        <!-- TODA Dropdown for Super Admin -->
        <div v-if="user?.role === 'super_admin'" class="form-control">
          <select
            v-model="selectedTodaId"
            class="select select-bordered select-sm w-full max-w-xs focus:ring-secondary focus:border-secondary"
          >
            <option disabled value="">Select TODA</option>
            <option v-for="toda in todas" :key="toda.id" :value="toda.id">
              {{ toda.name }}
            </option>
          </select>
        </div>

        <!-- Toggle Buttons (Daisy UI Join) -->
        <div class="join border border-gray-200 dark:border-gray-600">
          <button
            v-for="option in ['daily', 'weekly', 'monthly']"
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
import { useAuth } from "~/composables/useAuth";
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

const { user } = useAuth();
const chartRef = ref(null);
const selectedRange = ref("monthly");
const selectedTodaId = ref(null);
const todas = ref([]);
const loading = ref(true);
let chartInstance = null;

const fetchTodas = async () => {
  if (user.value?.role !== "super_admin") return;
  try {
    const res = await $fetch("/api/toda/search");
    todas.value = res.results;

    // Determine highest earning TODA for default
    const revenueRes = await $fetch("/api/analytics/toda-revenue", {
      query: { range: "monthly" },
    });

    if (revenueRes.ids && revenueRes.ids.length > 0) {
      selectedTodaId.value = revenueRes.ids[0];
    } else if (todas.value.length > 0) {
      selectedTodaId.value = todas.value[0].id;
    }
  } catch (error) {
    console.error("Failed to fetch TODAs or revenue data:", error);
  }
};

const fetchChartData = async () => {
  const todaId =
    user.value?.role === "super_admin"
      ? selectedTodaId.value
      : user.value?.toda_id;
  if (!todaId) return { labels: [], data: [] };

  loading.value = true;
  try {
    const res = await $fetch("/api/analytics/top-drivers", {
      query: {
        range: selectedRange.value,
        toda_id: todaId,
      },
    });
    return res;
  } catch (error) {
    console.error("Failed to fetch top drivers data:", error);
    return { labels: [], data: [] };
  } finally {
    loading.value = false;
  }
};

const renderChart = async () => {
  const { labels, data } = await fetchChartData();

  await nextTick();
  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext("2d");

  // Create Purple Gradient for Hover
  const hoverGradient = ctx.createLinearGradient(0, 0, 0, 400);
  hoverGradient.addColorStop(0, "rgba(217, 70, 239, 0.9)"); // Fuchsia-500/Secondary
  hoverGradient.addColorStop(1, "rgba(168, 85, 247, 0.4)"); // Purple-500

  if (chartInstance) {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;
    chartInstance.update();
    return;
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Revenue (₱)",
          data,
          backgroundColor: "rgba(107, 114, 128, 0.5)", // Gray-500 plain
          borderColor: "rgba(168, 85, 247, 0.5)",
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: hoverGradient,
          hoverBorderColor: "rgba(168, 85, 247, 1)",
          hoverBorderWidth: 2,
        },
      ],
    },
    options: {
      indexAxis: "y", // Horizontal bars for names
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
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
              if (context.parsed.x !== null) {
                label += new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(context.parsed.x);
              }
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "₱" + value.toLocaleString();
            },
          },
        },
      },
    },
  });
};

onMounted(async () => {
  if (user.value?.role === "super_admin") {
    await fetchTodas();
  }
  renderChart();
});

watch([selectedRange, selectedTodaId], () => renderChart());

defineExpose({
  refresh: renderChart,
});
</script>

<style scoped>
canvas {
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
</style>
