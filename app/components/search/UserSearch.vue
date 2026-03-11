<template>
  <div class="flex items-center gap-2 mb-6">
    <div class="relative flex-1 sm:max-w-md">
      <Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 text-xl" />
      <input
        v-model="query"
        @input="onSearch"
        type="text"
        placeholder="Search user by name or email..."
        class="input input-bordered w-full pl-12 rounded-2xl focus:input-primary"
      />
    </div>

    <button
      v-if="query"
      @click="clearSearch"
      class="btn btn-ghost btn-circle"
      title="Clear search"
    >
      <Icon name="mdi:close-circle" class="text-2xl text-base-content/30" />
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["search"]);

const query = ref("");

const onSearch = () => {
  emit("search", query.value);
};

const clearSearch = () => {
  query.value = "";
  emit("search", "");
};
</script>
