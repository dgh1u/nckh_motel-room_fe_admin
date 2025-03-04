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
      <h2>THÊM NGƯỜI DÙNG</h2>
    </div>

    <!-- Form nhập liệu -->
    <a-form :model="userForm" layout="vertical">
      <div class="form-container">
        <!-- Cột trái -->
        <div class="form-column">
          <a-form-item label="Email" name="email" required>
            <a-input v-model:value="userForm.email" />
          </a-form-item>

          <a-form-item label="Mật khẩu" name="password" required>
            <a-input-password v-model:value="userForm.password" />
          </a-form-item>

          <a-form-item label="Họ tên" name="fullName" required>
            <a-input v-model:value="userForm.fullName" />
          </a-form-item>
        </div>

        <!-- Cột phải -->
        <div class="form-column">
          <a-form-item label="Địa chỉ" name="address">
            <a-input v-model:value="userForm.address" />
          </a-form-item>

          <a-form-item label="Số điện thoại" name="phone" required>
            <a-input v-model:value="userForm.phone" />
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
        Xác nhận
      </a-button>
    </div>
  </a-modal>
</template>

<script>
import { ref, watch, defineProps, defineEmits } from "vue";
import { addUser } from "@/apis/userService";
import { message } from "ant-design-vue";

export default {
  props: {
    open: Boolean,
  },
  emits: ["update:open", "user-added"],
  setup(props, { emit }) {
    const userForm = ref({
      email: "",
      password: "",
      fullName: "",
      address: "",
      phone: "",
      roleId: "",
    });

    const loading = ref(false);

    // Reset form khi mở popup
    watch(
      () => props.open,
      (newVal) => {
        if (newVal) {
          userForm.value = {
            email: "",
            password: "",
            fullName: "",
            address: "",
            phone: "",
            roleId: "",
          };
        }
      }
    );

    const handleSubmit = async () => {
      if (
        !userForm.value.email ||
        !userForm.value.password ||
        !userForm.value.fullName ||
        !userForm.value.phone ||
        !userForm.value.roleId
      ) {
        message.warning("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      loading.value = true;
      try {
        await addUser(userForm.value);
        message.success("Thêm người dùng thành công!");
        emit("update:open", false);
        emit("user-added");
      } catch (error) {
        message.error("Thêm người dùng thất bại!");
      }
      loading.value = false;
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
