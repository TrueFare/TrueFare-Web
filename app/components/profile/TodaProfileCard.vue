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
        class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex items-center gap-6"
      >
        <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 shrink-0">
          <Icon name="mdi:office-building" class="text-4xl text-white" />
        </div>
        <div>
          <h2 class="text-2xl font-black uppercase tracking-tight">
            TODA Profile
          </h2>
          <p class="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Manage transport association details</p>
        </div>
      </div>

      <!-- ================= BODY ================= -->
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">TODA Name</span></label>
            <input
              v-model="editableToda.name"
              class="input input-bordered w-full focus:input-primary"
              placeholder="Enter TODA name"
            />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Password</span></label>
            <div class="relative">
              <input
                v-model="editableToda.password"
                :type="showPassword ? 'text' : 'password'"
                class="input input-bordered w-full pr-12 focus:input-primary"
                placeholder="Enter password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
              >
                <Icon
                  :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                  class="text-base text-base-content/40"
                />
              </button>
            </div>
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Barangay</span></label>
            <input
              v-model="editableToda.barangay"
              class="input input-bordered w-full focus:input-primary"
              placeholder="Enter barangay"
            />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">City</span></label>
            <input
              v-model="editableToda.city"
              class="input input-bordered w-full focus:input-primary"
              placeholder="Enter city"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
            <p class="text-[10px] text-base-content/40 uppercase font-black mb-1 tracking-widest">Date Created</p>
            <p class="font-bold text-sm">
              {{ editableToda.date_created || "-" }}
            </p>
          </div>

          <div v-if="editableToda.date_updated" class="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
            <p class="text-[10px] text-base-content/40 uppercase font-black mb-1 tracking-widest">Last Updated</p>
            <p class="font-bold text-sm">
              {{ editableToda.date_updated }}
            </p>
          </div>
        </div>
      </div>

      <!-- ================= ACTIONS ================= -->
      <div
        class="border-t border-base-content/5 p-5 flex justify-end gap-3 flex-wrap bg-base-200/30"
      >
        <button
          class="btn btn-error btn-outline border-2 gap-2"
          :disabled="deleting || saving"
          @click="deleteToda"
        >
          <span
            v-if="deleting"
            class="loading loading-spinner loading-sm"
          ></span>
          <Icon v-else name="mdi:trash-can-outline" class="text-lg" />
          {{ deleting ? "Deleting..." : "Delete" }}
        </button>

        <button
          class="btn btn-primary px-8 gap-2"
          :disabled="saving || deleting"
          @click="saveToda"
        >
          <span v-if="saving" class="loading loading-spinner loading-sm"></span>

          <span class="flex items-center gap-2">
            <Icon v-if="!saving" name="mdi:content-save" class="text-lg" />
            {{ saving ? "Saving..." : "Save Changes" }}
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
const showPassword = ref(false);

/* =============================
   LOCK BACKGROUND SCROLL
============================= */
watch(
  () => props.show,
  (visible) => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = visible ? "hidden" : "";
      document.documentElement.style.overflow = visible ? "hidden" : "";
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }
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
