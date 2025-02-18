<script setup>
import { ref, onMounted } from "vue";
import * as authService from "@/apis/authService";
import { useRouter } from "vue-router";

const token = ref(null);
const fullName = ref("");
const isAuthenticated = ref(false);
const router = useRouter();

const checkAuthentication = () => {
  const user = authService.getCurrentUser();
  if (user && user.token) {
    token.value = user.token;
    fullName.value = user.fullName || "Người dùng";
    isAuthenticated.value = true;
  } else {
    isAuthenticated.value = false;
    console.warn("Không tìm thấy token hoặc người dùng chưa đăng nhập.");
  }
};

// Logout function
const logout = () => {
  authService.logout(); // Xóa thông tin người dùng khỏi localStorage
  router.push("/login");
};

onMounted(() => {
  checkAuthentication();
});
</script>

<template>
  <div class="w-full max-w-4xl mx-auto p-4">
    <!-- Carousel -->
    <div class="relative w-full overflow-hidden rounded-lg shadow-lg">
      <div class="flex transition-transform duration-500 ease-in-out">
        <img
          class="w-full h-64 object-cover"
          src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          alt="Slide 1"
        />
        <img
          class="w-full h-64 object-cover"
          src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
          alt="Slide 2"
        />
        <img
          class="w-full h-64 object-cover"
          src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
          alt="Slide 3"
        />
      </div>
    </div>

    <!-- Authentication Card -->
    <div class="bg-white shadow-md rounded-lg p-6 mt-6">
      <h1 v-if="isAuthenticated" class="text-2xl font-bold text-gray-800">
        Chào mừng, {{ fullName }}
      </h1>
      <div v-if="token" class="mt-4">
        <p class="text-gray-700"><strong>JWT Token:</strong> {{ token }}</p>
      </div>
      <div v-else class="mt-4 text-gray-600">
        <p>Vui lòng đăng nhập để tiếp tục.</p>
      </div>
      <button
        v-if="isAuthenticated"
        @click="logout"
        class="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
      >
        Đăng xuất
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: 20px;
  text-align: center;
}
</style>
