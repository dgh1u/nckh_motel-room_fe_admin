<template>
  <a-modal
    :open="open"
    :footer="null"
    :width="700"
    centered
    @update:open="emit('update:open', $event)"
  >
    <!-- Tiêu đề popup -->
    <div class="popup-header">
      <h2>CẬP NHẬT NGƯỜI DÙNG</h2>
    </div>

    <!-- Form nhập liệu -->
    <a-form :model="userForm" layout="vertical">
      <!-- Trường ẩn chứa ID -->
      <input type="hidden" v-model="userForm.id" />

      <div class="form-container">
        <!-- Cột trái -->
        <div class="form-column">
          <a-form-item label="Email" name="email" required>
            <a-input v-model:value="userForm.email" />
          </a-form-item>

          <a-form-item label="Họ tên" name="fullName" required>
            <a-input v-model:value="userForm.fullName" />
          </a-form-item>

          <a-form-item label="Địa chỉ" name="address">
            <a-input v-model:value="userForm.address" />
          </a-form-item>
          <a-form-item label="Số dư tài khoản" name="balance">
            <a-input v-model:value="userForm.balance" />
          </a-form-item>
        </div>

        <!-- Cột phải -->
        <div class="form-column">
          <a-form-item label="Số điện thoại" name="phone" required>
            <a-input v-model:value="userForm.phone" />
          </a-form-item>

          <a-form-item label="Trạng thái khóa" name="block">
            <a-switch v-model:checked="userForm.block" />
          </a-form-item>

          <a-form-item label="Vai trò" name="roleId" required>
            <a-select
              v-model:value="userForm.roleId"
              placeholder="Chọn vai trò"
            >
              <a-select-option value="ADMIN">Admin</a-select-option>
              <a-select-option value="CUSTOMER">Khách hàng</a-select-option>
            </a-select>
          </a-form-item>
        </div>
      </div>

      <!-- Trường upload avatar (tuỳ chọn) -->
      <a-form-item label="Avatar">
        <div class="flex items-center space-x-4">
          <!-- Hiển thị ảnh hiện tại (nếu có) -->
          <div>
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Avatar"
              class="w-24 h-24 rounded-full object-cover border"
            />
            <div
              v-else
              class="w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300"
            >
              <span class="text-gray-400 text-sm">No Image</span>
            </div>
          </div>
          <!-- Nút chọn file -->
          <div>
            <label
              for="avatarInput"
              class="cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Chọn ảnh
            </label>
            <input
              id="avatarInput"
              type="file"
              class="hidden"
              @change="handleFileChange"
            />
          </div>
        </div>
      </a-form-item>
    </a-form>

    <!-- Nút Xác nhận căn giữa -->
    <div class="confirm-button">
      <a-button type="primary" @click="handleSubmit" :loading="loading">
        Cập nhật
      </a-button>
    </div>
  </a-modal>
</template>

<script>
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { getUserById, updateUser } from "@/apis/userService";
import { getAvatar, postAvatar } from "@/apis/userService";

export default {
  props: {
    open: Boolean,
    userId: Number,
  },
  emits: ["update:open", "user-updated"],
  setup(props, { emit }) {
    const userForm = ref({
      id: "",
      email: "",
      fullName: "",
      address: "",
      balance: "",
      phone: "",
      block: false,
      roleId: "",
    });

    // Lưu file đã chọn
    const selectedFile = ref(null);
    // URL hiển thị avatar (dạng base64)
    const avatarUrl = ref("");

    const loading = ref(false);

    // Lấy thông tin user & avatar khi mở popup
    watch(
      () => props.open,
      async (newVal) => {
        if (newVal && props.userId) {
          try {
            const response = await getUserById(props.userId);
            // Tuỳ vào backend trả về
            const responseData = response?.data || response?.result || response;
            userForm.value = { ...responseData };

            // Lấy avatar
            const avatarRes = await getAvatar(props.userId);
            // Giả sử BE trả về { data: "chuỗi base64" }
            avatarUrl.value = `data:image/png;base64,${avatarRes.data}`;
          } catch (error) {
            console.error("Error fetching user data:", error);
            message.error("Không thể tải dữ liệu người dùng!");
          }
        }
      }
    );

    // Khi người dùng chọn file
    const handleFileChange = (event) => {
      selectedFile.value = event.target.files[0] || null;
    };

    // Submit form (update thông tin + upload avatar nếu có)
    const handleSubmit = async () => {
      if (!userForm.value.id) {
        message.error("Lỗi: ID người dùng không tồn tại!");
        return;
      }

      loading.value = true;
      try {
        // Cập nhật thông tin user
        await updateUser(userForm.value);

        // Nếu có file được chọn thì upload avatar
        if (selectedFile.value) {
          await postAvatar(userForm.value.id, selectedFile.value);
        }

        message.success("Cập nhật người dùng thành công!");
        emit("update:open", false);
        emit("user-updated");
      } catch (error) {
        console.error("Update user failed:", error);
        message.error("Cập nhật thất bại!");
      } finally {
        loading.value = false;
      }
    };

    return {
      userForm,
      avatarUrl,
      selectedFile,
      handleFileChange,
      handleSubmit,
      loading,
      emit,
    };
  },
};
</script>

<style scoped>
.popup-header {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
.form-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.form-column {
  flex: 1;
}
.confirm-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
