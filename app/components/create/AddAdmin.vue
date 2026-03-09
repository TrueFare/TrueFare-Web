<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Add Admin</h2>

      <form @submit.prevent="createAdmin" class="space-y-3">
        <input
          v-model="form.first_name"
          placeholder="First Name"
          class="input input-bordered w-full"
        />

        <input
          v-model="form.last_name"
          placeholder="Last Name"
          class="input input-bordered w-full"
        />

        <input
          v-model="form.email"
          placeholder="Email"
          class="input input-bordered w-full"
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="input input-bordered w-full"
        />

        <input
          v-model="form.toda_id"
          placeholder="TODA ID"
          class="input input-bordered w-full"
        />

        <div class="flex justify-end gap-2 pt-4">
          <button type="button" class="btn" @click="$emit('close')">
            Cancel
          </button>

          <button class="btn btn-primary" :disabled="loading">
            {{ loading ? "Creating..." : "Create Admin" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close", "created"]);

const loading = ref(false);

const form = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  toda_id: "",
});

const createAdmin = async () => {
  try {
    loading.value = true;

    await $fetch("/api/admin", {
      method: "POST",
      body: form,
    });

    emit("created");
    emit("close");
  } catch (err) {
    alert(err.statusMessage || "Failed to create admin");
  } finally {
    loading.value = false;
  }
};
</script>
