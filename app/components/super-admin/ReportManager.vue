<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white">Reports</h2>
      <button
        class="btn btn-outline btn-secondary"
        @click="exportToCsv('Reports_Log', ticketTableRef?.items || [])"
      >
        <Icon name="mdi:file-export" class="text-xl" />
        Export to CSV
      </button>
    </div>
    <TicketTable ref="ticketTableRef" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import TicketTable from "~/components/tables/TicketTable.vue";

const { exportToCsv } = useCsvExport();
const ticketTableRef = ref(null);
</script>
