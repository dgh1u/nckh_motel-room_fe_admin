<template>
  <div class="flex flex-col h-full">
    <!-- Logo -->
    <div class="flex items-center justify-center h-28 mt-4 mb-6">
      <svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white" />

        <image
          href="@/assets/vnua-logo.jpg"
          x="40"
          y="70"
          height="70"
          width="70"
        />

        <text
          x="65%"
          y="55%"
          font-family="Impact"
          font-size="41"
          fill="black"
          text-anchor="middle"
        >
          VNUA
        </text>
        <text
          x="65%"
          y="68%"
          font-family="'Peanut Butter', cursive"
          font-size="28"
          fill="black"
          text-anchor="middle"
        >
          Services
        </text>
      </svg>
    </div>

    <!-- Sidebar Menu -->
    <a-menu
      mode="inline"
      theme="light"
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
    >
      <!-- Các mục không có children -->
      <a-menu-item v-for="item in menuItemsWithoutChildren" :key="item.path">
        <router-link :to="item.path" class="flex items-center gap-3">
          <component :is="item.icon" class="w-4 h-4" />
          <span>{{ item.label }}</span>
        </router-link>
      </a-menu-item>

      <!-- Dropdown dạng Sidebar cho Bài Đăng -->
      <a-sub-menu key="post">
        <template #title>
          <span class="flex items-center gap-3">
            <FileText class="w-4 h-4" />
            <span>Bài đăng</span>
          </span>
        </template>
        <a-menu-item
          v-for="sub in menuItemsWithChildren[0].children"
          :key="sub.path"
        >
          <router-link :to="sub.path">{{ sub.label }}</router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Wallet, Users, FileText, ChartPie, Activity } from "lucide-vue-next";

const menuItems = [
  { label: "Tổng quan", path: "/home/dashboard", icon: ChartPie },
  { label: "Hoạt động", path: "/home/action", icon: Activity },
  { label: "Người dùng", path: "/home/user", icon: Users },
  {
    label: "Bài đăng",
    icon: FileText,
    children: [
      { label: "Nhà trọ", path: "/home/post/motel" },
      { label: "Cửa hàng", path: "/home/post/shop" },
      { label: "Giao hàng", path: "/home/post/delivery" },
    ],
  },
  { label: "Nạp tiền", path: "/home/recharge", icon: Wallet },
];

// Lọc menuItems thành 2 nhóm
const menuItemsWithoutChildren = computed(() =>
  menuItems.filter((item) => !item.children)
);
const menuItemsWithChildren = computed(() =>
  menuItems.filter((item) => item.children)
);

// Điều khiển trạng thái mở rộng của sidebar
const selectedKeys = ref(["dashboard"]);
const openKeys = ref(["post"]);
</script>
