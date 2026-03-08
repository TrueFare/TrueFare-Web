<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
    <h2 class="text-lg font-semibold mb-4">Top TODAs by Drivers</h2>

    <div class="h-80">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { Chart, BarController, BarElement, CategoryScale, LinearScale } from "chart.js"

Chart.register(BarController, BarElement, CategoryScale, LinearScale)

const chartRef = ref(null)
let chartInstance = null

const renderChart = async () => {

  const res = await $fetch("/api/analytics/top-todas")

  const labels = res.results.map(t => t.name)
  const data = res.results.map(t => t.driver_count)

  chartInstance = new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Drivers",
          data
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
}

onMounted(renderChart)
</script>