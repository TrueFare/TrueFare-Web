<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold mb-4">Users</h2>

    <button class="btn btn-primary" @click="showAddAdmin = true">
      <i class="fa-solid fa-plus mr-2"></i>
      Add Admin
    </button>

    <UserSearch @search="handleSearchUser" />

    <UserTable :users="paginatedUsers" @refresh="fetchUsers" />

    <Pagination
      v-model:page="userPage"
      :total-items="users.length"
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
import { ref, computed, onMounted } from "vue";
import UserTable from "~/components/tables/UserTable.vue";
import Pagination from "~/components/Pagination.vue";
import UserSearch from "~/components/search/UserSearch.vue";
import AddAdmin from "~/components/create/AddAdmin.vue";

const emits = defineEmits(['refresh-counts']);

const users = ref([]);
const fetchUsers = async () => {
  try {
    const response = await $fetch("/api/account");
    users.value = response.results || [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

const userPage = ref(1);
const perUserPage = 6;
const paginatedUsers = computed(() => {
  const start = (userPage.value - 1) * perUserPage;
  return users.value.slice(start, start + perUserPage);
});

const handleSearchUser = async (query) => {
  if (!query) {
    fetchUsers();
    return;
  }
  try {
    const response = await $fetch("/api/user/search", {
      params: { search: query },
    });
    users.value = response.results || response;
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
