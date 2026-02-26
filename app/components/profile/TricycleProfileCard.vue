<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <!-- MODAL -->
    <div
      class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
    >
      <!-- CLOSE -->
      <button
        class="absolute right-4 top-4 btn btn-sm btn-circle"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- ================= HEADER ================= -->
      <div
        class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex gap-5"
      >
        <!-- IMAGE -->
        <div
          class="w-24 h-24 rounded-full overflow-hidden border-4 border-white relative"
        >
          <img
            v-if="previewImage"
            :src="previewImage"
            class="w-full h-full object-cover"
          />

          <!-- Upload -->
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

          <!-- STATUS BADGE -->
          <span
            class="inline-flex text-xs font-semibold rounded-full px-3 py-1 mt-2"
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

        <!-- STATUS -->
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

        <!-- DATE CREATED -->
        <div>
          <p class="text-gray-400 text-sm">Date Created</p>
          <p class="font-semibold">
            {{ editableDriver.date_created }}
          </p>
        </div>

        <!-- DATE UPDATED -->
        <div v-if="editableDriver.date_updated">
          <p class="text-gray-400 text-sm">Last Updated</p>
          <p class="font-semibold">
            {{ editableDriver.date_updated }}
          </p>
        </div>
      </div>

      <!-- ================= ACTIONS ================= -->
      <div class="border-t dark:border-gray-700 p-5 flex justify-end gap-3">
        <!-- DELETE (NON FUNCTIONAL) -->
        <button class="btn btn-error">
          <i class="fa-solid fa-trash"></i>
          Delete
        </button>

        <!-- SAVE -->
        <button
          class="btn btn-primary"
          :class="{ loading: saving }"
          @click="saveDriver"
        >
          💾 Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from "vue";

const props = defineProps({
  show: Boolean,
  driver: Object,
});

const emit = defineEmits(["close", "updated"]);

const editableDriver = reactive({});
const saving = ref(false);
const previewImage = ref(null);

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
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    previewImage.value = reader.result;
    editableDriver.profile_pic = reader.result;
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
</script>
