<template>
  <section class="p-8 space-y-6 bg-[#F5F7FF] min-h-screen">
    <!-- Dòng đầu: Mô tả và bộ chọn -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Welcome {{ fullName }}</h1>
        <p class="text-gray-600 text-sm">
          Hệ thống đang hoạt động ổn định! Bạn có
          <span class="text-indigo-600 font-semibold">
            {{ pendingPostCount }} bài viết chưa duyệt!
          </span>
        </p>
      </div>

      <!-- Bộ chọn -->
      <div class="flex gap-4 flex-wrap items-center">
        <!-- Chọn năm -->
        <div>
          <select
            v-model="selectedYear"
            @change="fetchRevenueAndBuildData"
            class="bg-white rounded-xl p-2 text-sm"
          >
            <option v-for="y in availableYears" :key="y" :value="y">
              {{ y }}
            </option>
          </select>
        </div>
        <!-- Chế độ -->
        <div>
          <select
            v-model="groupMode"
            @change="fetchRevenueAndBuildData"
            class="bg-white rounded-xl p-2 text-sm"
          >
            <option value="year">Theo năm</option>
            <option value="month">Theo tháng</option>
          </select>
        </div>
        <!-- Tháng -->
        <div v-if="groupMode === 'month'">
          <select
            v-model="selectedMonth"
            @change="fetchRevenueAndBuildData"
            class="bg-white rounded-xl p-2 text-sm"
          >
            <option
              v-for="m in availableMonths"
              :key="m.value"
              :value="m.value"
            >
              {{ m.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Phần giữa: Hình minh họa và 4 box thống kê -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Desc image (trái) -->
      <div
        class="flex-1 bg-white shadow rounded-xl flex items-center justify-center"
      >
        <img
          src="@/assets/admin-dashboard-1.png"
          alt="Desc"
          class="object-contain rounded-lg"
        />
      </div>

      <!-- 4 Box thống kê (phải) -->
      <div class="flex-1 grid grid-cols-2 gap-10">
        <!-- Box: Total Users -->
        <div class="shadow rounded-xl p-4 flex flex-col bg-teal-100">
          <IconUsers class="w-8 h-8 text-blue-500 mb-2" />
          <span class="t font-semibold text-gray-600">Người dùng</span>
          <span class="text-2xl font-bold text-gray-800 mt-4">
            {{ summary?.totalUsers }}
          </span>
        </div>
        <!-- Box: Total Payments -->
        <div class="shadow rounded-xl p-4 flex flex-col bg-amber-100">
          <IconBanknote class="w-8 h-8 text-green-500 mb-2" />
          <span class="t font-semibold text-gray-600">Giao dịch</span>
          <span class="text-2xl font-bold text-gray-800 mt-4">
            {{ summary?.totalPayments }}
          </span>
        </div>
        <!-- Box: Total Posts -->
        <div class="bg-cyan-100 shadow rounded-xl p-4 flex flex-col">
          <IconFileText class="w-8 h-8 text-yellow-500 mb-2" />
          <span class="t font-semibold text-gray-600">Bài viết</span>
          <span class="text-2xl font-bold text-gray-800 mt-4">
            {{ summary?.totalPosts }}
          </span>
        </div>
        <!-- Box: Total Revenue -->
        <div class="bg-rose-100 shadow rounded-xl p-4 flex flex-col">
          <IconDollarSign class="w-8 h-8 text-indigo-500 mb-2" />
          <span class="t font-semibold text-gray-600">Doanh thu</span>
          <span class="text-2xl font-bold text-gray-800 mt-4">
            <!-- Sử dụng computed property để format số -->
            {{ formattedTotalRevenue }}₫
          </span>
        </div>
      </div>
    </div>

    <!-- Phần dưới: 2 biểu đồ, chia làm 2 cột -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Biểu đồ Doanh Thu (Line/Area Chart) -->
      <div class="flex-1 bg-white shadow rounded-xl p-6">
        <span class="text-xl font-bold text-gray-800 mb-4">Doanh Thu</span>
        <LineChart
          :chart-data="revenueChartData"
          :chart-options="revenueChartOptions"
          class="h-72"
        />
      </div>
      <!-- Biểu đồ Số Giao Dịch (Bar Chart) -->
      <div class="flex-1 bg-white shadow rounded-xl p-6">
        <span class="text-xl font-bold text-gray-800 mb-4">Giao Dịch</span>
        <BarChart
          :chart-data="transactionChartData"
          :chart-options="transactionChartOptions"
          class="h-72"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "@/axios";

// Lucide Icons
import {
  Users as IconUsers,
  Banknote as IconBanknote,
  FileText as IconFileText,
  DollarSign as IconDollarSign,
} from "lucide-vue-next";

// Chart.js + vue-chart-3
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { LineChart, BarChart } from "vue-chart-3";
import { getListPost } from "@/apis/postService";
import { useAuthStore } from "@/stores/store";

const pendingPostCount = ref(0);
const authStore = useAuthStore();
const fullName = computed(() => authStore.user?.fullName || "Người dùng");

// API Data
const summary = ref(null); // /api/dashboard/summary
const revenueData = ref([]); // /api/dashboard/revenue

// Group mode: 'year' or 'month'
const groupMode = ref("year");
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(1);

// Available years, months
const availableYears = ref([2023, 2024, 2025]);
const availableMonths = ref([
  { value: 1, label: "Tháng 1" },
  { value: 2, label: "Tháng 2" },
  { value: 3, label: "Tháng 3" },
  { value: 4, label: "Tháng 4" },
  { value: 5, label: "Tháng 5" },
  { value: 6, label: "Tháng 6" },
  { value: 7, label: "Tháng 7" },
  { value: 8, label: "Tháng 8" },
  { value: 9, label: "Tháng 9" },
  { value: 10, label: "Tháng 10" },
  { value: 11, label: "Tháng 11" },
  { value: 12, label: "Tháng 12" },
]);

async function fetchPendingPosts() {
  try {
    // Truyền params: approved = true và notApproved = true
    const res = await getListPost({ approved: true, notApproved: true });

    // Giả sử API trả về danh sách bài viết trong res.data
    pendingPostCount.value = res.data?.total || 0;
  } catch (error) {
    console.error("Lỗi khi lấy bài viết chưa duyệt:", error);
  }
}

// Computed property để format tổng doanh thu theo kiểu xx.xxx.xxx
const formattedTotalRevenue = computed(() => {
  console.log("Giá trị summary:", summary.value);
  if (summary.value && summary.value.totalRevenue != null) {
    const formatted = new Intl.NumberFormat("vi-VN").format(
      summary.value.totalRevenue
    );
    console.log("Giá trị formattedTotalRevenue:", formatted);
    return formatted;
  }
  return "";
});

// Biểu đồ Doanh Thu
const revenueChartData = ref({
  labels: [],
  datasets: [
    {
      label: "Doanh thu",
      data: [],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      tension: 0.4,
    },
  ],
});
const revenueChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

// Biểu đồ Số Giao Dịch
const transactionChartData = ref({
  labels: [],
  datasets: [
    {
      label: "Số Giao Dịch",
      data: [],
      backgroundColor: "rgba(135, 206, 250, 1)",
      borderWidth: 1,
      borderRadius: 8,
    },
  ],
});
const transactionChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

// Lifecycle
onMounted(async () => {
  await fetchSummary();
  await fetchRevenueAndBuildData();
  await fetchPendingPosts();
});

// Watch thay đổi
watch([groupMode, selectedYear, selectedMonth], async () => {
  await fetchRevenueAndBuildData();
});

// Gọi API summary
async function fetchSummary() {
  try {
    const res = await axios.get("/api/dashboard/summary");
    summary.value = res;
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
}

// Gọi API revenue
async function fetchRevenue() {
  let start = "",
    end = "",
    groupBy = "";
  if (groupMode.value === "year") {
    start = `${selectedYear.value}-01-01`;
    end = `${selectedYear.value}-12-31`;
    groupBy = "month";
  } else {
    // groupMode = "month"
    const lastDay = new Date(
      selectedYear.value,
      selectedMonth.value,
      0
    ).getDate();
    const monthStr =
      selectedMonth.value < 10
        ? "0" + selectedMonth.value
        : selectedMonth.value;
    start = `${selectedYear.value}-${monthStr}-01`;
    end = `${selectedYear.value}-${monthStr}-${lastDay}`;
    groupBy = "day";
  }
  try {
    const res = await axios.get("/api/dashboard/revenue", {
      params: { start, end, groupBy },
    });
    revenueData.value = res;
  } catch (error) {
    console.error("Error fetching revenue:", error);
  }
}

// Build chart data
async function fetchRevenueAndBuildData() {
  await fetchRevenue();
  buildChartData();
}

function buildChartData() {
  // Tạo expectedLabels
  let expectedLabels = [];
  if (groupMode.value === "year") {
    for (let i = 1; i <= 12; i++) {
      expectedLabels.push(i < 10 ? "0" + i : "" + i);
    }
  } else {
    // groupMode = "month"
    const lastDay = new Date(
      selectedYear.value,
      selectedMonth.value,
      0
    ).getDate();
    for (let i = 1; i <= lastDay; i++) {
      expectedLabels.push(i < 10 ? "0" + i : "" + i);
    }
  }

  // Tạo map các giá trị doanh thu và giao dịch dựa trên key
  let revenueMap = {};
  let transactionMap = {};
  revenueData.value.forEach((item) => {
    const rawKey = item.groupKey;
    let parsedKey = "";
    if (groupMode.value === "year") {
      // "2025-06" => "06"
      parsedKey = rawKey.split("-")[1];
    } else {
      // "2025-06-15" => "15"
      parsedKey = rawKey.split("-")[2];
    }
    revenueMap[parsedKey] = item.totalRevenue;
    transactionMap[parsedKey] = item.transactionCount;
  });

  const revenueSeries = expectedLabels.map((label) =>
    revenueMap[label] !== undefined ? revenueMap[label] : 0
  );
  const transactionSeries = expectedLabels.map((label) =>
    transactionMap[label] !== undefined ? transactionMap[label] : 0
  );

  // Cập nhật dữ liệu cho biểu đồ
  revenueChartData.value.labels = expectedLabels;
  revenueChartData.value.datasets[0].data = revenueSeries;

  transactionChartData.value.labels = expectedLabels;
  transactionChartData.value.datasets[0].data = transactionSeries;
}
</script>

<style scoped>
/* Ví dụ tùy biến Tailwind nếu cần:
.bg-white { background-color: #fff; }
.shadow { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
.rounded-xl { border-radius: 0.5rem; }
*/
</style>
