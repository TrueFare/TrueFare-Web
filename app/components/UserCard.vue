<template>
  <div
    class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
  >
    <div class="card-body">
      <!-- Top Section -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="avatar placeholder">
            <div class="bg-primary text-primary-content rounded-full w-12">
              <span class="text-lg font-semibold">
                {{ initials }}
              </span>
            </div>
          </div>

          <div>
            <h2 class="card-title text-base-content">
              {{ fullName }}
            </h2>
            <p class="text-sm text-base-content/60">
              {{ email }}
            </p>
          </div>
        </div>

        <!-- Status Badge -->
        <div>
          <span class="badge" :class="statusClass">
            {{ status }}
          </span>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider my-2"></div>

      <!-- Details -->
      <div class="space-y-1 text-sm">
        <p class="flex items-center gap-2">
          <Icon name="mdi:phone" />
          <span>{{ contact_number || "No contact number" }}</span>
        </p>

        <p class="flex items-center gap-2">
          <Icon name="mdi:calendar" />
          <span>Joined: {{ formattedDate }}</span>
        </p>
      </div>

      <!-- Actions -->
      <div class="card-actions justify-end mt-4">
        <button class="btn btn-sm btn-outline btn-primary">
          <Icon name="mdi:pencil" />
          Edit
        </button>

        <button class="btn btn-sm btn-outline btn-error">
          <Icon name="mdi:delete" />
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "#components";

interface Props {
  first_name: string;
  last_name: string;
  email: string;
  contact_number?: string | null;
  status?: string;
  date_created?: string;
}

const props = defineProps<Props>();

/* =========================
   Computed Properties
========================= */

const fullName = computed(() => {
  return `${props.first_name} ${props.last_name}`;
});

const initials = computed(() => {
  return (
    props.first_name.charAt(0).toUpperCase() +
    props.last_name.charAt(0).toUpperCase()
  );
});

const status = computed(() => {
  return props.status || "Active";
});

const statusClass = computed(() => {
  return status.value === "Active" ? "badge-success" : "badge-error";
});

const formattedDate = computed(() => {
  if (!props.date_created) return "—";
  return new Date(props.date_created).toLocaleDateString();
});
</script>
