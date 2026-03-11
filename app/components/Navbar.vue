<template>
  <div class="navbar bg-base-100 shadow-sm px-4">
    <div class="flex-1 flex items-center gap-2">
      <!-- Hamburger (Font Awesome) -->
      <label for="sidebar-toggle" class="btn btn-ghost btn-circle text-lg lg:hidden">
        <Icon name="mdi:menu" class="text-xl" />
      </label>

      <NuxtLink to="/" class="btn btn-ghost text-xl font-extrabold tracking-tight">TrueFare</NuxtLink>
    </div>
    
    <div v-if="user" class="flex-none gap-4 flex items-center">
      <div class="hidden sm:flex flex-col items-end text-sm">
        <span class="font-bold text-gray-700 dark:text-gray-300">{{ user.first_name }} {{ user.last_name }}</span>
        <span class="text-xs text-gray-500 uppercase">{{ user.role.replace('_', ' ') }}</span>
      </div>
      
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Icon name="mdi:account" class="text-blue-600 text-xl" />
          </div>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <a @click="handleLogout" class="text-red-500">
              <Icon name="mdi:logout" class="mr-2 text-lg" />
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth();

const handleLogout = async () => {
  await logout();
};
</script>
