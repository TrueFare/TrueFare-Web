<template>
  <div class="card bg-base-200 shadow-md p-4 w-full sm:w-56">
    <div class="flex items-center gap-4">
      <div
        class="w-12 h-12 flex items-center justify-center rounded-xl shadow-inner"
        :class="bgColor"
      >
        <Icon :name="icon" class="text-2xl" />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-base-content/60">{{ title }}</p>
        <p class="text-2xl font-black" :class="textColor">{{ value }}</p>
        <p v-if="subText" class="text-[10px] font-bold text-base-content/40 mt-0.5">{{ subText }}</p>
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
