<template>
  <div
    v-if="totalPages > 1"
    class="flex justify-center items-center gap-2 mt-6"
  >
    <!-- Previous -->
    <button
      class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
      :disabled="currentPage === 1"
      @click="$emit('update:page', currentPage - 1)"
    >
      Prev
    </button>

    <!-- Page Numbers -->
    <button
      v-for="page in totalPages"
      :key="page"
      class="px-3 py-1 rounded"
      :class="
        page === currentPage
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 dark:bg-gray-700'
      "
      @click="$emit('update:page', page)"
    >
      {{ page }}
    </button>

    <!-- Next -->
    <button
      class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
      :disabled="currentPage === totalPages"
      @click="$emit('update:page', currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: Number,
  totalItems: Number,
  perPage: {
    type: Number,
    default: 10,
  },
});

const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage));
</script>
