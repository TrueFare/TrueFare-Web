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
          <h2 class="text-2xl font-bold">Add New Admin</h2>
          <p class="text-sm opacity-90">Register a new admin account</p>
        </div>
      </div>

      <!-- BODY -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-gray-400 text-sm">First Name</p>
          <input
            v-model="form.first_name"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Last Name</p>
          <input v-model="form.last_name" class="input input-bordered w-full" />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Email</p>
          <input
            v-model="form.email"
            type="email"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Password</p>
          <input
            v-model="form.password"
            type="password"
            class="input input-bordered w-full"
          />
        </div>

        <div class="md:col-span-2">
          <p class="text-gray-400 text-sm">TODA</p>

          <select v-model="form.toda_id" class="select select-bordered w-full">
            <option disabled value="">Select TODA</option>

            <option v-for="toda in todas" :key="toda.id" :value="toda.id">
              {{ toda.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="border-t dark:border-gray-700 p-5 flex justify-end gap-3">
        <button class="btn btn-outline" @click="resetForm" :disabled="loading">
          Clear
        </button>

        <button
          class="btn btn-primary"
          :disabled="loading"
          @click="createAdmin"
        >
          <span
            v-if="loading"
            class="loading loading-spinner loading-sm"
          ></span>
          {{ loading ? "Creating..." : "Create Admin" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close", "created"]);

const loading = ref(false);
const todas = ref([]);

const form = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  toda_id: "",
});

/* LOAD TODAS */
onMounted(async () => {
  try {
    const res = await $fetch("/api/toda");
    todas.value = res.results || [];
  } catch (err) {
    console.error("Failed loading TODAs", err);
  }
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

/* CREATE ADMIN */
const createAdmin = async () => {
  try {
    loading.value = true;

    await $fetch("/api/admin", {
      method: "POST",
      body: form,
    });

    emit("created");
    closeModal();
  } catch (err) {
    alert(err.statusMessage || "Failed to create admin");
  } finally {
    loading.value = false;
  }
};

/* RESET */
const resetForm = () => {
  Object.assign(form, {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    toda_id: "",
  });
};

/* CLOSE */
const closeModal = () => {
  resetForm();
  emit("close");
};
</script>
