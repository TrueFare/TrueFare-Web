<template>
  <div
    v-if="show"
    class="fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-xl relative"
    >
      <button
        class="absolute right-4 top-4 btn btn-sm btn-circle"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- HEADER -->
      <div class="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white flex items-center gap-6">
        <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 shrink-0">
          <Icon name="mdi:shield-account" class="text-4xl text-white" />
        </div>
        <div>
          <h2 class="text-2xl font-black uppercase tracking-tight">
            {{ editableSuper.first_name }} {{ editableSuper.last_name }}
          </h2>
          <p class="text-xs font-bold uppercase tracking-widest opacity-80 mt-1 text-red-100">Super Administrator</p>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">First Name</span></label>
          <input
            v-model="editableSuper.first_name"
            class="input input-bordered w-full focus:input-error"
          />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Last Name</span></label>
          <input
            v-model="editableSuper.last_name"
            class="input input-bordered w-full focus:input-error"
          />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Email</span></label>
          <input
            v-model="editableSuper.email"
            class="input input-bordered w-full focus:input-error"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Date Created</span></label>
            <div class="bg-base-200/50 p-3 rounded-xl text-sm font-bold opacity-70">
              {{ new Date(editableSuper.date_created).toLocaleDateString() }}
            </div>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Date Updated</span></label>
            <div class="bg-base-200/50 p-3 rounded-xl text-sm font-bold opacity-70">
              {{ editableSuper.date_updated ? new Date(editableSuper.date_updated).toLocaleDateString() : 'Never' }}
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-base-content/5 p-5 flex justify-end gap-3 bg-base-200/30">
        <button class="btn btn-error btn-outline border-2 gap-2" @click="deleteSuper">
          <Icon name="mdi:trash-can-outline" class="text-lg" />
          Delete
        </button>
        <button class="btn btn-primary px-8 gap-2" @click="saveSuper">
          <Icon name="mdi:content-save" class="text-lg" />
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onUnmounted } from "vue";

const props = defineProps({
  show: Boolean,
  superAdmin: Object,
});

const emit = defineEmits(["close", "updated"]);

const editableSuper = reactive({});

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

watch(
  () => props.superAdmin,
  (val) => {
    if (val) Object.assign(editableSuper, val);
  },
  { immediate: true },
);

const saveSuper = async () => {
  await $fetch(`/api/super-admin/${editableSuper.id}`, {
    method: "POST",
    body: editableSuper,
  });
  emit("updated");
  emit("close");
  alert("Super Admin updated!");
};

const deleteSuper = async () => {
  await $fetch(`/api/super-admin/${editableSuper.id}`, {
    method: "DELETE",
  });
  emit("updated");
  emit("close");
  alert("Super Admin deleted!");
};
</script>
