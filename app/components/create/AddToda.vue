<template>
  <div
    v-if="show"
    class="fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto relative"
    >
      <!-- CLOSE -->
      <button
        class="absolute right-4 top-4 btn btn-sm btn-circle z-10"
        @click="closeModal"
      >
        ✕
      </button>

      <!-- HEADER -->
      <div
        class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center gap-6"
      >
        <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 shrink-0">
          <Icon name="mdi:office-building-plus" class="text-3xl text-white" />
        </div>
        <div>
          <h2 class="text-2xl font-black uppercase tracking-tight">Add New TODA</h2>
          <p class="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Register a transport organization</p>
        </div>
      </div>

      <!-- BODY -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">TODA Name</span></label>
          <input v-model="form.name" class="input input-bordered w-full focus:input-primary" placeholder="Enter TODA name" />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Admin Password</span></label>
          <input
            v-model="form.password"
            type="password"
            class="input input-bordered w-full focus:input-primary"
            placeholder="Set TODA password"
          />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Barangay</span></label>
          <input v-model="form.barangay" class="input input-bordered w-full focus:input-primary" placeholder="Enter barangay" />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">City</span></label>
          <input v-model="form.city" class="input input-bordered w-full focus:input-primary" placeholder="Enter city" />
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="border-t border-base-content/5 p-5 flex justify-end gap-3 bg-base-200/30">
        <button class="btn btn-outline border-2 px-8" @click="resetForm" :disabled="loading">
          Clear
        </button>

        <button class="btn btn-primary px-8 gap-2" :disabled="loading" @click="createToda">
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          <Icon v-else name="mdi:plus-circle" class="text-lg" />
          Create TODA
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onUnmounted } from "vue";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close", "created"]);

const loading = ref(false);

const form = reactive({
  name: "",
  password: "",
  barangay: "",
  city: "",
});

/* LOCK SCROLL */
watch(
  () => props.show,
  (visible) => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = visible ? "hidden" : "";
      document.documentElement.style.overflow = visible ? "hidden" : "";
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }
});

/* CREATE TODA */
const createToda = async () => {
  try {
    loading.value = true;

    await $fetch("/api/toda", {
      method: "POST",
      body: form,
    });

    emit("created");
    closeModal();
  } catch (err) {
    alert(err.statusMessage || "Failed to create TODA");
  } finally {
    loading.value = false;
  }
};

/* RESET */
const resetForm = () => {
  Object.assign(form, {
    name: "",
    password: "",
    barangay: "",
    city: "",
  });
};

/* CLOSE */
const closeModal = () => {
  resetForm();
  emit("close");
};
</script>
