<template>
  <div key="super-admin-dashboard-root" class="p-6 space-y-8">
    <!-- Top Tabs -->
    <ClientOnly>
      <div class="tabs tabs-boxed mb-6">
        <button
          v-for="tab in availableTabs"
          :key="tab.id"
          class="tab"
          :class="{ 'tab-active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </ClientOnly>

    <!-- Content Area -->
    <div>
      <DashboardStats
        v-if="activeTab === 'dashboard'"
        ref="statsRef"
      />

      <TodaManager
        v-else-if="activeTab === 'todas'"
        @refresh-counts="refreshAllCounts"
      />

      <DriverManager
        v-else-if="activeTab === 'tricycles'"
        @refresh-counts="refreshAllCounts"
      />

      <FareManager
        v-else-if="activeTab === 'fares'"
      />

      <ReportManager
        v-else-if="activeTab === 'reports'"
      />

      <UserManager
        v-else-if="activeTab === 'users'"
        @refresh-counts="refreshAllCounts"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DashboardStats from "~/components/super-admin/DashboardStats.vue";
import TodaManager from "~/components/super-admin/TodaManager.vue";
import DriverManager from "~/components/super-admin/DriverManager.vue";
import ReportManager from "~/components/super-admin/ReportManager.vue";
import UserManager from "~/components/super-admin/UserManager.vue";
import FareManager from "~/components/super-admin/FareManager.vue";

const activeTab = useState("superadmin-active-tab", () => "dashboard");
const statsRef = ref(null);

const availableTabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'todas', label: 'TODAs' },
  { id: 'tricycles', label: 'Tricycles' },
  { id: 'fares', label: 'Fares' },
  { id: 'reports', label: 'Reports' },
  { id: 'users', label: 'Users' }
];

const refreshAllCounts = () => {
  if (statsRef.value) {
    statsRef.value.refresh();
  }
};
</script>
