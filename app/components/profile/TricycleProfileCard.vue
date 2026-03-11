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
        class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left"
      >
        <!-- IMAGE -->
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
          <h2 class="text-2xl font-bold">
            {{ editableDriver.first_name }}
            {{ editableDriver.last_name }}
          </h2>

          <p>Plate: {{ editableDriver.plate_number }}</p>

          <!-- STATUS CAPSULE -->
          <span
            class="inline-flex w-fit self-start text-xs font-semibold rounded-full px-3 py-1 mt-2"
            :class="
              editableDriver.is_registered
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            "
          >
            {{ editableDriver.is_registered ? "Registered" : "Unregistered" }}
          </span>
        </div>
      </div>

      <!-- ================= BODY ================= -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2 flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 mb-4">
          <p class="text-sm font-bold text-gray-500 uppercase mb-2">Tricycle QR Code</p>
          <img 
            v-if="editableDriver.id"
            :src="`/api/driver/qr/${editableDriver.id}`" 
            class="w-48 h-48 bg-white p-2 rounded-lg shadow-sm"
            alt="Tricycle QR Code"
          />
          <p class="text-xs text-gray-400 mt-2">ID: {{ editableDriver.id }} | Plate: {{ editableDriver.plate_number }}</p>
          <a 
            v-if="editableDriver.id"
            :href="`/api/driver/qr/${editableDriver.id}`" 
            download="qr-code.svg"
            class="btn btn-xs btn-outline mt-3"
          >
            <i class="fa-solid fa-download"></i>
            Download QR
          </a>
        </div>

        <div>
          <p class="text-gray-400 text-sm">First Name</p>
          <input
            v-model="editableDriver.first_name"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Last Name</p>
          <input
            v-model="editableDriver.last_name"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Contact</p>
          <input
            v-model="editableDriver.contact_number"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Email</p>
          <input
            v-model="editableDriver.email"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Plate Number</p>
          <input
            v-model="editableDriver.plate_number"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Franchise</p>
          <input
            v-model="editableDriver.franchise_number"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Status</p>
          <select
            v-model="editableDriver.is_registered"
            class="select select-bordered w-full"
          >
            <option :value="true">Registered</option>
            <option :value="false">Unregistered</option>
          </select>
        </div>

        <div>
          <p class="text-gray-400 text-sm">Date Created</p>
          <p class="font-semibold">
            {{ editableDriver.date_created }}
          </p>
        </div>

        <div v-if="editableDriver.date_updated">
          <p class="text-gray-400 text-sm">Last Updated</p>
          <p class="font-semibold">
            {{ editableDriver.date_updated }}
          </p>
        </div>
      </div>

      <!-- ================= ACTIONS ================= -->
      <div class="border-t dark:border-gray-700 p-5 flex justify-end gap-3 flex-wrap">
        <a 
          v-if="editableDriver.id"
          :href="`/super-admin/print/driver/${editableDriver.id}`" 
          target="_blank"
          class="btn btn-outline btn-info flex items-center gap-2"
        >
          <i class="fa-solid fa-print"></i>
          <span>Print ID Profile</span>
        </a>

        <button 
          class="btn btn-error"
          :disabled="deleting || saving"
          @click="deleteDriver"
        >
          <span v-if="deleting" class="loading loading-spinner loading-sm"></span>
          <i v-else class="fa-solid fa-trash"></i>
          {{ deleting ? "Deleting..." : "Delete" }}
        </button>

        <button
          class="btn btn-primary flex items-center gap-2"
          :disabled="saving || deleting"
          @click="saveDriver"
        >
          <span v-if="saving" class="loading loading-spinner loading-sm"></span>

          <span>
            {{ saving ? "Saving..." : "💾 Save" }}
          </span>
        </button>
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
