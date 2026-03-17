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
      <DashboardStats v-if="activeTab === 'dashboard'" ref="statsRef" />

      <TodaManager
        v-else-if="activeTab === 'todas'"
        @refresh-counts="refreshAllCounts"
      />

      <ReportManager v-else-if="activeTab === 'reports'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DashboardStats from "~/components/admin/DashboardStats.vue";
import TodaManager from "~/components/admin/TodaManager.vue";
import ReportManager from "~/components/admin/ReportManager.vue";

const activeTab = useState("admin-active-tab", () => "dashboard");
const statsRef = ref(null);

const availableTabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "todas", label: "TODA Members" },
  { id: "reports", label: "Reports" },
];

const refreshAllCounts = () => {
  if (statsRef.value) {
    statsRef.value.refresh();
  }
};
</script>
