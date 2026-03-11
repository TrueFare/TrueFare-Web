<template>
  <footer class="footer footer-center p-4 bg-base-200 text-base-content">
    <aside>
      <p>© {{ year }} TrueFare. All rights reserved.</p>
    </aside>
  </footer>
</template>

<script setup>
const year = useState("current-year", () => new Date().getFullYear());
</script>
