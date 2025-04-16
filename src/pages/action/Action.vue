<template>
  <div class="mx-auto">
    <!-- Thay thanh input userId -->
    <div class="flex items-center pt-6">
      <a-input
        v-model:value="filterUserId"
        placeholder="Nhập userId..."
        allowClear
        class="w-40 mx-20"
        @input="handleFilterChange"
      >
        <template #prefix>
          <Search class="w-4 h-4 text-gray-400" />
        </template>
      </a-input>
    </div>

    <div class="px-10 pt-6">
      <!-- Timeline -->
      <ul class="relative border-l border-gray-200">
        <li
          v-for="action in actions"
          :key="action.id"
          class="mb-8 ml-6 flex flex-col space-y-3"
        >
          <span
            class="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white"
            :class="actionColor(action.action)"
          >
            <component
              :is="actionIcon(action.action)"
              class="w-4 h-4 text-white"
            />
          </span>

          <div class="text-sm text-gray-500">
            {{ formatTime(action.time) }}
          </div>

          <p class="text-base">
            <template v-if="action.action === 'CREATE'">
              <strong>{{ action.fullName }}</strong> đã tạo bài đăng
              <span class="text-teal-500">{{ action.postTitle }}</span>
              (ID: <span class="text-amber-500">{{ action.postId }}</span
              >) đang chờ kiểm duyệt.
            </template>
            <template v-else-if="action.action === 'APPROVE'">
              <strong>ADMIN</strong> đã duyệt bài đăng
              <span class="text-teal-500">{{ action.postTitle }}</span>
              (ID: <span class="text-amber-500">{{ action.postId }}</span
              >).
            </template>
            <template v-else-if="action.action === 'BLOCK'">
              <strong>ADMIN</strong> đã khóa bài đăng
              <span class="text-teal-500">{{ action.postTitle }}</span>
              (ID: <span class="text-amber-500">{{ action.postId }}</span
              >).
            </template>
          </p>
        </li>
      </ul>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-center">
      <a-pagination
        :current="pagination.current"
        :pageSize="pagination.pageSize"
        :total="pagination.total"
        :showTotal="pagination.showTotal"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Search, PlusCircle, CheckCircle2, XCircle } from "lucide-vue-next";
import { getListAction } from "@/apis/actionService";
import { getPostsByUserId } from "@/apis/postService"; // <-- API lấy post theo userId

const actions = ref([]);
const filterUserId = ref("");

// Giữ pageSize <= 50
const pagination = ref({
  current: 1,
  pageSize: 5, // mặc định 5
  total: 0,
  showTotal: (total) => `Tổng cộng: ${total} bản ghi`,
});

const fetchActions = async () => {
  try {
    // Nếu chưa nhập userId, lấy tất cả action
    if (!filterUserId.value.trim()) {
      const params = {
        start: pagination.value.current - 1,
        limit: Math.min(pagination.value.pageSize, 50), // <= 50
      };
      const res = await getListAction(params);
      const result = res.data.data || res.data;
      actions.value = result.items;
      pagination.value.total = result.total;
    } else {
      // Lấy tất cả bài đăng của user => limit cũng <= 50
      const postRes = await getPostsByUserId(filterUserId.value.trim(), {
        start: 0,
        limit: 50,
      });
      const postData = postRes.data.data || postRes.data;
      const postItems = postData.items || [];

      // Gom mảng postId
      const postIds = postItems.map((p) => p.id);
      // Chuyển thành chuỗi CSV, vd: "39,38,29"
      const postIdsCsv = postIds.join(",");

      // Gọi getListAction với postIds kiểu CSV
      const actionParams = {
        start: pagination.value.current - 1,
        limit: Math.min(pagination.value.pageSize, 50),
        postIds: postIdsCsv, // "39,38,29"
      };
      const actionRes = await getListAction(actionParams);
      const actionResult = actionRes.data.data || actionRes.data;
      actions.value = actionResult.items;
      pagination.value.total = actionResult.total;
    }
  } catch (error) {
    console.error("fetchActions error:", error);
  }
};

const handleFilterChange = () => {
  pagination.value.current = 1;
  fetchActions();
};

const handlePageChange = (page) => {
  pagination.value.current = page;
  fetchActions();
};

const formatTime = (arr) => {
  if (!Array.isArray(arr) || arr.length !== 6) return "";
  const [y, m, d, hh, mm, ss] = arr;
  return (
    `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")} ` +
    `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(
      ss
    ).padStart(2, "0")}`
  );
};

const actionIcon = (type) => {
  return (
    {
      CREATE: PlusCircle,
      APPROVE: CheckCircle2,
      BLOCK: XCircle,
    }[type] || PlusCircle
  );
};

const actionColor = (type) => {
  return (
    {
      CREATE: "bg-blue-500",
      APPROVE: "bg-green-500",
      BLOCK: "bg-red-500",
    }[type] || "bg-gray-500"
  );
};

onMounted(fetchActions);
</script>

<style scoped>
/* Tất cả styling qua Tailwind */
</style>
