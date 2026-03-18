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
        <div class="relative group">
          <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
            <img
              v-if="previewImage"
              :src="previewImage"
              class="w-full h-full object-cover"
            />
            <Icon v-else name="mdi:account-plus" class="text-5xl text-white/50" />
          </div>

          <label class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer">
            <Icon name="mdi:camera" class="text-2xl text-white" />
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageUpload"
            />
          </label>
        </div>

        <div>
          <h2 class="text-2xl font-black uppercase tracking-tight">Add New Driver</h2>
          <p class="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Register a tricycle driver</p>
        </div>
      </div>

      <!-- BODY -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">First Name</span></label>
          <input
            v-model="newDriver.first_name"
            class="input input-bordered w-full focus:input-primary"
            :class="{'input-error': errors.first_name}"
            placeholder="Enter first name"
          />
          <label v-if="errors.first_name" class="label"><span class="label-text-alt text-error text-[10px] font-bold uppercase">{{ errors.first_name }}</span></label>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Last Name</span></label>
          <input
            v-model="newDriver.last_name"
            class="input input-bordered w-full focus:input-primary"
            :class="{'input-error': errors.last_name}"
            placeholder="Enter last name"
          />
          <label v-if="errors.last_name" class="label"><span class="label-text-alt text-error text-[10px] font-bold uppercase">{{ errors.last_name }}</span></label>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Contact Number</span></label>
          <input
            v-model="newDriver.contact_number"
            class="input input-bordered w-full focus:input-primary"
            :class="{'input-error': errors.contact_number}"
            placeholder="09..."
          />
          <label v-if="errors.contact_number" class="label"><span class="label-text-alt text-error text-[10px] font-bold uppercase">{{ errors.contact_number }}</span></label>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Email Address</span></label>
          <input
            v-model="newDriver.email"
            class="input input-bordered w-full focus:input-primary"
            :class="{'input-error': errors.email}"
            placeholder="email@example.com"
          />
          <label v-if="errors.email" class="label"><span class="label-text-alt text-error text-[10px] font-bold uppercase">{{ errors.email }}</span></label>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Plate Number</span></label>
          <input
            v-model="newDriver.plate_number"
            class="input input-bordered w-full focus:input-primary"
            :class="{'input-error': errors.plate_number}"
            placeholder="Enter plate number"
          />
          <label v-if="errors.plate_number" class="label"><span class="label-text-alt text-error text-[10px] font-bold uppercase">{{ errors.plate_number }}</span></label>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Franchise Number</span></label>
          <input
            v-model="newDriver.franchise_number"
            class="input input-bordered w-full focus:input-primary"
            :class="{'input-error': errors.franchise_number}"
            placeholder="Enter franchise number"
          />
          <label v-if="errors.franchise_number" class="label"><span class="label-text-alt text-error text-[10px] font-bold uppercase">{{ errors.franchise_number }}</span></label>
        </div>

        <!-- REGISTRATION STATUS -->
        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Registration Status</span></label>

          <select
            v-model="newDriver.is_registered"
            class="select select-bordered w-full focus:select-primary"
          >
            <option :value="false">Unregistered</option>
            <option :value="true">Registered</option>
          </select>
        </div>

        <!-- TODA DROPDOWN -->
        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Assign TODA</span></label>

          <select
            v-model="newDriver.toda_id"
            class="select select-bordered w-full focus:select-primary"
            :class="{'select-error': errors.toda_id}"
            :disabled="!!todaId"
          >
            <option disabled value="">Select TODA</option>

            <option v-for="toda in todas" :key="toda.id" :value="toda.id">
              {{ toda.name }}
            </option>
          </select>
          <label v-if="errors.toda_id" class="label"><span class="label-text-alt text-error text-[10px] font-bold uppercase">{{ errors.toda_id }}</span></label>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="border-t border-base-content/5 p-5 flex justify-end gap-3 bg-base-200/30">
        <button class="btn btn-outline border-2 px-8" @click="resetForm" :disabled="saving">
          Clear
        </button>

        <button
          class="btn btn-primary px-8 gap-2"
          :disabled="saving"
          @click="createDriver"
        >
          <span v-if="saving" class="loading loading-spinner loading-sm"></span>
          <Icon v-else name="mdi:plus-circle" class="text-lg" />
          Create Driver
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  show: Boolean,
  todaId: {
    type: [String, Number],
    default: "",
  },
});

const emit = defineEmits(["close", "updated", "created"]);

const saving = ref(false);
const previewImage = ref(null);

const todas = ref([]);

const errors = reactive({
  first_name: "",
  last_name: "",
  contact_number: "",
  email: "",
  plate_number: "",
  franchise_number: "",
  toda_id: "",
});

/* EMPTY DRIVER FORM */
const newDriver = reactive({
  first_name: "",
  last_name: "",
  contact_number: "",
  email: "",
  plate_number: "",
  franchise_number: "",
  toda_id: props.todaId || "",
  profile_pic: null,
  is_registered: false,
});

/* WATCH FOR PROPS.TODA_ID CHANGES */
watch(
  () => props.todaId,
  (newId) => {
    if (newId) {
      newDriver.toda_id = newId;
    }
  },
);

/* LOAD TODAS */
onMounted(async () => {
  try {
    const res = await $fetch("/api/toda");
    todas.value = res.results || [];
    
    if (props.todaId) {
      newDriver.toda_id = props.todaId;
    }
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
    Object.assign(errors, {
      first_name: "",
      last_name: "",
      contact_number: "",
      email: "",
      plate_number: "",
      franchise_number: "",
      toda_id: "",
    });

    await $fetch("/api/driver", {
      method: "POST",
      body: newDriver,
    });

    alert("Driver created successfully!");

    emit("created");
    closeModal();
  } catch (err) {
    if (err.statusCode === 400 && err.data) {
      const zodErrors = err.data.data || err.data;
      let firstErrorMsg = "";

      if (zodErrors) {
        if (zodErrors.first_name) errors.first_name = zodErrors.first_name._errors?.[0];
        if (zodErrors.last_name) errors.last_name = zodErrors.last_name._errors?.[0];
        if (zodErrors.contact_number) errors.contact_number = zodErrors.contact_number._errors?.[0];
        if (zodErrors.email) errors.email = zodErrors.email._errors?.[0];
        if (zodErrors.plate_number) errors.plate_number = zodErrors.plate_number._errors?.[0];
        if (zodErrors.franchise_number) errors.franchise_number = zodErrors.franchise_number._errors?.[0];
        if (zodErrors.toda_id) errors.toda_id = zodErrors.toda_id._errors?.[0];
        
        // Find the first error to show in alert
        for (const key in zodErrors) {
          if (key !== "_errors" && zodErrors[key]?._errors?.[0]) {
            firstErrorMsg = `${key}: ${zodErrors[key]._errors[0]}`;
            break;
          }
        }
      }
      
      alert(firstErrorMsg ? `Validation Error: ${firstErrorMsg}` : "Please fix the validation errors.");
    } else {
      alert(err.statusMessage || "Failed to create driver");
    }
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
    toda_id: props.todaId || "",
    profile_pic: null,
    is_registered: false,
  });
  Object.assign(errors, {
    first_name: "",
    last_name: "",
    contact_number: "",
    email: "",
    plate_number: "",
    franchise_number: "",
    toda_id: "",
  });

  previewImage.value = null;
};

/* CLOSE */
const closeModal = () => {
  resetForm();
  emit("close");
};
</script>
