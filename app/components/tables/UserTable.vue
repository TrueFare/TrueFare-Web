<template>
  <!-- DESKTOP TABLE -->
  <div
    class="hidden sm:block bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-200 dark:border-gray-800 overflow-x-auto"
  >
    <table class="w-full text-sm">
      <!-- TABLE HEADER -->
      <thead
        class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 sticky top-0 z-10"
      >
        <tr>
          <th class="px-6 py-4 text-left font-semibold">User Name</th>
          <th class="px-6 py-4 text-left font-semibold">Contact No.</th>
          <th class="px-6 py-4 text-left font-semibold">Date Created</th>
          <th class="px-6 py-4 text-center font-semibold">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="users.length === 0">
          <td colspan="5" class="text-center py-12 text-gray-400">
            No users available.
          </td>
        </tr>

        <tr
          v-for="(user, index) in users"
          :key="user.id"
          @click="openProfile(user)"
          class="cursor-pointer border-t dark:border-gray-800 transition duration-150 hover:bg-gray-50 dark:hover:bg-gray-800"
          :class="
            index % 2 === 0
              ? 'bg-white dark:bg-gray-900'
              : 'bg-gray-50 dark:bg-gray-800'
          "
        >
          <td class="px-6 py-4">
            <div class="flex flex-col">
              <span class="font-semibold"
                >{{ user.first_name }} {{ user.last_name }}</span
              >
              <span class="text-xs text-blue-600 font-medium">{{
                user.email || "No Email"
              }}</span>
              <!-- ROLE CAPSULE -->
              <span
                class="inline-flex items-center px-2 py-[2px] text-[10px] font-semibold leading-none rounded-full w-fit max-w-max"
                :class="roleClass(user.role)"
              >
                {{ formatRole(user.role) }}
              </span>
            </div>
          </td>
          <td class="px-6 py-4">{{ user.contact_number }}</td>
          <td class="px-6 py-4 text-gray-500">{{ user.date_created }}</td>
          <td class="px-6 py-4 text-center">
            <button
              class="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
              @click.stop="openProfile(user)"
            >
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- MOBILE CARDS -->
  <div class="sm:hidden flex flex-col gap-4">
    <div
      v-for="user in users"
      :key="user.id"
      class="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-200 dark:border-gray-800 p-4"
    >
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-semibold">
              {{ user.first_name }} {{ user.last_name }}
            </p>
            <p class="text-xs text-blue-600 font-medium">
              {{ user.email || "No Email" }}
            </p>
            <span
              class="px-3 py-1 text-xs font-semibold rounded-full"
              :class="roleClass(user.role)"
            >
              {{ formatRole(user.role) }}
            </span>
          </div>
          <button
            class="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
            @click.stop="openProfile(user)"
          >
            View
          </button>
        </div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="users.length === 0" class="text-center py-12 text-gray-400">
      No users available.
    </div>
  </div>

  <!-- USER PROFILE MODAL -->
  <!-- USER -->
  <UserProfileCard
    v-if="selectedUser?.role === 'user'"
    :show="showProfile"
    :user="selectedUser"
    @close="closeProfile"
    @updated="refreshUsers"
  />

  <!-- ADMIN -->
  <AdminProfileCard
    v-if="selectedUser?.role === 'admin'"
    :show="showProfile"
    :admin="selectedUser"
    @close="closeProfile"
    @updated="refreshUsers"
  />

  <!-- SUPER ADMIN -->
  <SuperAdminProfileCard
    v-if="selectedUser?.role === 'super_admin'"
    :show="showProfile"
    :superAdmin="selectedUser"
    @close="closeProfile"
    @updated="refreshUsers"
  />
</template>

<script setup>
import { ref } from "vue";
import UserProfileCard from "~/components/profile/UserProfileCard.vue";
import AdminProfileCard from "~/components/profile/AdminProfileCard.vue";
import SuperAdminProfileCard from "~/components/profile/SuperAdminProfileCard.vue";

defineProps({
  users: {
    type: Array,
    required: true,
  },
});

const selectedUser = ref(null);
const showProfile = ref(false);

const openProfile = (user) => {
  selectedUser.value = user;
  showProfile.value = true;
};

const closeProfile = () => {
  showProfile.value = false;
  selectedUser.value = null;
};

const emit = defineEmits(["refresh"]);
const refreshUsers = () => {
  emit("refresh");
};

const roleClass = (role) => {
  switch (role) {
    case "super_admin":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    case "admin":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
  }
};

const formatRole = (role) => {
  if (!role) return "User";
  return role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>
