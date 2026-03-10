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
        class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center gap-5"
      >
        <div>
          <h2 class="text-2xl font-bold">Add New TODA</h2>
          <p class="text-sm opacity-90">
            Register a new transport organization
          </p>
        </div>
      </div>

      <!-- BODY -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-gray-400 text-sm">TODA Name</p>
          <input v-model="form.name" class="input input-bordered w-full" />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Password</p>
          <input
            v-model="form.password"
            type="password"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Barangay</p>
          <input v-model="form.barangay" class="input input-bordered w-full" />
        </div>

        <div>
          <p class="text-gray-400 text-sm">City</p>
          <input v-model="form.city" class="input input-bordered w-full" />
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="border-t dark:border-gray-700 p-5 flex justify-end gap-3">
        <button class="btn btn-outline" @click="resetForm" :disabled="loading">
          Clear
        </button>

        <button class="btn btn-primary" :disabled="loading" @click="createToda">
          <span
            v-if="loading"
            class="loading loading-spinner loading-sm"
          ></span>
          {{ loading ? "Creating..." : "Create TODA" }}
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
    document.body.style.overflow = visible ? "hidden" : "";
    document.documentElement.style.overflow = visible ? "hidden" : "";
  },
  { immediate: true },
);

onUnmounted(() => {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
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
