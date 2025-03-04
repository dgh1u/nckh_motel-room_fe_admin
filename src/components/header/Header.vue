<template>
  <div class="flex justify-between items-center w-full relative px-4">
    <!-- Hiển thị icon và tiêu đề trang bên trái -->
    <div class="flex items-center gap-3 text-2xl pt-3">
      <component :is="currentPageIcon" class="w-6 h-6 pb-0.5 text-gray-700" />
      <span>{{ currentPageTitle }}</span>
    </div>

    <!--  Thông tin người dùng bên phải -->
    <div class="flex items-center gap-4">
      <span class="text-gray-700 text-lg">{{ fullName }}</span>

      <!-- Dropdown Avatar -->
      <div class="relative">
        <div @click="toggleDropdown" class="cursor-pointer">
          <img
            v-if="currentUser?.avatar"
            :src="currentUser.avatar"
            alt="Avatar"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div
            v-else
            class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
          >
            <span class="text-gray-700">?</span>
          </div>
        </div>

        <!-- Dropdown Menu -->
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-46 bg-white border border-gray-200 rounded-lg shadow-lg p-2 py-2 space-y-1 z-50 isolate"
        >
          <button
            class="w-full flex items-center gap-2 px-2 py-2 text-left text-gray-700 rounded-lg transition hover:bg-gray-200"
          >
            <CircleUserRound class="w-5 h-5 pb-0.5 text-gray-600" />
            <span>Tài khoản</span>
          </button>

          <button
            @click="logout"
            class="w-full flex items-center gap-2 px-2 py-2 text-left text-red-600 rounded-lg transition hover:bg-red-200"
          >
            <LogOut class="w-5 h-5 pb-0.5 text-red-600" />
            <span class="text-red-600 font-semibold">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/store";
import {
  LogOut,
  CircleUserRound,
  Home,
  Users,
  Wallet,
  ChartPie,
  Activity,
  House,
  ShoppingBasket,
  Truck,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isDropdownOpen = ref(false);

const pageTitles = {
  "/home/dashboard": { title: "TỔNG QUAN", icon: ChartPie },
  "/home/action": { title: "HOẠT ĐỘNG", icon: Activity },
  "/home/user": { title: "NGƯỜI DÙNG", icon: Users },
  "/home/recharge": { title: "NẠP TIỀN", icon: Wallet },
  "/home/post/motel": { title: "BÀI ĐĂNG NHÀ TRỌ", icon: House },
  "/home/post/shop": { title: "BÀI ĐĂNG CỬA HÀNG", icon: ShoppingBasket },
  "/home/post/delivery": { title: "BÀI ĐĂNG GIAO HÀNG", icon: Truck },
};

//  Xác định trang hiện tại
const currentPageTitle = computed(
  () => pageTitles[route.path]?.title || "Trang chính"
);

//  Xác định icon trang hiện tại
const currentPageIcon = computed(() => pageTitles[route.path]?.icon || Home);

//  Lấy thông tin user từ Pinia (Cập nhật tự động khi đăng nhập)
const fullName = computed(() => authStore.user?.fullName || "Người dùng");
const currentUser = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);

//  Toggle dropdown menu
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

//  Logout
const logout = async () => {
  try {
    await authStore.logout();
    isDropdownOpen.value = false;

    // Kiểm tra nếu người dùng đã đăng xuất thành công
    if (!authStore.isAuthenticated) {
      router.push("/login");
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>
