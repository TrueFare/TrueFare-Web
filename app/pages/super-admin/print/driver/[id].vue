<template>
  <div class="relative min-h-screen bg-gray-100 flex flex-col items-center overflow-x-hidden">
    <!-- FLOATING CONTROLS (NO PRINT) -->
    <div class="fixed bottom-8 right-8 z-50 flex gap-4 no-print">
      <button 
        class="btn btn-circle btn-lg btn-primary shadow-2xl hover:scale-110 transition-transform" 
        @click="handlePrint"
        title="Print ID Card"
      >
        <i class="fa-solid fa-print text-xl"></i>
      </button>
      <button 
        class="btn btn-circle btn-lg btn-ghost bg-white shadow-2xl hover:scale-110 transition-transform" 
        @click="goBack"
        title="Go Back"
      >
        <i class="fa-solid fa-arrow-left text-xl"></i>
      </button>
    </div>

    <!-- LOADING / ERROR STATES -->
    <div v-if="pending" class="flex flex-col items-center justify-center min-h-screen no-print">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen no-print p-10 text-center">
      <h1 class="text-2xl font-bold text-red-500">Error Loading Driver</h1>
      <button class="btn btn-primary mt-4" @click="goBack">Go Back</button>
    </div>

    <!-- A4 PRINT TARGET -->
    <div v-else class="print-target shadow-2xl bg-white overflow-hidden">
      <div class="w-full h-full flex flex-col p-12 text-center justify-between items-center">
        <!-- PHOTO & NAME -->
        <div class="flex flex-col items-center">
          <div class="w-[280px] h-[280px] rounded-full border-[8px] border-blue-600 shadow-lg overflow-hidden bg-gray-50 mb-6">
            <img 
              :src="`/api/driver/picture/${driver.id}`" 
              class="w-full h-full object-cover"
              alt="Profile Picture"
            />
          </div>
          <h1 class="text-6xl font-black uppercase tracking-tight text-gray-900 leading-tight">
            {{ driver.first_name }} {{ driver.last_name }}
          </h1>
        </div>

        <div class="w-3/4 h-1 bg-gray-100"></div>

        <!-- PLATE NUMBER -->
        <div class="w-full">
          <p class="text-2xl font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Plate Number</p>
          <p class="text-4xl font-black text-gray-900 leading-none font-mono tracking-tighter">
            {{ driver.plate_number }}
          </p>
        </div>

        <div class="w-3/4 h-1 bg-gray-100"></div>

        <!-- QR CODE -->
        <div class="flex flex-col items-center">
          <p class="text-2xl font-black text-gray-400 uppercase tracking-[0.5em] mb-6">Verification QR</p>
          <div class="p-6 bg-white border-2 border-gray-100 rounded-[2.5rem]">
            <img 
              :src="`/api/driver/qr/${driver.id}`" 
              class="w-[380px] h-[380px]"
              alt="Driver QR Code"
            />
          </div>
          <p class="text-2xl text-gray-400 mt-6 font-mono font-bold tracking-widest">
            TrueFare System | Driver ID #{{ driver.id }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const route = useRoute();
const router = useRouter();
const driverId = route.params.id;

const { data: driverRes, pending, error } = await useFetch(`/api/driver/${driverId}`);

const driver = computed(() => {
  const res = driverRes.value;
  return res?.results?.[0] || res?.[0] || res || null;
});

const handlePrint = () => {
  window.print();
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/super-admin/dashboard');
  }
};
</script>

<style scoped>
/* A4 Dimensions for Screen and Print */
.print-target {
  width: 210mm;
  height: 297mm;
  min-width: 210mm;
  min-height: 297mm;
  background-color: white;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }
  
  body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .no-print {
    display: none !important;
  }

  .print-target {
    width: 210mm !important;
    height: 297mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }

  /* Ensure background colors are printed */
  .bg-blue-700 { background-color: #1d4ed8 !important; -webkit-print-color-adjust: exact; }
  .bg-gray-50 { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; }
  .bg-white { background-color: #ffffff !important; -webkit-print-color-adjust: exact; }
}

/* Custom font scaling for the huge text */
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
