<template>
  <div class="flex h-screen bg-white">
    <!-- Sidebar -->
    <div class="w-64 h-full">
      <div
        class="h-full bg-white text-black flex flex-col shadow overflow-hidden"
      >
        <Sidebar />
      </div>
    </div>

    <!-- Nội dung chính -->
    <div class="flex flex-col flex-1">
      <!-- Header -->

      <Header />

      <!-- Nội dung trang  -->
      <div class="flex-1 overflow-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "../../components/sidebar/Sidebar.vue";
import Header from "../../components/header/Header.vue";
</script>
