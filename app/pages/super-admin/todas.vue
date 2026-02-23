<template>
  <div class="min-h-screen bg-base-200 p-6">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-base-content">Manage TODAs</h1>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title flex items-center gap-2">
            <Icon name="mdi:plus-circle" />
            Create New TODA
          </h2>

          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Name -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">TODA Name</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                class="input input-bordered"
              />
              <span v-if="errors.name" class="text-error text-sm">
                {{ errors.name }}
              </span>
            </div>

            <!-- Password -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Password</span>
              </label>
              <input
                v-model="form.password"
                type="password"
                class="input input-bordered"
              />
              <span v-if="errors.password" class="text-error text-sm">
                {{ errors.password }}
              </span>
            </div>

            <!-- Barangay -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Barangay</span>
              </label>
              <input
                v-model="form.barangay"
                type="text"
                class="input input-bordered"
              />
              <span v-if="errors.barangay" class="text-error text-sm">
                {{ errors.barangay }}
              </span>
            </div>

            <!-- City -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">City</span>
              </label>
              <input
                v-model="form.city"
                type="text"
                class="input input-bordered"
              />
              <span v-if="errors.city" class="text-error text-sm">
                {{ errors.city }}
              </span>
            </div>

            <!-- Success -->
            <div v-if="successMessage" class="alert alert-success">
              {{ successMessage }}
            </div>

            <!-- Error -->
            <div v-if="errorMessage" class="alert alert-error">
              {{ errorMessage }}
            </div>

            <!-- Buttons -->
            <div class="card-actions justify-end pt-4 gap-2">
              <button
                type="button"
                @click="resetForm"
                class="btn btn-outline"
                :disabled="isLoading"
              >
                Clear
              </button>

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="loading loading-spinner"></span>
                {{ isLoading ? "Creating..." : "Create TODA" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { Icon } from "#components";

interface TodaForm {
  name: string;
  password: string;
  barangay: string;
  city: string;
}

const form = reactive<TodaForm>({
  name: "",
  password: "",
  barangay: "",
  city: "",
});

const errors = reactive<Record<string, string>>({});
const isLoading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.name.trim()) errors.name = "TODA name is required";
  if (!form.password.trim()) errors.password = "Password is required";
  if (!form.barangay.trim()) errors.barangay = "Barangay is required";
  if (!form.city.trim()) errors.city = "City is required";

  return Object.keys(errors).length === 0;
};

const submitForm = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  if (!validateForm()) return;

  isLoading.value = true;

  try {
    await $fetch("/api/toda", {
      method: "POST",
      body: {
        ...form,
      },
    });

    successMessage.value = "TODA created successfully!";
    resetForm();
  } catch (error: any) {
    errorMessage.value = error?.data?.message || "Failed to create TODA.";
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  form.name = "";
  form.password = "";
  form.barangay = "";
  form.city = "";

  Object.keys(errors).forEach((key) => delete errors[key]);
  successMessage.value = "";
  errorMessage.value = "";
};
</script>
