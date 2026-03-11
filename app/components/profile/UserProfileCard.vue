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
        class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left"
      >
        <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
          <Icon name="mdi:account" class="text-4xl text-white" />
        </div>
        <div>
          <h2 class="text-2xl font-black uppercase tracking-tight">
            {{ editableUser.first_name }}
            {{ editableUser.last_name }}
          </h2>

          <h3 class="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Edit User Profile</h3>
        </div>
      </div>

      <!-- ================= BODY ================= -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">First Name</span></label>
          <input
            v-model="editableUser.first_name"
            class="input input-bordered w-full focus:input-primary"
          />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Last Name</span></label>
          <input
            v-model="editableUser.last_name"
            class="input input-bordered w-full focus:input-primary"
          />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Contact</span></label>
          <input
            v-model="editableUser.contact_number"
            class="input input-bordered w-full focus:input-primary"
          />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Email</span></label>
          <input
            v-model="editableUser.email"
            class="input input-bordered w-full focus:input-primary"
          />
        </div>

        <div class="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
          <p class="text-[10px] text-base-content/40 uppercase font-black mb-1 tracking-widest">Date Created</p>
          <p class="font-bold text-sm">
            {{ editableUser.date_created }}
          </p>
        </div>

        <div v-if="editableUser.date_updated" class="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
          <p class="text-[10px] text-base-content/40 uppercase font-black mb-1 tracking-widest">Last Updated</p>
          <p class="font-bold text-sm">
            {{ editableUser.date_updated }}
          </p>
        </div>
      </div>

      <!-- ================= ACTIONS ================= -->
      <div class="border-t border-base-content/5 p-5 flex justify-end gap-3 bg-base-200/30">
        <button
          class="btn btn-error btn-outline border-2"
          :disabled="deleting || saving"
          @click="deleteUser"
        >
          <span
            v-if="deleting"
            class="loading loading-spinner loading-sm"
          ></span>
          <Icon v-else name="mdi:trash-can-outline" class="text-lg" />
          {{ deleting ? "Deleting..." : "Delete" }}
        </button>

        <button
          class="btn btn-primary px-8"
          :disabled="saving"
          @click="saveUser"
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
  user: Object,
});

const emit = defineEmits(["close", "updated"]);

const editableUser = reactive({});
const saving = ref(false);
const deleting = ref(false);

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
   COPY USER DATA
============================= */
watch(
  () => props.user,
  (val) => {
    if (!val) return;

    Object.assign(editableUser, val);
  },
  { immediate: true },
);

/* =============================
   SAVE USER
============================= */
const saveUser = async () => {
  try {
    saving.value = true;

    const response = await $fetch(`/api/user/${editableUser.id}`, {
      method: "POST",
      body: editableUser,
    });

    Object.assign(editableUser, response.data);

    emit("updated");
    alert("User updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Update failed");
  } finally {
    saving.value = false;
  }
};

/* =============================
   DELETE user
============================= */
const deleteUser = async () => {
  if (
    !confirm(
      `Are you sure you want to delete user ${editableUser.first_name} ${editableUser.last_name}?`,
    )
  ) {
    return;
  }

  try {
    deleting.value = true;
    await $fetch(`/api/user/${editableUser.id}`, {
      method: "DELETE",
    });
    emit("updated");
    emit("close");
    alert("User deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  } finally {
    deleting.value = false;
  }
};
</script>
