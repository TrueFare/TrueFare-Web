<template>
  <div
    v-if="show"
    class="fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <!-- MODAL -->
    <div
      class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto relative"
    >
      <!-- CLOSE -->
      <button
        class="absolute right-4 top-4 btn btn-sm btn-circle z-10"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- ================= HEADER ================= -->
      <div
        class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left"
      >
        <!-- IMAGE -->
        <div class="relative group">
          <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
            <img
              v-if="previewImage"
              :src="previewImage"
              class="w-full h-full object-cover"
            />
            <Icon v-else name="mdi:account" class="text-5xl text-white/50" />
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

        <div class="flex-1">
          <h2 class="text-2xl font-black uppercase tracking-tight leading-tight">
            {{ editableDriver.first_name }} {{ editableDriver.last_name }}
          </h2>
          <div class="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
            <span class="badge badge-lg bg-white/20 border-none text-white font-bold gap-1 text-[10px] tracking-widest px-3">
              <Icon name="mdi:car-plate" /> {{ editableDriver.plate_number }}
            </span>
            <span 
              class="badge badge-lg font-bold gap-1 text-[10px] tracking-widest px-3 border-none"
              :class="editableDriver.is_registered ? 'bg-success text-success-content' : 'bg-warning text-warning-content'"
            >
              <Icon :name="editableDriver.is_registered ? 'mdi:check-decagram' : 'mdi:alert-circle'" />
              {{ editableDriver.is_registered ? 'Registered' : 'Pending' }}
            </span>
          </div>
        </div>
      </div>

      <!-- ================= BODY ================= -->
      <div class="p-6">
        <!-- QR SECTION -->
        <div class="bg-base-200/50 rounded-3xl p-6 border border-base-content/5 mb-8">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div class="text-center sm:text-left">
              <h3 class="text-lg font-black uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
                <Icon name="mdi:qrcode-scan" class="text-primary" />
                Driver QR Code
              </h3>
              <p class="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mt-1">Unique Identification for Trips</p>
            </div>
            <a 
              v-if="editableDriver.id"
              :href="`/api/driver/qr/${editableDriver.id}`" 
              download="qr-code.svg"
              class="btn btn-sm btn-primary btn-outline border-2 gap-2"
            >
              <Icon name="mdi:download" />
              Download QR
            </a>
          </div>
          <div class="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-inner border border-base-content/5">
            <img 
              v-if="editableDriver.id"
              :src="`/api/driver/qr/${editableDriver.id}`" 
              class="w-48 h-48"
              alt="Tricycle QR Code"
            />
            <div class="mt-4 text-center">
              <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Scan to initiate trip</p>
              <p class="font-bold text-gray-900 mt-1">ID: {{ editableDriver.id }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">First Name</span></label>
            <input v-model="editableDriver.first_name" class="input input-bordered w-full focus:input-primary" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Last Name</span></label>
            <input v-model="editableDriver.last_name" class="input input-bordered w-full focus:input-primary" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Contact</span></label>
            <input v-model="editableDriver.contact_number" class="input input-bordered w-full focus:input-primary" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Email</span></label>
            <input v-model="editableDriver.email" class="input input-bordered w-full focus:input-primary" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Plate Number</span></label>
            <input v-model="editableDriver.plate_number" class="input input-bordered w-full focus:input-primary" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Franchise</span></label>
            <input v-model="editableDriver.franchise_number" class="input input-bordered w-full focus:input-primary" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Status</span></label>
            <select v-model="editableDriver.is_registered" class="select select-bordered w-full focus:select-primary">
              <option :value="true">Registered</option>
              <option :value="false">Unregistered</option>
            </select>
          </div>

          <div class="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
            <p class="text-[10px] text-base-content/40 uppercase font-black mb-1 tracking-widest">Date Created</p>
            <p class="font-bold text-sm">{{ editableDriver.date_created }}</p>
          </div>
        </div>
      </div>

      <!-- ================= ACTIONS ================= -->
      <div class="border-t border-base-content/5 p-5 flex flex-wrap justify-between items-center gap-3 bg-base-200/30">
        <a 
          v-if="editableDriver.id"
          :href="`/super-admin/print/driver/${editableDriver.id}`" 
          target="_blank"
          class="btn btn-ghost btn-outline border-2 gap-2"
        >
          <Icon name="mdi:printer" class="text-lg" />
          <span>Print ID Profile</span>
        </a>

        <div class="flex gap-3">
          <button
            class="btn btn-error btn-outline border-2 gap-2"
            :disabled="deleting || saving"
            @click="deleteDriver"
          >
            <span v-if="deleting" class="loading loading-spinner loading-sm"></span>
            <Icon v-else name="mdi:trash-can-outline" class="text-lg" />
            Delete
          </button>

          <button
            class="btn btn-primary px-8 gap-2"
            :disabled="saving || deleting"
            @click="saveDriver"
          >
            <span v-if="saving" class="loading loading-spinner loading-sm"></span>
            <Icon v-else name="mdi:content-save" class="text-lg" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onUnmounted } from "vue";

const props = defineProps({
  show: Boolean,
  driver: Object,
});

const emit = defineEmits(["close", "updated"]);

const editableDriver = reactive({});
const saving = ref(false);
const deleting = ref(false);
const previewImage = ref(null);

/* =============================
   LOCK BACKGROUND SCROLL
============================= */
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

/* =============================
   COPY DRIVER DATA
============================= */
watch(
  () => props.driver,
  (val) => {
    if (!val) return;

    Object.assign(editableDriver, val);

    editableDriver.is_registered =
      val.is_registered === 1 || val.is_registered === true;

    previewImage.value = val?.id ? `/api/driver/picture/${val.id}` : null;
  },
  { immediate: true },
);

/* =============================
   IMAGE UPLOAD
============================= */
const handleImageUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const result = e.target?.result;

    // preview
    previewImage.value = result;

    // ✅ send FULL data URL to API
    editableDriver.profile_pic = result;
  };

  reader.readAsDataURL(file);
};

/* =============================
   SAVE DRIVER
============================= */
const saveDriver = async () => {
  try {
    saving.value = true;

    const response = await $fetch(`/api/driver/${editableDriver.id}`, {
      method: "POST",
      body: editableDriver,
    });

    Object.assign(editableDriver, response.data);

    emit("updated");
    alert("Driver updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Update failed");
  } finally {
    saving.value = false;
  }
};

/* =============================
   DELETE DRIVER
============================= */
const deleteDriver = async () => {
  if (!confirm(`Are you sure you want to delete driver ${editableDriver.first_name} ${editableDriver.last_name}?`)) {
    return;
  }

  try {
    deleting.value = true;
    await $fetch(`/api/driver/${editableDriver.id}`, {
      method: "DELETE",
    });
    emit("updated");
    emit("close");
    alert("Driver deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  } finally {
    deleting.value = false;
  }
};
</script>
