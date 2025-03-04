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
      <h2>CHI TIẾT NGƯỜI DÙNG</h2>
    </div>

    <!-- Form hiển thị thông tin -->
    <a-form layout="vertical">
      <div class="form-container">
        <!-- Cột trái -->
        <div class="form-column">
          <a-form-item label="Email">
            <a-input :value="userDetail.email" disabled class="custom-input" />
          </a-form-item>

          <a-form-item label="Họ tên">
            <a-input
              :value="userDetail.fullName"
              disabled
              class="custom-input"
            />
          </a-form-item>

          <a-form-item label="Địa chỉ">
            <a-input
              :value="userDetail.address"
              disabled
              class="custom-input"
            />
          </a-form-item>
        </div>

        <!-- Cột phải -->
        <div class="form-column">
          <a-form-item label="Số điện thoại">
            <a-input :value="userDetail.phone" disabled class="custom-input" />
          </a-form-item>

          <a-form-item label="Vai trò">
            <a-tag
              :color="
                userDetail.role?.roleId === 'ADMIN'
                  ? 'red'
                  : userDetail.role?.roleId === 'EMPLOYEE'
                  ? 'green'
                  : userDetail.role?.roleId === 'CUSTOMER'
                  ? 'blue'
                  : 'gray'
              "
            >
              {{ roleName }}
            </a-tag>
          </a-form-item>

          <a-form-item label="Trạng thái">
            <a-tag :color="userDetail.block ? 'red' : 'green'">
              {{ userDetail.block ? "Bị khóa" : "Hoạt động" }}
            </a-tag>
          </a-form-item>
        </div>
      </div>
    </a-form>
  </a-modal>
</template>

<script>
import { ref, watch, defineProps, defineEmits } from "vue";
import { getUserById } from "@/apis/userService";
import { message } from "ant-design-vue";

export default {
  props: {
    open: Boolean,
    userId: Number,
  },
  emits: ["update:open"],
  setup(props, { emit }) {
    const userDetail = ref({});
    const roleName = ref("");

    const fetchUserDetail = async () => {
      if (!props.userId) return;
      try {
        const userData = await getUserById(props.userId);
        if (!userData) {
          throw new Error("Không tìm thấy dữ liệu người dùng");
        }
        userDetail.value = userData;
        roleName.value = userData.role?.name || "Không có vai trò";
      } catch (error) {}
    };

    // Khi mở popup, fetch dữ liệu
    watch(
      () => props.open,
      (newVal) => {
        if (newVal) fetchUserDetail();
      }
    );

    return {
      userDetail,
      roleName,
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

.custom-input {
  color: black !important;
}
</style>
