<script setup>
import Navbar from "~/components/Navbar.vue";
import Sidebar from "~/components/Sidebar.vue";
import Footer from "~/components/Footer.vue";

const route = useRoute();
const isPrintPage = computed(() => route.path.includes('/print/'));
const isAuthPage = computed(() => ['/login', '/'].includes(route.path));
</script>

<template>
  <div class="drawer" :class="{ 'bg-white': isPrintPage }">
    <!-- Drawer Toggle -->
    <input id="sidebar-toggle" type="checkbox" class="drawer-toggle" />

    <!-- PAGE CONTENT -->
    <div class="drawer-content flex flex-col min-h-screen">
      <template v-if="!isPrintPage && !isAuthPage">
        <Navbar />
      </template>

      <div class="flex-1">
        <NuxtPage />
      </div>

      <template v-if="!isPrintPage && !isAuthPage">
        <Footer />
      </template>
    </div>

    <!-- SIDEBAR -->
    <div class="drawer-side z-400">
      <label for="sidebar-toggle" class="drawer-overlay"></label>
      <template v-if="!isPrintPage && !isAuthPage">
        <Sidebar />
      </template>
    </div>
  </div>
</template>
