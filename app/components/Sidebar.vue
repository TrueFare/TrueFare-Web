<template>
  <ul
    class="menu p-4 w-64 min-h-full bg-base-200 text-base-content flex flex-col justify-between shadow-lg border-r border-gray-100 dark:border-gray-800"
  >
    <div class="space-y-4">
      <div class="px-4 py-6 border-b border-gray-100 dark:border-gray-800 mb-4">
        <h2
          class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
        >
          TrueFare
        </h2>
        <p
          class="text-xs uppercase text-gray-500 font-bold tracking-wider mt-1"
        >
          {{ user?.role?.replace("_", " ") || "Guest" }}
        </p>
      </div>

      <li v-if="user?.role === 'super_admin'">
        <NuxtLink
          to="/super-admin/dashboard"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <i class="fa-solid fa-gauge w-5 text-purple-600"></i>
          <span class="font-medium">Dashboard</span>
        </NuxtLink>
      </li>

      <li v-if="user?.role === 'admin'">
        <NuxtLink
          to="/admin"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <i class="fa-solid fa-gauge w-5 text-blue-600"></i>
          <span class="font-medium">Admin Panel</span>
        </NuxtLink>
      </li>
      // hi

      <li>
        <NuxtLink
          to="/"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <i class="fa-solid fa-house w-5 text-green-600"></i>
          <span class="font-medium">Home</span>
        </NuxtLink>
      </li>
    </div>

    <div class="border-t border-gray-100 dark:border-gray-800 pt-4">
      <li>
        <button
          @click="handleLogout"
          class="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition w-full"
        >
          <i class="fa-solid fa-right-from-bracket w-5"></i>
          <span class="font-bold">Logout</span>
        </button>
      </li>
    </div>
  </ul>
</template>

<script setup lang="ts">
const { user, logout } = useAuth();

const handleLogout = async () => {
  await logout();
};
</script>
