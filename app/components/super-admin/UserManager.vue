<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold mb-4">Users</h2>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <button class="btn btn-primary" @click="showAddAdmin = true">
        <Icon name="mdi:plus" class="text-xl" />
        Add Admin
      </button>

      <button
        class="btn btn-outline btn-secondary"
        :disabled="!users.length"
        @click="exportToCsv('Users_List', users)"
      >
        <Icon name="mdi:file-export" class="text-xl" />
        Export to CSV
      </button>
    </div>

    <UserSearch @search="handleSearchUser" />

    <UserTable :users="users" :loading="loading" @refresh="fetchUsers" />

    <Pagination
      v-model:page="userPage"
      :total-items="totalUsers"
      :per-page="perUserPage"
    />
    <AddAdmin
      :show="showAddAdmin"
      @close="showAddAdmin = false"
      @created="onAdminCreated"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import UserTable from "~/components/tables/UserTable.vue";
import Pagination from "~/components/Pagination.vue";
import UserSearch from "~/components/search/UserSearch.vue";
import AddAdmin from "~/components/create/AddAdmin.vue";

const { exportToCsv } = useCsvExport();
const emits = defineEmits(['refresh-counts']);

const users = ref([]);
const totalUsers = ref(0);
const userPage = ref(1);
const perUserPage = 6;
const loading = ref(false);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await $fetch("/api/account", {
      params: {
        page: userPage.value,
        limit: perUserPage
      }
    });
    users.value = response.results || [];
    totalUsers.value = response.total || 0;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    loading.value = false;
  }
};

watch(userPage, () => {
  fetchUsers();
});

const handleSearchUser = async (query) => {
  if (!query) {
    userPage.value = 1;
    fetchUsers();
    return;
  }
  try {
    const response = await $fetch("/api/user/search", {
      params: { search: query },
    });
    users.value = response.results || response;
    totalUsers.value = users.value.length;
    userPage.value = 1;
  } catch (error) {
    console.error("Failed to search user:", error);
  }
};

const showAddAdmin = ref(false);

const onAdminCreated = () => {
  fetchUsers();
  emits('refresh-counts');
}

onMounted(() => {
  fetchUsers();
});
</script>
