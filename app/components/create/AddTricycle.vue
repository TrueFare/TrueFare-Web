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
        <div
          class="w-24 h-24 rounded-full overflow-hidden border-4 border-white relative shrink-0"
        >
          <img
            v-if="previewImage"
            :src="previewImage"
            class="w-full h-full object-cover"
          />

          <input
            type="file"
            accept="image/*"
            class="absolute inset-0 opacity-0 cursor-pointer"
            @change="handleImageUpload"
          />
        </div>

        <div>
          <h2 class="text-2xl font-bold">Add New Driver</h2>
          <p class="text-sm opacity-90">Register a new tricycle driver</p>
        </div>
      </div>

      <!-- BODY -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-gray-400 text-sm">First Name</p>
          <input
            v-model="newDriver.first_name"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Last Name</p>
          <input
            v-model="newDriver.last_name"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Contact Number</p>
          <input
            v-model="newDriver.contact_number"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Email</p>
          <input
            v-model="newDriver.email"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Plate Number</p>
          <input
            v-model="newDriver.plate_number"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Franchise Number</p>
          <input
            v-model="newDriver.franchise_number"
            class="input input-bordered w-full"
          />
        </div>

        <!-- REGISTRATION STATUS -->
        <div>
          <p class="text-gray-400 text-sm">Registration Status</p>

          <select
            v-model="newDriver.is_registered"
            class="select select-bordered w-full"
          >
            <option :value="false">Unregistered</option>
            <option :value="true">Registered</option>
          </select>
        </div>

        <!-- TODA DROPDOWN -->
        <div class="md:col-span-2">
          <p class="text-gray-400 text-sm">TODA</p>

          <select
            v-model="newDriver.toda_id"
            class="select select-bordered w-full"
          >
            <option disabled value="">Select TODA</option>

            <option v-for="toda in todas" :key="toda.id" :value="toda.id">
              {{ toda.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="border-t dark:border-gray-700 p-5 flex justify-end gap-3">
        <button class="btn btn-outline" @click="resetForm" :disabled="saving">
          Clear
        </button>

        <button
          class="btn btn-primary"
          :disabled="saving"
          @click="createDriver"
        >
          <span v-if="saving" class="loading loading-spinner loading-sm"></span>
          {{ saving ? "Creating..." : "Create Driver" }}
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

const emit = defineEmits(["close", "updated"]);

const saving = ref(false);
const previewImage = ref(null);

const todas = ref([]);

/* EMPTY DRIVER FORM */
const newDriver = reactive({
  first_name: "",
  last_name: "",
  contact_number: "",
  email: "",
  plate_number: "",
  franchise_number: "",
  toda_id: "",
  profile_pic: null,
  is_registered: false,
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

/* IMAGE UPLOAD */
const handleImageUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const result = e.target?.result;

    previewImage.value = result;
    newDriver.profile_pic = result;
  };

  reader.readAsDataURL(file);
};

/* CREATE DRIVER */
const createDriver = async () => {
  try {
    saving.value = true;

    await $fetch("/api/driver", {
      method: "POST",
      body: newDriver,
    });

    alert("Driver created successfully!");

    emit("updated");
    closeModal();
  } catch (err) {
    console.error(err);
    alert("Failed to create driver");
  } finally {
    saving.value = false;
  }
};

/* RESET */
const resetForm = () => {
  Object.assign(newDriver, {
    first_name: "",
    last_name: "",
    contact_number: "",
    email: "",
    plate_number: "",
    franchise_number: "",
    toda_id: "",
    profile_pic: null,
    is_registered: false,
  });

  previewImage.value = null;
};

/* CLOSE */
const closeModal = () => {
  resetForm();
  emit("close");
};
</script>
