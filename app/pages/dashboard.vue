<template>
  <div class="p-6 space-y-6">
    <!-- Top Tabs / Navbar -->
    <div class="tabs tabs-boxed mb-6">
      <a class="tab tab-active">Dashboard</a>
      <a class="tab">TODAs</a>
      <a class="tab">Tricycles</a>
      <a class="tab">Reports</a>
      <a class="tab">Users</a>
    </div>

    <!-- Stat Cards -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
    >
      <DashboardCard
        title="TODA Associations"
        value="6"
        icon="fa-solid fa-building"
        bgColor="bg-purple-700 text-white"
        textColor="text-purple-400"
      />

      <DashboardCard
        title="Total Tricycles"
        value="24"
        icon="fa-solid fa-bicycle"
        bgColor="bg-blue-700 text-white"
        textColor="text-blue-400"
      />

      <DashboardCard
        title="Total Trips"
        value="5"
        icon="fa-solid fa-chart-line"
        bgColor="bg-green-700 text-white"
        textColor="text-green-400"
      />

      <DashboardCard
        title="Total Reports"
        value="1"
        icon="fa-solid fa-triangle-exclamation"
        bgColor="bg-yellow-700 text-white"
        textColor="text-yellow-400"
        subText="1 pending"
      />

      <DashboardCard
        title="TODA Admins"
        value="1"
        icon="fa-solid fa-user-group"
        bgColor="bg-purple-900 text-white"
        textColor="text-purple-400"
      />
    </div>
  </div>
</template>

<script setup>
import DashboardCard from "~/components/DashboardCard.vue";
</script>
