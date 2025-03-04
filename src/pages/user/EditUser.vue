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
import { getUserById, updateUser } from "@/apis/userService";
import { message } from "ant-design-vue";

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
      phone: "",
      block: false,
      roleId: "",
    });

    const loading = ref(false);

    // Khi mở popup, tải dữ liệu từ API
    watch(
      () => props.open,
      async (newVal) => {
        console.log("Popup edit open:", newVal);
        if (newVal && props.userId) {
          console.log("Fetching user with ID:", props.userId);
          try {
            const response = await getUserById(props.userId);
            console.log("Fetched user data:", response);

            // Kiểm tra và lấy dữ liệu đúng từ API
            let responseData = response?.data || response?.result || response;

            console.log("Extracted User Data:", responseData);

            if (!responseData || !responseData.id) {
              console.error(
                "Error: User data does not contain an ID!",
                responseData
              );
              message.error("Lỗi: Dữ liệu API không hợp lệ!");
              return;
            }

            // ✅ Gán ID vào form để đảm bảo ID được gửi khi cập nhật
            userForm.value = { ...responseData };
          } catch (error) {
            console.error("Error fetching user data:", error);
            message.error("Không thể tải dữ liệu người dùng!");
          }
        }
      }
    );

    // Gửi request cập nhật người dùng
    const handleSubmit = async () => {
      console.log("Submitting update for user:", userForm.value);

      if (!userForm.value.id) {
        console.error("Error: User ID is missing!", userForm.value);
        message.error("Lỗi: ID người dùng không tồn tại!");
        return;
      }

      try {
        await updateUser(userForm.value);
        console.log("User updated successfully:", userForm.value);
        message.success("Cập nhật người dùng thành công!");
        emit("update:open", false);
        emit("user-updated");
      } catch (error) {
        console.error("Update user failed:", error);
        message.error("Cập nhật thất bại!");
      }
    };

    return {
      userForm,
      handleSubmit,
      loading,
      emit,
    };
  },
};
</script>

<style scoped>
/* Tiêu đề căn giữa */
.popup-header {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Chia form thành 2 cột */
.form-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.form-column {
  flex: 1;
}

/* Căn giữa nút Xác nhận */
.confirm-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
