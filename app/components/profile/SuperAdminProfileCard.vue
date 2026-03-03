<template>
  <div
    v-if="show"
    class="fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-xl relative"
    >
      <button
        class="absolute right-4 top-4 btn btn-sm btn-circle"
        @click="$emit('close')"
      >
        ✕
      </button>

      <div class="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white">
        <h2 class="text-2xl font-bold">
          {{ editableSuper.first_name }} {{ editableSuper.last_name }}
        </h2>
        <p class="text-sm opacity-80">Super Admin</p>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <p class="text-gray-400 text-sm">First Name</p>
          <input
            v-model="editableSuper.first_name"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Last Name</p>
          <input
            v-model="editableSuper.last_name"
            class="input input-bordered w-full"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Email</p>
          <input
            v-model="editableSuper.email"
            class="input input-bordered w-full"
          />
        </div>
      </div>

      <div class="border-t dark:border-gray-700 p-5 flex justify-end gap-3">
        <button class="btn btn-error" @click="deleteSuper">Delete</button>
        <button class="btn btn-primary" @click="saveSuper">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  show: Boolean,
  superAdmin: Object,
});

const emit = defineEmits(["close", "updated"]);

const editableSuper = reactive({});

watch(
  () => props.superAdmin,
  (val) => {
    if (val) Object.assign(editableSuper, val);
  },
  { immediate: true },
);

const saveSuper = async () => {
  await $fetch(`/api/super-admin/${editableSuper.id}`, {
    method: "POST",
    body: editableSuper,
  });
  emit("updated");
  alert("Super Admin updated!");
};

const deleteSuper = async () => {
  await $fetch(`/api/super-admin/${editableSuper.id}`, {
    method: "DELETE",
  });
  emit("updated");
  emit("close");
  alert("Super Admin deleted!");
};
</script>
