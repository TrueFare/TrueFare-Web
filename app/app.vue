<script setup>
import Navbar from "~/components/Navbar.vue";
import Sidebar from "~/components/Sidebar.vue";
import Footer from "~/components/Footer.vue";
</script>

<template>
  <div class="drawer">
    <!-- Drawer Toggle -->
    <input id="sidebar-toggle" type="checkbox" class="drawer-toggle" />

    <!-- PAGE CONTENT -->
    <div class="drawer-content flex flex-col min-h-screen">
      <Navbar />

      <main class="flex-1 p-4">
        <NuxtPage />
      </main>

      <Footer />
    </div>

    <!-- SIDEBAR -->
    <div class="drawer-side z-400">
      <label for="sidebar-toggle" class="drawer-overlay"></label>
      <Sidebar />
    </div>
  </div>
</template>
