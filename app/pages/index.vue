<template>
  <div class="index-landing" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:12px;">
    <h1>Choose Dashboard</h1>
    <div style="display:flex;gap:12px;">
      <NuxtLink to="/super-admin" class="btn">Super Admin</NuxtLink>
      <NuxtLink to="/admin" class="btn">Admin</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Intentionally empty: no role checks until role system is implemented
</script>

<style>
</style>