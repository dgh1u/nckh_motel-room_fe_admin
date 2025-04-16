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

    <!-- Phần hiển thị avatar -->
    <div class="flex justify-center mb-6">
      <div class="relative">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="Avatar"
          class="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
        />
        <div
          v-else
          class="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300"
        >
          <span class="text-gray-400 text-sm">No Image</span>
        </div>
      </div>
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
          <a-form-item label="Số dư tài khoản">
            <a-input
              :value="userDetail.balance"
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
import { ref, watch } from "vue";
import { getUserById, getAvatar } from "@/apis/userService";
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
    const avatarUrl = ref("");

    const fetchUserDetail = async () => {
      if (!props.userId) return;
      try {
        const userData = await getUserById(props.userId);
        if (!userData) {
          throw new Error("Không tìm thấy dữ liệu người dùng");
        }
        userDetail.value = userData;
        roleName.value = userData.role?.name || "Không có vai trò";

        // Lấy avatar
        try {
          const avatarRes = await getAvatar(props.userId);
          avatarUrl.value = `data:image/png;base64,${avatarRes.data}`;
        } catch (err) {
          avatarUrl.value = "";
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        message.error("Không thể tải dữ liệu người dùng!");
      }
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
      avatarUrl,
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
