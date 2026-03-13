<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center p-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else>
      <!-- DESKTOP TABLE -->
      <div
        class="hidden sm:block bg-base-100 rounded-2xl shadow border border-base-200 overflow-x-auto"
      >
        <table class="table table-zebra w-full">
          <!-- TABLE HEADER -->
          <thead class="bg-base-200 text-base-content/70">
            <tr class="border-none uppercase text-[10px] tracking-widest font-black">
              <th class="px-6 py-4">Driver Name</th>
              <th class="px-6 py-4">Plate Number</th>
              <th class="px-6 py-4">Contact No.</th>
              <th class="px-6 py-4 text-center">Status</th>
              <th class="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="drivers.length === 0">
              <td colspan="5" class="text-center py-12 text-base-content/30 italic font-medium">
                No tricycles available.
              </td>
            </tr>

            <tr
              v-for="driver in drivers"
              :key="driver.id"
              @click="openProfile(driver)"
              class="cursor-pointer transition duration-150 hover:bg-base-200/50 border-base-200"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-black text-sm">
                    {{ driver.first_name[0] }}{{ driver.last_name[0] }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-base-content">{{ driver.first_name }} {{ driver.last_name }}</span>
                    <span class="text-[10px] uppercase font-bold text-primary">{{ driver.toda_name || "No TODA Assigned" }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 font-black text-sm">{{ driver.plate_number }}</td>
              <td class="px-6 py-4 text-xs font-medium text-base-content/60">{{ driver.contact_number }}</td>
              <td class="px-6 py-4 text-center">
                <div
                  class="badge badge-sm font-bold uppercase text-[9px] tracking-widest py-3 px-2"
                  :class="driver.is_registered ? 'badge-success' : 'badge-ghost opacity-50'"
                >
                  {{ driver.is_registered ? "Registered" : "Unregistered" }}
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <button
                  class="btn btn-ghost btn-xs text-primary font-black uppercase tracking-widest"
                  @click.stop="openProfile(driver)"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- MOBILE CARDS -->
      <div class="sm:hidden flex flex-col gap-4">
        <div
          v-for="driver in drivers"
          :key="driver.id"
          class="card bg-base-100 shadow-md p-5 border border-base-200"
          @click="openProfile(driver)"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-black text-sm">
                {{ driver.first_name[0] }}{{ driver.last_name[0] }}
              </div>
              <div>
                <p class="font-bold text-base-content leading-tight">
                  {{ driver.first_name }} {{ driver.last_name }}
                </p>
                <p class="text-[10px] uppercase font-bold text-primary">
                  {{ driver.toda_name || "No TODA Assigned" }}
                </p>
              </div>
            </div>
            <div
              class="badge badge-sm font-bold uppercase text-[8px] tracking-widest"
              :class="driver.is_registered ? 'badge-success' : 'badge-ghost opacity-50'"
            >
              {{ driver.is_registered ? "Registered" : "Unregistered" }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 border-t border-base-content/5 pt-4">
            <div>
              <p class="text-[9px] font-black uppercase tracking-widest text-base-content/40 mb-0.5">Plate Number</p>
              <p class="font-bold text-sm">{{ driver.plate_number }}</p>
            </div>
            <div>
              <p class="text-[9px] font-black uppercase tracking-widest text-base-content/40 mb-0.5">Contact</p>
              <p class="font-bold text-sm">{{ driver.contact_number }}</p>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-if="drivers.length === 0" class="flex flex-col items-center justify-center py-12 gap-3 text-base-content/30">
          <Icon name="mdi:motorbike-off" class="text-5xl" />
          <p class="text-sm font-bold uppercase tracking-widest">No tricycles available.</p>
        </div>
      </div>
    </div>

    <!-- DRIVER PROFILE MODAL -->
    <ClientOnly>
      <TricycleProfileCard
        :show="showProfile"
        :driver="selectedDriver"
        @close="closeProfile"
        @updated="refreshDrivers"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TricycleProfileCard from "~/components/profile/TricycleProfileCard.vue";

defineProps({
  drivers: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const selectedDriver = ref(null);
const showProfile = ref(false);

const openProfile = (driver) => {
  selectedDriver.value = driver;
  showProfile.value = true;
};

const closeProfile = () => {
  showProfile.value = false;
  selectedDriver.value = null;
};

const emit = defineEmits(["refresh"]);
const refreshDrivers = () => {
  emit("refresh");
};
</script>
