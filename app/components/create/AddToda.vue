<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Add TODA</h2>

      <form @submit.prevent="createToda" class="space-y-3">
        <input
          v-model="form.name"
          placeholder="TODA Name"
          class="input input-bordered w-full"
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="input input-bordered w-full"
        />

        <input
          v-model="form.barangay"
          placeholder="Barangay"
          class="input input-bordered w-full"
        />

        <input
          v-model="form.city"
          placeholder="City"
          class="input input-bordered w-full"
        />

        <div class="flex justify-end gap-2 pt-4">
          <button type="button" class="btn" @click="$emit('close')">
            Cancel
          </button>

          <button class="btn btn-primary" :disabled="loading">
            {{ loading ? "Creating..." : "Create TODA" }}
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
  name: "",
  password: "",
  barangay: "",
  city: "",
});

const createToda = async () => {
  try {
    loading.value = true;

    await $fetch("/api/toda", {
      method: "POST",
      body: form,
    });

    emit("created");
    emit("close");
  } catch (err) {
    alert(err.statusMessage || "Failed to create TODA");
  } finally {
    loading.value = false;
  }
};
</script>
