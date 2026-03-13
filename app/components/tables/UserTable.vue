<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center p-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else>
      <!-- DESKTOP TABLE -->
      <div
        class="hidden sm:block bg-base-100 rounded-2xl shadow border border-base-200 overflow-x-auto"
      >
        <table class="table table-zebra w-full">
          <!-- TABLE HEADER -->
          <thead class="bg-base-200 text-base-content/70">
            <tr class="border-none uppercase text-[10px] tracking-widest font-black">
              <th class="px-6 py-4">User Name</th>
              <th class="px-6 py-4">Contact No.</th>
              <th class="px-6 py-4">Date Created</th>
              <th class="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="users.length === 0">
              <td colspan="4" class="text-center py-12 text-base-content/30 italic font-medium">
                No users available.
              </td>
            </tr>

            <tr
              v-for="user in users"
              :key="user.id"
              @click="openProfile(user)"
              class="cursor-pointer transition duration-150 hover:bg-base-200/50 border-base-200"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-base-200 rounded-full flex items-center justify-center font-black text-sm text-base-content/40 border border-base-content/5">
                    {{ user.first_name[0] }}{{ user.last_name[0] }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-base-content">{{ user.first_name }} {{ user.last_name }}</span>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-medium text-primary">{{ user.email || "No Email" }}</span>
                      <div
                        class="badge badge-xs font-bold uppercase text-[7px] tracking-widest py-2"
                        :class="roleClassBadge(user.role)"
                      >
                        {{ formatRole(user.role) }}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-base-content/70">{{ user.contact_number || '-' }}</td>
              <td class="px-6 py-4 text-xs font-bold uppercase text-base-content/30 tracking-tight">{{ user.date_created }}</td>
              <td class="px-6 py-4 text-center">
                <button
                  class="btn btn-ghost btn-xs text-primary font-black uppercase tracking-widest"
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
          class="card bg-base-100 shadow-md p-5 border border-base-200"
          @click="openProfile(user)"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-base-200 rounded-full flex items-center justify-center font-black text-sm text-base-content/40 border border-base-content/5"
              >
                {{ user.first_name[0] }}{{ user.last_name[0] }}
              </div>
              <div>
                <p class="font-bold text-base-content leading-tight">
                  {{ user.first_name }} {{ user.last_name }}
                </p>
                <p class="text-[10px] font-medium text-primary">
                  {{ user.email || "No Email" }}
                </p>
              </div>
            </div>
            <div
              class="badge badge-sm font-bold uppercase text-[8px] tracking-widest"
              :class="roleClassBadge(user.role)"
            >
              {{ formatRole(user.role) }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 border-t border-base-content/5 pt-4">
            <div>
              <p class="text-[9px] font-black uppercase tracking-widest text-base-content/40 mb-0.5">Contact</p>
              <p class="font-bold text-sm">{{ user.contact_number || '-' }}</p>
            </div>
            <div>
              <p class="text-[9px] font-black uppercase tracking-widest text-base-content/40 mb-0.5">Joined</p>
              <p class="font-bold text-[10px]">{{ user.date_created }}</p>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-if="users.length === 0" class="flex flex-col items-center justify-center py-12 gap-3 text-base-content/30">
          <Icon name="mdi:account-off" class="text-5xl" />
          <p class="text-sm font-bold uppercase tracking-widest">No users available.</p>
        </div>
      </div>
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
  loading: {
    type: Boolean,
    default: false,
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

const roleClassBadge = (role) => {
  switch (role) {
    case "super_admin":
      return "badge-error text-white";
    case "admin":
      return "bg-purple-500 text-white border-purple-500";
    default:
      return "badge-primary badge-outline";
  }
};

const formatRole = (role) => {
  if (!role) return "User";
  return role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>
