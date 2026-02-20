<template>
  <div class="min-h-screen bg-base-200 p-6">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-base-content">Manage Users</h1>

      <!-- Form Card -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title flex items-center gap-2">
            <Icon name="mdi:plus-circle" />
            Create New User
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
                placeholder="Enter first name"
                class="input input-bordered"
                required
              />
              <label class="label">
                <span class="label-text-alt text-error" v-if="errors.first_name">
                  {{ errors.first_name }}
                </span>
              </label>
            </div>

            <!-- Last Name -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Last Name</span>
              </label>
              <input
                v-model="form.last_name"
                type="text"
                placeholder="Enter last name"
                class="input input-bordered"
                required
              />
              <label class="label">
                <span class="label-text-alt text-error" v-if="errors.last_name">
                  {{ errors.last_name }}
                </span>
              </label>
            </div>

            <!-- Email -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Email</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                placeholder="Enter email address"
                class="input input-bordered"
                required
              />
              <label class="label">
                <span class="label-text-alt text-error" v-if="errors.email">
                  {{ errors.email }}
                </span>
              </label>
            </div>

            <!-- Contact Number -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Contact Number</span>
                <span class="label-text-alt">(Optional)</span>
              </label>
              <input
                v-model="form.contact_number"
                type="tel"
                placeholder="Enter contact number"
                class="input input-bordered"
              />
              <label class="label">
                <span class="label-text-alt text-error" v-if="errors.contact_number">
                  {{ errors.contact_number }}
                </span>
              </label>
            </div>

            <!-- Password -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Password</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter password"
                  class="input input-bordered w-full"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" class="text-lg" />
                </button>
              </div>
              <label class="label">
                <span class="label-text-alt text-error" v-if="errors.password">
                  {{ errors.password }}
                </span>
              </label>
            </div>

            <!-- Confirm Password -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Confirm Password</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.confirm_password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Confirm password"
                  class="input input-bordered w-full"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" class="text-lg" />
                </button>
              </div>
              <label class="label">
                <span class="label-text-alt text-error" v-if="errors.confirm_password">
                  {{ errors.confirm_password }}
                </span>
              </label>
            </div>

            <!-- Alert Messages -->
            <div v-if="successMessage" class="alert alert-success shadow-lg">
              <Icon name="mdi:check-circle" class="text-xl" />
              <span>{{ successMessage }}</span>
            </div>

            <div v-if="errorMessage" class="alert alert-error shadow-lg">
              <Icon name="mdi:alert-circle" class="text-xl" />
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Submit Button -->
            <div class="card-actions justify-end gap-2 pt-4">
              <button
                type="button"
                @click="resetForm"
                class="btn btn-outline"
                :disabled="isLoading"
              >
                <Icon name="mdi:refresh" />
                Clear
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isLoading"
              >
                <Icon v-if="!isLoading" name="mdi:plus" />
                <span class="loading loading-spinner" v-if="isLoading"></span>
                {{ isLoading ? 'Creating...' : 'Create User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Icon } from '#components'

interface FormData {
  first_name: string
  last_name: string
  email: string
  contact_number: string
  password: string
  confirm_password: string
}

interface FormErrors {
  [key: string]: string
}

const form = reactive<FormData>({
  first_name: '',
  last_name: '',
  email: '',
  contact_number: '',
  password: '',
  confirm_password: ''
})

const errors = reactive<FormErrors>({})
const isLoading = ref(false)
const showPassword = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const validateForm = (): boolean => {
  errors.first_name = ''
  errors.last_name = ''
  errors.email = ''
  errors.password = ''
  errors.confirm_password = ''

  if (!form.first_name.trim()) {
    errors.first_name = 'First name is required'
  }

  if (!form.last_name.trim()) {
    errors.last_name = 'Last name is required'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (form.password !== form.confirm_password) {
    errors.confirm_password = 'Passwords do not match'
  }

  return Object.keys(errors).every(key => !errors[key])
}

const submitForm = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch('/api/user', {
      method: 'POST',
      body: {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        contact_number: form.contact_number || null,
        password: form.password
      }
    })

    successMessage.value = 'User created successfully!'
    resetForm()
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to create user. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.first_name = ''
  form.last_name = ''
  form.email = ''
  form.contact_number = ''
  form.password = ''
  form.confirm_password = ''
  errors.first_name = ''
  errors.last_name = ''
  errors.email = ''
  errors.password = ''
  errors.confirm_password = ''
  successMessage.value = ''
  errorMessage.value = ''
}
</script>
