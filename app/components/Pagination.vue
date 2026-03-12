<template>
  <div v-if="totalPages > 1" class="flex justify-center mt-8">
    <div class="join shadow-sm border border-base-200 bg-base-100 rounded-xl overflow-hidden">
      <!-- PREVIOUS -->
      <button
        class="join-item btn btn-md btn-ghost hover:bg-base-200 text-base-content/60 disabled:bg-transparent disabled:text-base-content/20"
        :disabled="page === 1"
        @click="changePage(page - 1)"
      >
        <Icon name="mdi:chevron-left" class="text-xl" />
      </button>

      <!-- PAGE NUMBERS -->
      <template v-for="(p, index) in visiblePages" :key="index">
        <button
          v-if="p !== '...'"
          class="join-item btn btn-md min-w-[3rem]"
          :class="[
            p === page 
              ? 'btn-primary no-animation text-white font-black' 
              : 'btn-ghost hover:bg-base-200 font-bold text-base-content/60'
          ]"
          @click="changePage(p)"
        >
          {{ p }}
        </button>
        <button
          v-else
          class="join-item btn btn-md btn-ghost no-animation cursor-default text-base-content/30 font-black"
        >
          ...
        </button>
      </template>

      <!-- NEXT -->
      <button
        class="join-item btn btn-md btn-ghost hover:bg-base-200 text-base-content/60 disabled:bg-transparent disabled:text-base-content/20"
        :disabled="page === totalPages"
        @click="changePage(page + 1)"
      >
        <Icon name="mdi:chevron-right" class="text-xl" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  page: {
    type: Number,
    required: true,
    default: 1
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0
  },
  perPage: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["update:page"]);

const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage));

const visiblePages = computed(() => {
  const current = props.page;
  const last = totalPages.value;
  const delta = 1; // Number of pages to show before and after current
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
});

const changePage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    emit("update:page", p);
    // Smooth scroll to top when changing page
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};
</script>

<style scoped>
.join-item:focus {
  outline: none;
}
</style>
