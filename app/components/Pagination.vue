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
</script>
