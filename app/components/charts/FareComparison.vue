<template>
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
  >
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
        Fare Comparison
      </h2>
      <div v-if="fareData.current" class="text-xs text-gray-500">
        Updated: {{ new Date(fareData.current.date_created).toLocaleString() }}
      </div>
    </div>

    <div v-if="loading" class="flex justify-center p-10">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div
      v-else-if="fareData.current"
      class="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <!-- Base Fare Comparison -->
      <div class="stats shadow bg-gray-50 dark:bg-gray-700">
        <div class="stat">
          <div class="stat-title">Base Fare</div>
          <div class="stat-value text-black dark:text-white">
            ₱{{ fareData.current.base_fare }}
          </div>
          <div class="stat-desc flex items-center gap-1 mt-1">
            <template v-if="fareData.previous">
              <span
                :class="
                  compare(
                    fareData.current.base_fare,
                    fareData.previous.base_fare,
                  ).colorClass
                "
              >
                <Icon
                  :name="
                    compare(
                      fareData.current.base_fare,
                      fareData.previous.base_fare,
                    ).icon
                  "
                />
                ₱{{
                  Math.abs(
                    fareData.current.base_fare - fareData.previous.base_fare,
                  ).toFixed(2)
                }}
              </span>
              from ₱{{ fareData.previous.base_fare }}
            </template>
            <span v-else>No previous data</span>
          </div>
        </div>
      </div>

      <!-- Base KM Comparison -->
      <div class="stats shadow bg-gray-50 dark:bg-gray-700">
        <div class="stat">
          <div class="stat-title">Base Distance</div>
          <div class="stat-value text-black dark:text-white">
            {{ fareData.current.base_km }} km
          </div>
          <div class="stat-desc flex items-center gap-1 mt-1">
            <template v-if="fareData.previous">
              <span
                :class="
                  compare(fareData.current.base_km, fareData.previous.base_km)
                    .colorClass
                "
              >
                <Icon
                  :name="
                    compare(fareData.current.base_km, fareData.previous.base_km)
                      .icon
                  "
                />
                {{
                  Math.abs(fareData.current.base_km - fareData.previous.base_km)
                }}
                km
              </span>
              from {{ fareData.previous.base_km }} km
            </template>
            <span v-else>No previous data</span>
          </div>
        </div>
      </div>

      <!-- Fare per KM Comparison -->
      <div class="stats shadow bg-gray-50 dark:bg-gray-700">
        <div class="stat">
          <div class="stat-title">Fare per KM</div>
          <div class="stat-value text-black dark:text-white">
            ₱{{ fareData.current.fare_per_km }}
          </div>
          <div class="stat-desc flex items-center gap-1 mt-1">
            <template v-if="fareData.previous">
              <span
                :class="
                  compare(
                    fareData.current.fare_per_km,
                    fareData.previous.fare_per_km,
                  ).colorClass
                "
              >
                <Icon
                  :name="
                    compare(
                      fareData.current.fare_per_km,
                      fareData.previous.fare_per_km,
                    ).icon
                  "
                />
                ₱{{
                  Math.abs(
                    fareData.current.fare_per_km -
                      fareData.previous.fare_per_km,
                  ).toFixed(2)
                }}
              </span>
              from ₱{{ fareData.previous.fare_per_km }}
            </template>
            <span v-else>No previous data</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 text-gray-500">
      No fare data available
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const loading = ref(true);
const fareData = ref({
  current: null,
  previous: null,
});

const fetchFareComparison = async () => {
  loading.value = true;
  try {
    const res = await $fetch("/api/fare/comparison");
    fareData.value = res;
  } catch (error) {
    console.error("Failed to fetch fare comparison:", error);
  } finally {
    loading.value = false;
  }
};

const compare = (curr, prev) => {
  if (curr > prev) {
    return {
      icon: "mdi:arrow-up-bold",
      colorClass: "text-red-500 font-bold flex items-center",
    };
  } else if (curr < prev) {
    return {
      icon: "mdi:arrow-down-bold",
      colorClass: "text-green-500 font-bold flex items-center",
    };
  } else {
    return {
      icon: "mdi:minus",
      colorClass: "text-gray-500 font-bold flex items-center",
    };
  }
};

onMounted(() => {
  fetchFareComparison();
});

defineExpose({
  refresh: fetchFareComparison,
});
</script>
