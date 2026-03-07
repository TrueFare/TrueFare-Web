<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl p-6 shadow-xl relative">

      <!-- Close -->
      <button
        @click="$emit('close')"
        class="absolute right-4 top-4 text-gray-500 hover:text-red-500"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Title -->
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <i class="fa-solid fa-user-shield text-purple-500"></i>
        TODA Admins
      </h2>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-gray-500 py-6">
        Loading admins...
      </div>

      <!-- Empty -->
      <div v-else-if="admins.length === 0" class="text-center text-gray-400 py-6">
        No admins found for this TODA
      </div>

      <!-- Admin List -->
      <div v-else class="space-y-4">
        <div
          v-for="admin in admins"
          :key="admin.id"
          class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
        >
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ admin.first_name }} {{ admin.last_name }}
            </p>
            <p class="text-sm text-gray-500">
              {{ admin.email }}
            </p>
          </div>

          <div class="text-xs text-gray-400">
            {{ formatDate(admin.date_created) }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: Boolean,
  todaId: Number
});

const emit = defineEmits(["close"]);

const admins = ref([]);
const loading = ref(false);

const fetchAdmins = async () => {
  if (!props.todaId) return;

  loading.value = true;

  try {
    const res = await $fetch(`/api/admin/toda/${props.todaId}`);
    admins.value = res.data || [];
  } catch (err) {
    console.error("Failed to fetch admins:", err);
  }

  loading.value = false;
};

watch(() => props.show, (val) => {
  if (val) fetchAdmins();
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
</script>