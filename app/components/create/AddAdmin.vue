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
        class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex items-center gap-6"
      >
        <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 shrink-0">
          <Icon name="mdi:account-plus" class="text-3xl text-white" />
        </div>
        <div>
          <h2 class="text-2xl font-black uppercase tracking-tight">Add New Admin</h2>
          <p class="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Register a TODA administrator</p>
        </div>
      </div>

      <!-- BODY -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">First Name</span></label>
          <input
            v-model="form.first_name"
            class="input input-bordered w-full focus:input-primary"
            placeholder="Enter first name"
          />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Last Name</span></label>
          <input v-model="form.last_name" class="input input-bordered w-full focus:input-primary" placeholder="Enter last name" />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Email Address</span></label>
          <input
            v-model="form.email"
            type="email"
            class="input input-bordered w-full focus:input-primary"
            placeholder="email@example.com"
          />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Account Password</span></label>
          <input
            v-model="form.password"
            type="password"
            class="input input-bordered w-full focus:input-primary"
            placeholder="Set password"
          />
        </div>

        <div class="form-control md:col-span-2">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Assign to TODA</span></label>

          <select v-model="form.toda_id" class="select select-bordered w-full focus:select-primary">
            <option disabled value="">Select association</option>

            <option v-for="toda in todas" :key="toda.id" :value="toda.id">
              {{ toda.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="border-t border-base-content/5 p-5 flex justify-end gap-3 bg-base-200/30">
        <button class="btn btn-outline border-2 px-8" @click="resetForm" :disabled="loading">
          Clear
        </button>

        <button
          class="btn btn-primary px-8 gap-2"
          :disabled="loading"
          @click="createAdmin"
        >
          <span
            v-if="loading"
            class="loading loading-spinner loading-sm"
          ></span>
          <Icon v-else name="mdi:plus-circle" class="text-lg" />
          Create Admin
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
