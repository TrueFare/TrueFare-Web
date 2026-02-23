<template>
  <div class="min-h-screen bg-base-200 p-6">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-base-content">Manage Drivers</h1>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title flex items-center gap-2">
            <Icon name="mdi:plus-circle" />
            Create New Driver
          </h2>

          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- First Name -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">First Name</span>
              </label>
              <input
                v-model="form.first_name"
                type="text"
                class="input input-bordered"
              />
              <span v-if="errors.first_name" class="text-error text-sm">
                {{ errors.first_name }}
              </span>
            </div>

            <!-- Last Name -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Last Name</span>
              </label>
              <input
                v-model="form.last_name"
                type="text"
                class="input input-bordered"
              />
              <span v-if="errors.last_name" class="text-error text-sm">
                {{ errors.last_name }}
              </span>
            </div>

            <!-- Contact Number -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Contact Number</span>
              </label>
              <input
                v-model="form.contact_number"
                type="text"
                class="input input-bordered"
              />
              <span v-if="errors.contact_number" class="text-error text-sm">
                {{ errors.contact_number }}
              </span>
            </div>

            <!-- Email -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Email (Optional)</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                class="input input-bordered"
              />
              <span v-if="errors.email" class="text-error text-sm">
                {{ errors.email }}
              </span>
            </div>

            <!-- Plate Number -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Plate Number</span>
              </label>
              <input
                v-model="form.plate_number"
                type="text"
                class="input input-bordered"
              />
              <span v-if="errors.plate_number" class="text-error text-sm">
                {{ errors.plate_number }}
              </span>
            </div>

            <!-- Franchise Number -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Franchise Number</span>
              </label>
              <input
                v-model.number="form.franchise_number"
                type="number"
                class="input input-bordered"
              />
              <span v-if="errors.franchise_number" class="text-error text-sm">
                {{ errors.franchise_number }}
              </span>
            </div>

            <!-- TODA ID -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">TODA ID</span>
              </label>
              <input
                v-model.number="form.toda_id"
                type="number"
                class="input input-bordered"
              />
              <span v-if="errors.toda_id" class="text-error text-sm">
                {{ errors.toda_id }}
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
                {{ isLoading ? "Creating..." : "Create Driver" }}
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

interface DriverForm {
  first_name: string;
  last_name: string;
  contact_number: string;
  email: string;
  plate_number: string;
  franchise_number: number | null;
  toda_id: number | null;
}

const form = reactive<DriverForm>({
  first_name: "",
  last_name: "",
  contact_number: "",
  email: "",
  plate_number: "",
  franchise_number: null,
  toda_id: null,
});

const errors = reactive<Record<string, string>>({});
const isLoading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.first_name.trim()) errors.first_name = "First name is required";
  if (!form.last_name.trim()) errors.last_name = "Last name is required";
  if (!form.contact_number.trim())
    errors.contact_number = "Contact number is required";
  if (!form.plate_number.trim())
    errors.plate_number = "Plate number is required";
  if (!form.franchise_number)
    errors.franchise_number = "Franchise number is required";
  if (!form.toda_id) errors.toda_id = "TODA ID is required";

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Invalid email format";
  }

  return Object.keys(errors).length === 0;
};

const submitForm = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  if (!validateForm()) return;

  isLoading.value = true;

  try {
    await $fetch("/api/driver", {
      method: "POST",
      body: {
        ...form,
        is_registered: false, // default value
      },
    });

    successMessage.value = "Driver created successfully!";
    resetForm();
  } catch (error: any) {
    errorMessage.value = error?.data?.message || "Failed to create driver.";
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  form.first_name = "";
  form.last_name = "";
  form.contact_number = "";
  form.email = "";
  form.plate_number = "";
  form.franchise_number = null;
  form.toda_id = null;

  Object.keys(errors).forEach((key) => delete errors[key]);
  successMessage.value = "";
  errorMessage.value = "";
};
</script>
