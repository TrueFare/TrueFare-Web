<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="card bg-base-100 rounded-3xl w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[80vh] overflow-hidden border border-base-content/10"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center justify-between">
        <h2 class="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
          <Icon name="mdi:motorbike" class="text-2xl" />
          TODA Drivers
        </h2>

        <button
          @click="$emit('close')"
          class="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20"
        >
          <Icon name="mdi:close" class="text-xl" />
        </button>
      </div>

      <!-- Search -->
      <div class="p-6 border-b border-base-200 bg-base-200/30">
        <div class="relative">
          <Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 text-xl" />
          <input
            v-model="search"
            type="text"
            placeholder="Search drivers by name or plate..."
            class="input input-bordered w-full pl-12 pr-12 rounded-2xl focus:input-primary"
          />

          <!-- Clear button -->
          <button
            v-if="search"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
          >
            <Icon name="mdi:close-circle" class="text-lg text-base-content/40" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6 flex-1 overflow-y-auto">

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-3 text-base-content/40">
          <Icon name="mdi:loading" class="text-4xl animate-spin" />
          <p class="text-xs font-bold uppercase tracking-widest">Loading drivers...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="drivers.length === 0" class="flex flex-col items-center justify-center py-12 gap-3 text-base-content/30">
          <Icon name="mdi:account-search-outline" class="text-5xl" />
          <p class="text-sm font-bold">No drivers found</p>
        </div>

        <!-- Drivers -->
        <div v-else class="space-y-3">
          <div
            v-for="driver in drivers"
            :key="driver.id"
            class="flex items-center justify-between bg-base-200/50 p-4 rounded-2xl border border-base-content/5 hover:bg-base-200 transition"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-black text-lg">
                {{ driver.first_name[0] }}{{ driver.last_name[0] }}
              </div>
              <div>
                <p class="font-bold text-base-content">
                  {{ driver.first_name }} {{ driver.last_name }}
                </p>
                <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-base-content/50 flex items-center gap-1">
                    <Icon name="mdi:car-plate" />
                    {{ driver.plate_number }}
                  </p>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-base-content/50 flex items-center gap-1">
                    <Icon name="mdi:phone" />
                    {{ driver.contact_number }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="badge badge-sm font-bold uppercase text-[9px] tracking-widest py-3 px-2"
              :class="driver.is_registered
                ? 'badge-success'
                : 'badge-ghost opacity-50'"
            >
              {{ driver.is_registered ? "Registered" : "Unregistered" }}
            </div>
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
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden"
    }
  } else {
    if (typeof document !== "undefined") {
      document.body.style.overflow = ""
    }
  }
})

// clear search
const clearSearch = () => {
  search.value = ""
  fetchDrivers()
}

// cleanup
onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = ""
  }
})
</script>