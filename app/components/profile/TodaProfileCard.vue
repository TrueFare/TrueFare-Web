<template>
  <div
    v-if="show"
    class="fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <!-- MODAL -->
    <div
      class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto relative"
    >
      <!-- CLOSE -->
      <button
        class="absolute right-4 top-4 btn btn-sm btn-circle z-10"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- ================= HEADER ================= -->
      <div
        class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white"
      >
        <h2 class="text-2xl font-bold flex items-center gap-3">
          <i class="fa-solid fa-building"></i>
          TODA Profile
        </h2>
        <p class="text-purple-100 mt-1">Edit TODA details below</p>
      </div>

      <!-- ================= BODY ================= -->
      <div class="p-6 space-y-4">
        <div>
          <p class="text-gray-400 text-sm">TODA Name</p>
          <input
            v-model="editableToda.name"
            class="input input-bordered w-full"
            placeholder="Enter TODA name"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Password</p>
          <input
            v-model="editableToda.password"
            type="password"
            class="input input-bordered w-full"
            placeholder="Enter password"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">Barangay</p>
          <input
            v-model="editableToda.barangay"
            class="input input-bordered w-full"
            placeholder="Enter barangay"
          />
        </div>

        <div>
          <p class="text-gray-400 text-sm">City</p>
          <input
            v-model="editableToda.city"
            class="input input-bordered w-full"
            placeholder="Enter city"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-400 text-sm">Date Created</p>
            <p class="font-semibold">
              {{ editableToda.date_created || "-" }}
            </p>
          </div>

          <div v-if="editableToda.date_updated">
            <p class="text-gray-400 text-sm">Last Updated</p>
            <p class="font-semibold">
              {{ editableToda.date_updated }}
            </p>
          </div>
        </div>
      </div>

      <!-- ================= ACTIONS ================= -->
      <div
        class="border-t dark:border-gray-700 p-5 flex justify-end gap-3 flex-wrap"
      >
        <button
          class="btn btn-error"
          :disabled="deleting || saving"
          @click="deleteToda"
        >
          <span
            v-if="deleting"
            class="loading loading-spinner loading-sm"
          ></span>
          <i v-else class="fa-solid fa-trash"></i>
          {{ deleting ? "Deleting..." : "Delete" }}
        </button>

        <button
          class="btn btn-primary flex items-center gap-2"
          :disabled="saving || deleting"
          @click="saveToda"
        >
          <span v-if="saving" class="loading loading-spinner loading-sm"></span>

          <span>
            {{ saving ? "Saving..." : "💾 Save" }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onUnmounted } from "vue";

const props = defineProps({
  show: Boolean,
  toda: Object,
});

const emit = defineEmits(["close", "updated"]);

const editableToda = reactive({});
const saving = ref(false);
const deleting = ref(false);

/* =============================
   LOCK BACKGROUND SCROLL
============================= */
watch(
  () => props.show,
  (visible) => {
    document.body.style.overflow = visible ? "hidden" : "";
    document.documentElement.style.overflow = visible ? "hidden" : "";
  },
  { immediate: true },
);

onUnmounted(() => {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
});

/* =============================
   COPY TODA DATA
============================= */
watch(
  () => props.toda,
  (val) => {
    if (!val) return;
    Object.assign(editableToda, val);
  },
  { immediate: true },
);

/* =============================
   SAVE TODA
============================= */
const saveToda = async () => {
  // Validate required fields
  if (!editableToda.name?.trim()) {
    alert("TODA name is required");
    return;
  }
  if (!editableToda.password?.trim()) {
    alert("Password is required");
    return;
  }
  if (!editableToda.barangay?.trim()) {
    alert("Barangay is required");
    return;
  }
  if (!editableToda.city?.trim()) {
    alert("City is required");
    return;
  }

  try {
    saving.value = true;

    const response = await $fetch(`/api/toda/${editableToda.id}`, {
      method: "POST",
      body: {
        name: editableToda.name,
        password: editableToda.password,
        barangay: editableToda.barangay,
        city: editableToda.city,
      },
    });

    Object.assign(editableToda, response.data);

    emit("updated");
    alert("TODA updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Update failed: " + (err.data?.message || err.message));
  } finally {
    saving.value = false;
  }
};

/* =============================
   DELETE TODA
============================= */
const deleteToda = async () => {
  if (
    !confirm(
      `Are you sure you want to delete TODA "${editableToda.name}"? This action cannot be undone.`,
    )
  ) {
    return;
  }

  try {
    deleting.value = true;
    await $fetch(`/api/toda/${editableToda.id}`, {
      method: "DELETE",
    });
    emit("updated");
    emit("close");
    alert("TODA deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Delete failed: " + (err.data?.message || err.message));
  } finally {
    deleting.value = false;
  }
};
</script>
