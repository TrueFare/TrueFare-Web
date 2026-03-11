<template>
  <div
    class="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-200"
  >
    <div class="card-body p-6 space-y-4">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Icon name="mdi:office-building" class="text-lg text-purple-600" />
            </div>
            <h3 class="card-title text-lg font-bold line-clamp-1">
              {{ name }}
            </h3>
            <button
              @click="$emit('edit', id)"
              class="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-blue-500"
              title="Edit TODA"
            >
              <Icon name="mdi:pencil" />
            </button>
          </div>
          <p class="text-xs text-base-content/60 flex items-center gap-1">
            <Icon name="mdi:map-marker" />
            {{ barangay }}, {{ city }}
          </p>
        </div>

        <!-- TODA ADMIN COUNT -->
        <button
          @click="viewAdmins"
          class="badge badge-lg gap-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 border-none hover:bg-purple-200 dark:hover:bg-purple-800 transition py-4 px-3"
          title="View TODA Admins"
        >
          <Icon name="mdi:account-tie" class="text-base" />
          <span class="font-bold">{{ adminCount }}</span>
        </button>
      </div>

      <!-- Drivers Count -->
      <div
        @click="viewDrivers"
        class="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition group"
        title="View TODA Drivers"
      >
        <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
          <Icon name="mdi:motorbike" class="text-lg" />
          Drivers
        </div>
        <div class="flex items-center gap-2 text-lg font-black text-blue-700 dark:text-blue-300">
          {{ driverCount }}
          <Icon name="mdi:chevron-right" class="text-base-content/20 group-hover:text-blue-600 transition" />
        </div>
      </div>

      <!-- Trip Stats -->
      <div class="grid grid-cols-2 gap-3 text-xs">
        <!-- Daily -->
        <div class="flex items-center justify-between bg-base-200/50 p-2.5 rounded-lg border border-base-content/5">
          <div class="flex items-center gap-1 text-base-content/50 font-medium">
            <Icon name="mdi:calendar-today" />
            Today
          </div>
          <span class="font-bold">{{ dailyTrips }}</span>
        </div>

        <!-- Weekly -->
        <div class="flex items-center justify-between bg-base-200/50 p-2.5 rounded-lg border border-base-content/5">
          <div class="flex items-center gap-1 text-base-content/50 font-medium">
            <Icon name="mdi:calendar-week" />
            Week
          </div>
          <span class="font-bold">{{ weeklyTrips }}</span>
        </div>

        <!-- Monthly -->
        <div class="flex items-center justify-between bg-base-200/50 p-2.5 rounded-lg border border-base-content/5">
          <div class="flex items-center gap-1 text-base-content/50 font-medium">
            <Icon name="mdi:calendar-month" />
            Month
          </div>
          <span class="font-bold">{{ monthlyTrips }}</span>
        </div>

        <!-- All Time -->
        <div class="flex items-center justify-between bg-primary/10 text-primary p-2.5 rounded-lg border border-primary/10">
          <div class="flex items-center gap-1 font-bold">
            <Icon name="mdi:chart-line-variant" />
            All Time
          </div>
          <span class="font-black">{{ allTimeTrips }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center gap-2 text-[10px] text-base-content/30 font-bold uppercase tracking-widest pt-2 border-t border-base-content/5">
        <Icon name="mdi:clock-outline" />
        <span>Created: {{ formatDate(date_created) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  id: Number,
  name: String,
  barangay: String,
  city: String,
  date_created: String,
});

const emit = defineEmits(["view-admins", "view-drivers", "edit"]);

const adminCount = ref(0);
const driverCount = ref(0);
const dailyTrips = ref(0);
const weeklyTrips = ref(0);
const monthlyTrips = ref(0);
const allTimeTrips = ref(0);

const fetchStats = async () => {
  try {
    const id = props.id;

    const [drivers, admins, daily, weekly, monthly, allTime] =
      await Promise.all([
        $fetch(`/api/driver/count/toda/${id}`),
        $fetch(`/api/toda/count_admin/${id}`),
        $fetch(`/api/trip/count/toda/${id}/daily`),
        $fetch(`/api/trip/count/toda/${id}/weekly`),
        $fetch(`/api/trip/count/toda/${id}/monthly`),
        $fetch(`/api/trip/count/toda/${id}/all-time`),
      ]);

    driverCount.value = drivers.count;
    adminCount.value = admins.count;
    dailyTrips.value = daily.count;
    weeklyTrips.value = weekly.count;
    monthlyTrips.value = monthly.count;
    allTimeTrips.value = allTime.count;
  } catch (err) {
    console.error("Failed to fetch TODA stats:", err);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
};

const viewAdmins = () => {
  emit("view-admins", props.id);
};

const viewDrivers = () => {
  emit("view-drivers", props.id);
};

onMounted(fetchStats);
</script>
