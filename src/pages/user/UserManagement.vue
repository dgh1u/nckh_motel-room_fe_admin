<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <!-- Khu vực tìm kiếm và lọc -->
      <div class="flex gap-4">
        <a-input
          v-model:value="searchText"
          placeholder=" Tìm kiếm ..."
          allowClear
          class="custom-search"
          @input="handleSearch"
        >
          <template #prefix>
            <SearchOutlined class="text-gray-200" />
          </template>
        </a-input>

        <!-- Bộ lọc trạng thái -->
        <a-select
          v-model:value="selectedStatus"
          placeholder="Lọc theo trạng thái"
          style="width: 200px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option :value="false">Hoạt động</a-select-option>
          <a-select-option :value="true">Bị khóa</a-select-option>
        </a-select>
      </div>

      <!-- Nút Thêm người dùng ở góc phải -->
      <a-button type="primary" @click="addUser"> Thêm người dùng </a-button>
    </div>

    <!-- Bảng danh sách người dùng -->
    <a-table
      :columns="columns"
      :data-source="users"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record, index }">
        <!-- STT -->
        <template v-if="column.key === 'stt'">
          {{ index + 1 + pagination.pageSize * (pagination.current - 1) }}
        </template>

        <!-- Trạng thái khóa -->
        <template v-if="column.key === 'block'">
          <a-tag :color="record.block ? 'red' : 'green'">
            {{ record.block ? "Bị khóa" : "Hoạt động" }}
          </a-tag>
        </template>

        <!-- Hành động -->
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="viewUser(record)">
            <template #icon><EyeOutlined /></template>
          </a-button>
          <a-button type="link" @click="editUser(record)">
            <template #icon><EditOutlined /></template>
          </a-button>
          <a-button type="link" danger @click="confirmDelete(record)">
            <template #icon><DeleteOutlined /></template>
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { getListUser } from "@/apis/userService";
import { message, Modal } from "ant-design-vue";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";

export default {
  components: {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
  },
  setup() {
    const users = ref([]);
    const loading = ref(false);
    const searchText = ref("");
    const selectedStatus = ref(null); // Trạng thái khóa/mở khóa
    const pagination = ref({ current: 1, pageSize: 6, total: 0 });
    const router = useRouter();

    // Cấu hình các cột cho bảng
    const columns = [
      { title: "STT", key: "stt" },
      { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Địa chỉ", dataIndex: "address", key: "address" },
      { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
      { title: "Trạng thái", dataIndex: "block", key: "block" },
      { title: "Hành động", key: "action", width: 140 },
    ];

    // Fetch danh sách người dùng từ API
    const fetchUsers = async () => {
      loading.value = true;
      try {
        const params = {
          start: Math.max(pagination.value.current - 1, 0), // Đảm bảo start không âm
          limit: pagination.value.pageSize, // Số lượng user trên mỗi trang
          keywords: searchText.value.trim(), // ✅ Tìm kiếm theo tên
          block: selectedStatus.value, // ✅ Lọc theo trạng thái
        };

        const res = await getListUser(params);

        if (res.data && res.data.items) {
          users.value = res.data.items;
          pagination.value.total = res.data.total || 0;
        } else {
          throw new Error("Dữ liệu API không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi API:", error);
        message.error(`Lỗi tải danh sách: ${error.message}`);
      }
      loading.value = false;
    };

    // Xử lý khi thay đổi phân trang
    const handleTableChange = (paginationObj) => {
      pagination.value.current = Math.max(paginationObj.current, 1);
      pagination.value.pageSize = paginationObj.pageSize;
      fetchUsers();
    };

    // ✅ Xử lý khi người dùng tìm kiếm
    const handleSearch = () => {
      pagination.value.current = 1; // Khi tìm kiếm, luôn về trang đầu tiên
      fetchUsers();
    };

    // ✅ Xử lý khi người dùng chọn trạng thái khóa/mở khóa
    const handleFilterChange = () => {
      pagination.value.current = 1; // Khi lọc, luôn về trang đầu tiên
      fetchUsers();
    };

    // ✅ Xem chi tiết người dùng
    const viewUser = (record) => {
      router.push(`/admin/user/view/${record.id}`);
    };

    // ✅ Điều hướng đến trang thêm người dùng
    const addUser = () => {
      router.push(`/admin/user/add`);
    };

    // Xử lý chỉnh sửa người dùng
    const editUser = (record) => {
      router.push(`/admin/user/edit/${record.id}`);
    };

    // Xác nhận và xóa người dùng
    const confirmDelete = (record) => {
      Modal.confirm({
        title: "Xóa người dùng",
        content: "Bạn có chắc chắn muốn xóa người dùng này?",
        okText: "Xóa",
        cancelText: "Hủy",
        async onOk() {
          try {
            await deleteUser(record.id);
            message.success("Xóa người dùng thành công");
            fetchUsers();
          } catch {
            message.error("Xóa thất bại");
          }
        },
      });
    };

    onMounted(fetchUsers);

    return {
      users,
      columns,
      loading,
      searchText,
      selectedStatus,
      pagination,
      fetchUsers,
      handleTableChange,
      handleSearch,
      handleFilterChange,
      editUser,
      confirmDelete,
      viewUser,
      addUser,
    };
  },
};
</script>
