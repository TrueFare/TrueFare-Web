<template>
  <!-- BACKDROP -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <!-- MODAL -->
    <div
      class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-fadeIn"
    >
      <!-- CLOSE -->
      <button
        class="absolute right-4 top-4 btn btn-sm btn-circle"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- ================= HEADER ================= -->
      <div
        class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center gap-5"
      >
        <!-- PROFILE IMAGE -->
        <div
          class="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg"
        >
          <img
            v-if="driver?.profile_pic"
            :src="imageSrc"
            class="w-full h-full object-cover"
          />

          <!-- FALLBACK -->
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-3xl font-bold"
          >
            {{ driver?.first_name?.charAt(0) }}
          </div>
        </div>

        <!-- BASIC INFO -->
        <div>
          <h2 class="text-2xl font-bold">
            {{ driver.first_name }} {{ driver.last_name }}
          </h2>

          <p class="opacity-90">Plate: {{ driver.plate_number }}</p>

          <span
            class="badge mt-2"
            :class="driver.is_registered ? 'badge-success' : 'badge-error'"
          >
            {{ driver.is_registered ? "Registered" : "Unregistered" }}
          </span>
        </div>
      </div>

      <!-- ================= BODY ================= -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <p class="text-gray-400">Email</p>
          <p class="font-semibold">
            {{ driver.email || "N/A" }}
          </p>
        </div>

        <div>
          <p class="text-gray-400">Contact Number</p>
          <p class="font-semibold">
            {{ driver.contact_number }}
          </p>
        </div>

        <div>
          <p class="text-gray-400">Franchise Number</p>
          <p class="font-semibold">
            {{ driver.franchise_number }}
          </p>
        </div>

        <div>
          <p class="text-gray-400">TODA ID</p>
          <p class="font-semibold">
            {{ driver.toda_name }}
          </p>
        </div>

        <div class="md:col-span-2">
          <p class="text-gray-400">Date Created</p>
          <p class="font-semibold">
            {{ driver.date_created }}
          </p>
        </div>
      </div>

      <!-- ================= ACTIONS ================= -->
      <div class="border-t dark:border-gray-700 p-5 flex justify-end gap-3">
        <button class="btn btn-outline">Edit</button>

        <button class="btn btn-error">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  show: Boolean,
  driver: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(["close"]);

/*
  Convert BLOB → image
  Cloudflare D1 usually returns ArrayBuffer/Base64
*/
const imageSrc = computed(() => {
  if (!props.driver?.profile_pic) return null;

  return `data:image/jpeg;base64,${props.driver.profile_pic}`;
});
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
