<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <!-- HEADER -->
        <thead
          class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          <tr>
            <th class="px-6 py-4 text-left font-semibold">Driver Name</th>
            <th class="px-6 py-4 text-left font-semibold">Plate Number</th>
            <th class="px-6 py-4 text-left font-semibold">Contact No.</th>
            <th class="px-6 py-4 text-left font-semibold">Status</th>
            <th class="px-6 py-4 text-center font-semibold">Action</th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody>
          <!-- EMPTY STATE -->
          <tr v-if="drivers.length === 0">
            <td colspan="5" class="text-center py-12 text-gray-400">
              No tricycles available.
            </td>
          </tr>

          <!-- DATA ROWS -->
          <tr
            v-for="driver in drivers"
            :key="driver.id"
            class="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
          >
            <!-- NAME -->
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <span class="font-semibold">
                  {{ driver.first_name }} {{ driver.last_name }}
                </span>

                <span class="text-xs text-blue-600 font-medium">
                  {{ driver.toda_name || "No TODA Assigned" }}
                </span>
              </div>
            </td>

            <!-- PLATE -->
            <td class="px-6 py-4">
              {{ driver.plate_number }}
            </td>

            <!-- CONTACT -->
            <td class="px-6 py-4 text-gray-500">
              {{ driver.contact_number }}
            </td>

            <!-- STATUS -->
            <td class="px-6 py-4">
              <span
                class="px-3 py-1 text-xs font-semibold rounded-full"
                :class="
                  driver.is_registered
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
              >
                {{ driver.is_registered ? "Registered" : "Unregistered" }}
              </span>
            </td>

            <!-- ACTION -->
            <td class="px-6 py-4 text-center">
              <button
                class="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
                @click="openProfile(driver)"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- PROFILE MODAL -->
  <TricycleProfileCard
    :show="showProfile"
    :driver="selectedDriver"
    @close="closeProfile"
  />
</template>

<script setup>
import { ref } from "vue";
import TricycleProfileCard from "~/components/profile/TricycleProfileCard.vue";

/* ======================
   PROPS
====================== */
defineProps({
  drivers: {
    type: Array,
    required: true,
  },
});

/* ======================
   MODAL STATE
====================== */
const selectedDriver = ref(null);
const showProfile = ref(false);

/* ======================
   FUNCTIONS
====================== */
const openProfile = (driver) => {
  selectedDriver.value = driver;
  showProfile.value = true;
};

const closeProfile = () => {
  showProfile.value = false;
  selectedDriver.value = null;
};
</script>
