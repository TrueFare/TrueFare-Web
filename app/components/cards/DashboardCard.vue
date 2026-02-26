<template>
  <div class="card bg-base-200 shadow-md p-4 w-full sm:w-56">
    <div class="flex items-center gap-4">
      <div
        class="icon w-10 h-10 flex items-center justify-center rounded-lg"
        :class="bgColor"
      >
        <i :class="icon" class="text-xl"></i>
      </div>
      <div>
        <p class="text-sm text-base-content/70">{{ title }}</p>
        <p class="text-2xl font-bold" :class="textColor">{{ value }}</p>
        <p v-if="subText" class="text-xs text-base-content/50">{{ subText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [Number, String],
  icon: String,
  bgColor: String, // Tailwind bg-* for icon
  textColor: String, // Tailwind text-* for value
  subText: String,
});
</script>
