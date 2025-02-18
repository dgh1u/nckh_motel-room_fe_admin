<template>
  <div
    class="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"
  >
    <h1 class="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">
      404
    </h1>
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">
      Trang bạn đang tìm kiếm không tồn tại.
    </p>
    <RouterLink
      to="/home"
      class="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
    >
      Quay lại trang chủ
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
