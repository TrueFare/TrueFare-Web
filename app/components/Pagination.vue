<template>
  <div
    v-if="totalPages > 1"
    class="flex justify-center items-center gap-2 mt-6"
  >
    <!-- Previous -->
    <button
      class="btn btn-sm"
      :disabled="page === 1"
      @click="$emit('update:page', page - 1)"
    >
      Prev
    </button>

    <!-- Page Numbers -->
    <button
      v-for="p in totalPages"
      :key="p"
      class="btn btn-sm"
      :class="
        p === page
          ? 'btn-primary'
          : 'btn-ghost'
      "
      @click="$emit('update:page', p)"
    >
      {{ p }}
    </button>

    <!-- Next -->
    <button
      class="btn btn-sm"
      :disabled="page === totalPages"
      @click="$emit('update:page', page + 1)"
    >
      Next
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  perPage: {
    type: Number,
    default: 10,
  },
});

defineEmits(['update:page']);

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
