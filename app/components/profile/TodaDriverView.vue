<template>
  <!-- Backdrop & Modal Wrapper -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden"
  >
    <!-- Modal Container -->
    <div
      class="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl shadow-xl relative flex flex-col max-h-[80vh]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <i class="fa-solid fa-bicycle text-blue-500"></i>
          TODA Drivers
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-red-500"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Body: Scrollable Drivers List -->
      <div class="p-6 flex-1 overflow-y-auto">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-8 text-gray-400">
          Loading drivers...
        </div>

        <!-- Empty -->
        <div v-else-if="drivers.length === 0" class="text-center py-8 text-gray-400">
          No drivers found
        </div>

        <!-- Drivers -->
        <div v-else class="space-y-3">
          <div
            v-for="driver in drivers"
            :key="driver.id"
            class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
          >
            <div>
              <p class="font-semibold">
                {{ driver.first_name }} {{ driver.last_name }}
              </p>
              <p class="text-sm text-gray-500">Plate: {{ driver.plate_number }}</p>
              <p class="text-sm text-gray-500">Contact: {{ driver.contact_number }}</p>
            </div>

            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="driver.is_registered
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-200 text-gray-600'"
            >
              {{ driver.is_registered ? "Registered" : "Unregistered" }}
            </span>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";

const props = defineProps({
  show: Boolean,
  todaId: Number,
});

const drivers = ref([]);
const loading = ref(false);

// Fetch drivers from API
const fetchDrivers = async () => {
  if (!props.todaId) return;
  loading.value = true;

  try {
    const res = await $fetch(`/api/toda/driver/${props.todaId}`);
    drivers.value = res.data || [];
  } catch (err) {
    console.error("Failed to fetch drivers:", err);
  }

  loading.value = false;
};

// Prevent body scroll when modal is open
const disableBodyScroll = () => {
  document.body.style.overflow = "hidden";
};

const enableBodyScroll = () => {
  document.body.style.overflow = "";
};

// Watch for show prop
watch(() => props.show, (val) => {
  if (val) {
    fetchDrivers();
    disableBodyScroll();
  } else {
    enableBodyScroll();
  }
});

// Clean up in case component is destroyed while modal is open
onUnmounted(() => {
  enableBodyScroll();
});
</script>