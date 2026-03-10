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
      <Navbar v-if="!isPrintPage && !isAuthPage" />

      <main class="flex-1">
        <NuxtPage />
      </main>

      <Footer v-if="!isPrintPage && !isAuthPage" />
    </div>

    <!-- SIDEBAR -->
    <div v-if="!isPrintPage && !isAuthPage" class="drawer-side z-400">
      <label for="sidebar-toggle" class="drawer-overlay"></label>
      <Sidebar />
    </div>
  </div>
</template>
