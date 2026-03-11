<template>
  <div key="landing-page-root" class="index-landing min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-8">
    <div class="text-center">
      <h1 class="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
        TrueFare
      </h1>
      <p class="mt-4 text-xl text-gray-600 dark:text-gray-400">
        Tricycle Operations, Managed Properly.
      </p>
    </div>

    <div v-if="loading" class="flex flex-col items-center gap-4">
      <Icon name="mdi:loading" class="text-3xl text-gray-400 animate-spin" />
      <span class="text-gray-500">Verifying session...</span>
    </div>

    <div v-else-if="user" class="flex flex-col items-center gap-6">
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
        Welcome back, <span class="text-blue-600 dark:text-blue-400 font-bold">{{ user.first_name }}</span>!
      </p>
      
      <div class="flex gap-4">
        <NuxtLink v-if="user.role === 'super_admin'" to="/super-admin" class="px-6 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition">
          Super Admin Dashboard
        </NuxtLink>
        <NuxtLink v-else-if="user.role === 'admin'" to="/admin" class="px-6 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition">
          Admin Dashboard
        </NuxtLink>
        <button @click="logout" class="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          Sign Out
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center gap-6">
      <NuxtLink to="/login" class="px-10 py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-md">
        Sign In
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { user, loading, fetchUser, logout } = useAuth();

onMounted(async () => {
  await fetchUser();
});
</script>

<style>
</style>
