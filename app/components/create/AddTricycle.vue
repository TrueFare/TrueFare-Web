<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg">
      <h2 class="text-xl font-bold mb-4">Add Driver</h2>

      <form @submit.prevent="createDriver" class="space-y-3">
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
          v-model="form.contact_number"
          placeholder="Contact Number"
          class="input input-bordered w-full"
        />

        <input
          v-model="form.email"
          placeholder="Email (optional)"
          class="input input-bordered w-full"
        />

        <input
          v-model="form.plate_number"
          placeholder="Plate Number"
          class="input input-bordered w-full"
        />

        <input
          v-model="form.franchise_number"
          placeholder="Franchise Number"
          class="input input-bordered w-full"
        />

        <select
          v-model="form.is_registered"
          class="select select-bordered w-full"
        >
          <option :value="true">Registered</option>
          <option :value="false">Not Registered</option>
        </select>

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
            {{ loading ? "Creating..." : "Create Driver" }}
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
  contact_number: "",
  email: "",
  plate_number: "",
  franchise_number: "",
  is_registered: true,
  toda_id: "",
});

const createDriver = async () => {
  try {
    loading.value = true;

    await $fetch("/api/driver", {
      method: "POST",
      body: form,
    });

    emit("created");
    emit("close");
  } catch (err) {
    alert(err.statusMessage || "Failed to create driver");
  } finally {
    loading.value = false;
  }
};
</script>
