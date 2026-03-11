<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div class="card bg-base-100 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden border border-base-content/10">

      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
        <h2 class="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
          <Icon name="mdi:account-tie" class="text-2xl" />
          TODA Admins
        </h2>

        <button
          @click="$emit('close')"
          class="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20"
        >
          <Icon name="mdi:close" class="text-xl" />
        </button>
      </div>

      <div class="p-6">
        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-3 text-base-content/40">
          <Icon name="mdi:loading" class="text-4xl animate-spin" />
          <p class="text-xs font-bold uppercase tracking-widest">Loading admins...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="admins.length === 0" class="flex flex-col items-center justify-center py-12 gap-3 text-base-content/30">
          <Icon name="mdi:account-off" class="text-5xl" />
          <p class="text-sm font-bold">No admins found for this TODA</p>
        </div>

        <!-- Admin List -->
        <div v-else class="space-y-3">
          <div
            v-for="admin in admins"
            :key="admin.id"
            class="flex items-center justify-between bg-base-200/50 p-4 rounded-2xl border border-base-content/5 hover:bg-base-200 transition"
          >
            <div>
              <p class="font-bold text-base-content">
                {{ admin.first_name }} {{ admin.last_name }}
              </p>
              <p class="text-xs text-base-content/50 font-medium">
                {{ admin.email }}
              </p>
            </div>

            <div class="text-[10px] font-black uppercase tracking-widest text-base-content/30">
              {{ formatDate(admin.date_created) }}
            </div>
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