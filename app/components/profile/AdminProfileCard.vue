<template>
  <div
    v-if="show"
    class="fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto relative"
    >
      <button
        class="absolute right-4 top-4 btn btn-sm btn-circle z-10"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- HEADER -->
      <div
        class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white"
      >
        <h2 class="text-2xl font-bold">
          {{ editableAdmin.first_name }} {{ editableAdmin.last_name }}
        </h2>
        <p class="text-sm opacity-80">TODA Admin</p>
      </div>

      <!-- BODY -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-gray-400 text-sm">First Name</p>
          <input
            v-model="editableAdmin.first_name"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Last Name</p>
          <input
            v-model="editableAdmin.last_name"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Email</p>
          <input
            v-model="editableAdmin.email"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">TODA ID</p>
          <p class="font-semibold">{{ editableAdmin.toda_id }}</p>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="border-t dark:border-gray-700 p-5 flex justify-end gap-3">
        <button class="btn btn-error" @click="deleteAdmin">Delete</button>
        <button class="btn btn-primary" @click="saveAdmin">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  show: Boolean,
  admin: Object,
});

const emit = defineEmits(["close", "updated"]);

const editableAdmin = reactive({});

watch(
  () => props.admin,
  (val) => {
    if (val) Object.assign(editableAdmin, val);
  },
  { immediate: true },
);

const saveAdmin = async () => {
  await $fetch(`/api/admin/${editableAdmin.id}`, {
    method: "POST",
    body: editableAdmin,
  });
  emit("updated");
  alert("Admin updated successfully!");
};

const deleteAdmin = async () => {
  await $fetch(`/api/admin/${editableAdmin.id}`, {
    method: "DELETE",
  });
  emit("updated");
  emit("close");
  alert("Admin deleted!");
};
</script>
