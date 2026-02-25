<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center">
    <div
      class="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center"
    >
      <!-- Left Content -->
      <div>
        <!-- System Name (Primary Highlight) -->
        <h1
          class="text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
        >
          TrueFare
        </h1>

        <!-- Supporting Tagline -->
        <h2
          class="mt-6 text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300 leading-snug"
        >
          Tricycle Operations, Managed Properly.
        </h2>

        <!-- Description -->
        <p
          class="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
        >
          A centralized regulatory platform for overseeing TODA associations,
          managing fare structures, monitoring trip data, and ensuring
          compliance across the transport network.
        </p>

        <!-- CTA -->
        <div class="mt-10">
          <NuxtLink
            to="/super-admin/dashboard"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900"
          >
            <i class="fa-solid fa-arrow-right"></i>
            Enter Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Right Accent Panel -->
      <div class="hidden md:block">
        <div
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-10"
        >
          <div class="space-y-6 text-gray-700 dark:text-gray-300">
            <div class="flex items-center gap-4">
              <i class="fa-solid fa-building text-gray-500"></i>
              <span>Manage TODA Associations</span>
            </div>

            <div class="flex items-center gap-4">
              <i class="fa-solid fa-users text-gray-500"></i>
              <span>Track Registered Drivers</span>
            </div>

            <div class="flex items-center gap-4">
              <i class="fa-solid fa-chart-line text-gray-500"></i>
              <span>Monitor Trip Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
