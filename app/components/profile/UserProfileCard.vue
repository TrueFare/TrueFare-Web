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
        <div>
          <h2 class="text-2xl font-bold">
            {{ editableUser.first_name }}
            {{ editableUser.last_name }}
          </h2>

          <h3><strong>Edit User</strong></h3>
        </div>
      </div>

      <!-- ================= BODY ================= -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-gray-400 text-sm">First Name</p>
          <input
            v-model="editableUser.first_name"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Last Name</p>
          <input
            v-model="editableUser.last_name"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Contact</p>
          <input
            v-model="editableUser.contact_number"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Email</p>
          <input
            v-model="editableUser.email"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Date Created</p>
          <p class="font-semibold">
            {{ editableUser.date_created }}
          </p>
        </div>

        <div v-if="editableUser.date_updated">
          <p class="text-gray-400 text-sm">Last Updated</p>
          <p class="font-semibold">
            {{ editableUser.date_updated }}
          </p>
        </div>
      </div>

      <!-- ================= ACTIONS ================= -->
      <div class="border-t dark:border-gray-700 p-5 flex justify-end gap-3">
        <button class="btn btn-error">
          <i class="fa-solid fa-trash"></i>
          Delete
        </button>

        <button
          class="btn btn-primary flex items-center gap-2"
          :disabled="saving"
          @click="saveUser"
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
  user: Object,
});

const emit = defineEmits(["close", "updated"]);

const editableUser = reactive({});
const saving = ref(false);

/* =============================
   LOCK BACKGROUND SCROLL
============================= */
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

/* =============================
   COPY USER DATA
============================= */
watch(
  () => props.user,
  (val) => {
    if (!val) return;

    Object.assign(editableUser, val);
  },
  { immediate: true },
);

/* =============================
   SAVE USER
============================= */
const saveUser = async () => {
  try {
    saving.value = true;

    const response = await $fetch(`/api/user/${editableUser.id}`, {
      method: "POST",
      body: editableUser,
    });

    Object.assign(editableUser, response.data);

    emit("updated");
    alert("User updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Update failed");
  } finally {
    saving.value = false;
  }
};
</script>
