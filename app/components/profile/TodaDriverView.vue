<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl shadow-xl relative flex flex-col max-h-[80vh]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
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

      <!-- Search -->
      <div class="p-6 border-b">
        <div class="relative">
          <input
            v-model="search"
            type="text"
            placeholder="Search drivers..."
            class="w-full border rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring focus:ring-blue-200"
          />

          <!-- Clear button -->
          <button
            v-if="search"
            @click="clearSearch"
            class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Body -->
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
              <p class="text-sm text-gray-500">
                Plate: {{ driver.plate_number }}
              </p>
              <p class="text-sm text-gray-500">
                Contact: {{ driver.contact_number }}
              </p>
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
import { ref, watch, onUnmounted } from "vue"

const props = defineProps({
  show: Boolean,
  todaId: Number
})

const drivers = ref([])
const loading = ref(false)
const search = ref("")

let debounceTimer = null

// fetch drivers
const fetchDrivers = async () => {
  if (!props.todaId) return

  loading.value = true

  try {
    const res = await $fetch("/api/toda/driver/search", {
      query: {
        toda_id: props.todaId,
        search: search.value
      }
    })

    drivers.value = res.results || res.data || []
  } catch (err) {
    console.error("Failed to fetch drivers:", err)
  }

  loading.value = false
}

// debounce search
watch(search, () => {
  clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    fetchDrivers()
  }, 400)
})

// open modal
watch(() => props.show, (val) => {
  if (val) {
    fetchDrivers()
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = ""
  }
})

// clear search
const clearSearch = () => {
  search.value = ""
  fetchDrivers()
}

// cleanup
onUnmounted(() => {
  document.body.style.overflow = ""
})
</script>