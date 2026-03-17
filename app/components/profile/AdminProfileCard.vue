<template>
  <div
    v-if="show"
    class="fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto relative"
    >
      <button
        class="absolute right-4 top-4 btn btn-sm btn-circle z-10"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- HEADER -->
      <div
        class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex items-center gap-6"
      >
        <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 shrink-0">
          <Icon name="mdi:account-tie" class="text-4xl text-white" />
        </div>
        <div>
          <h2 class="text-2xl font-black uppercase tracking-tight">
            {{ editableAdmin.first_name }} {{ editableAdmin.last_name }}
          </h2>
          <p class="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">TODA Administrator</p>
        </div>
      </div>

      <!-- BODY -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">First Name</span></label>
          <input
            v-model="editableAdmin.first_name"
            class="input input-bordered w-full focus:input-primary"
          />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Last Name</span></label>
          <input
            v-model="editableAdmin.last_name"
            class="input input-bordered w-full focus:input-primary"
          />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Email</span></label>
          <input
            v-model="editableAdmin.email"
            class="input input-bordered w-full focus:input-primary"
          />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">TODA Association</span></label>
          <select
            v-model="editableAdmin.toda_id"
            class="select select-bordered w-full focus:select-primary"
          >
            <option value="" disabled>Select a TODA</option>
            <option v-for="toda in todas" :key="toda.id" :value="toda.id">
              {{ toda.name }} - {{ toda.barangay }}, {{ toda.city }}
            </option>
          </select>
        </div>

        <div class="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
          <p class="text-[10px] text-base-content/40 uppercase font-black mb-1 tracking-widest">Date Created</p>
          <p class="font-bold text-sm">
            {{ editableAdmin.date_created || "N/A" }}
          </p>
        </div>

        <div class="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
          <p class="text-[10px] text-base-content/40 uppercase font-black mb-1 tracking-widest">Last Updated</p>
          <p class="font-bold text-sm">
            {{ editableAdmin.date_updated || "N/A" }}
          </p>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="border-t border-base-content/5 p-5 flex justify-end gap-3 bg-base-200/30">
        <button class="btn btn-error btn-outline border-2 gap-2" @click="deleteAdmin">
          <Icon name="mdi:trash-can-outline" class="text-lg" />
          Delete
        </button>
        <button class="btn btn-primary px-8 gap-2" @click="saveAdmin">
          <Icon name="mdi:content-save" class="text-lg" />
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  show: Boolean,
  admin: Object,
});

const emit = defineEmits(["close", "updated"]);

const editableAdmin = reactive({});
const todas = ref([]);

/* =============================
   LOCK BACKGROUND SCROLL
============================= */
watch(() => props.show, (visible) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = visible ? 'hidden' : '';
    document.documentElement.style.overflow = visible ? 'hidden' : '';
  }
}, { immediate: true });

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
});

const fetchTodas = async () => {
  try {
    const response = await $fetch("/api/toda", {
      params: { limit: 'all' }
    });
    todas.value = response.results || [];
  } catch (error) {
    console.error("Failed to fetch TODAs:", error);
  }
};

onMounted(() => {
  fetchTodas();
});

watch(
  () => props.admin,
  (val) => {
    if (val) Object.assign(editableAdmin, val);
  },
  { immediate: true },
);

const saveAdmin = async () => {
  await $fetch(`/api/admin/${editableAdmin.id}`, {
    method: "POST",
    body: editableAdmin,
  });
  emit("updated");
  alert("Admin updated successfully!");
};

const deleteAdmin = async () => {
  await $fetch(`/api/admin/${editableAdmin.id}`, {
    method: "DELETE",
  });
  emit("updated");
  emit("close");
  alert("Admin deleted!");
};
</script>
