<template>
  <div class="p-4 pt-12">
    <AddUser v-model:open="showAddUserPopup" @user-added="fetchUsers" />
    <UserDetail v-model:open="showUserDetailPopup" :userId="selectedUserId" />
    <EditUser
      v-model:open="showEditUserPopup"
      :userId="selectedUserId"
      @user-updated="fetchUsers"
    />
    <div class="flex items-center justify-between mb-4">
      <!-- Khu vực tìm kiếm và lọc -->
      <div class="flex gap-4">
        <a-input
          v-model:value="searchText"
          placeholder="Nhập Họ tên..."
          allowClear
          style="width: 300px"
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
          style="width: 100px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option :value="'false'">Hoạt động</a-select-option>
          <a-select-option :value="'true'">Bị khóa</a-select-option>
        </a-select>
        <!-- Bộ lọc vai trò -->
        <a-select
          v-model:value="selectedRole"
          placeholder="Lọc theo vai trò"
          style="width: 120px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option value="ADMIN">Admin</a-select-option>
          <a-select-option value="CUSTOMER">Khách hàng</a-select-option>
          <a-select-option value="EMPLOYEE">Nhân viên</a-select-option>
        </a-select>
      </div>

      <!-- Nút Thêm người dùng ở góc phải -->
      <a-button type="primary" @click="openAddUserPopup">
        Thêm người dùng
      </a-button>
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

        <!-- Vai trò -->

        <template v-if="column.key === 'role'">
          <span
            :style="{
              color:
                record.role?.roleId === 'ADMIN'
                  ? 'red'
                  : record.role?.roleId === 'EMPLOYEE'
                  ? 'green'
                  : 'blue',
              fontWeight: 'bold',
            }"
          >
            {{ record.role?.name || "Không có vai trò" }}
          </span>
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
          <a-button type="link" @click="openEditUserPopup(record)">
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
import { deleteUser, getListUser } from "@/apis/userService";
import { message, Modal } from "ant-design-vue";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import AddUser from "./AddUser.vue";
import UserDetail from "./UserDetail.vue";
import EditUser from "./EditUser.vue";

export default {
  components: {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    AddUser,
    UserDetail,
    EditUser,
  },
  setup() {
    const users = ref([]);
    const loading = ref(false);
    const searchText = ref("");
    const selectedStatus = ref(null);
    const selectedRole = ref(null);
    const pagination = ref({
      current: 1,
      pageSize: 6,
      total: 0,
      showTotal: (total, range) => `Tổng cộng: ${total} bản ghi`,
    });
    const router = useRouter();
    const showAddUserPopup = ref(false);
    const showUserDetailPopup = ref(false);
    const showEditUserPopup = ref(false);

    const selectedUserId = ref(null);

    const openAddUserPopup = () => {
      showAddUserPopup.value = true;
    };
    const closeAddUserPopup = () => {
      showAddUserPopup.value = false;
    };

    const openEditUserPopup = (record) => {
      selectedUserId.value = record.id;
      showEditUserPopup.value = true;
    };

    // Cấu hình các cột cho bảng
    const columns = [
      { title: "STT", key: "stt" },
      { title: "ID", dataIndex: "id", key: "id" },
      { title: "Họ tên", dataIndex: "fullName", key: "fullName" },

      { title: "Vai trò", key: "role" },
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
          start: Math.max(pagination.value.current - 1, 0),
          limit: pagination.value.pageSize,
          keywords: searchText.value.trim(),
          block: selectedStatus.value,
          roleId: selectedRole.value,
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

    //  Xử lý khi người dùng tìm kiếm
    const handleSearch = () => {
      pagination.value.current = 1;
      fetchUsers();
    };

    const handleFilterChange = () => {
      pagination.value.current = 1;
      fetchUsers();
    };

    const viewUser = (record) => {
      selectedUserId.value = record.id;
      showUserDetailPopup.value = true;
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
      selectedRole,
      pagination,
      fetchUsers,
      handleTableChange,
      handleSearch,
      handleFilterChange,
      confirmDelete,
      viewUser,
      showAddUserPopup,
      openAddUserPopup,
      closeAddUserPopup,
      showUserDetailPopup,
      selectedUserId,
      showEditUserPopup,
      openEditUserPopup,
    };
  },
};
</script>
<style scoped>
.ant-pagination .ant-pagination-total-text {
  float: left;
}
</style>
