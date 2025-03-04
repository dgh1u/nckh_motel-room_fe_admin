import { defineStore } from "pinia";
import { loginUser, logoutUser } from "../apis/authService";
import { ref } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref(null);
    const token = ref("");
    const isAuthenticated = ref(false);

    //Đăng nhập
    const login = async (email, password) => {
      if (!email || !password) {
        return;
      }
      try {
        const response = await loginUser(email, password);

        // Nếu backend trả về lỗi nhưng không ném exception, kiểm tra tại đây
        if (!response || !response.token) {
          throw new Error("Email hoặc mật khẩu không chính xác");
        }

        // Nếu có token, cập nhật trạng thái đăng nhập
        user.value = response;
        token.value = response.token;
        isAuthenticated.value = true;

        return response;
      } catch (error) {
        // Kiểm tra xem có phản hồi từ BE không
        if (error.response) {
          console.error(error.response.data.message || "Đăng nhập thất bại.");
        } else {
          console.error("Lỗi kết nối hoặc lỗi không xác định:", error.message);
        }

        // Đảm bảo trạng thái không bị cập nhật khi lỗi xảy ra
        user.value = null;
        token.value = "";
        isAuthenticated.value = false;

        throw error;
      }
    };

    //Đăng xuất
    const logout = async () => {
      try {
        await logoutUser();
      } catch (error) {
        console.warn("Logout API failed, proceeding to clear session.");
      } finally {
        user.value = null;
        token.value = "";
        isAuthenticated.value = false;
        localStorage.removeItem("auth");
        console.log("User logged out successfully.");
      }
    };

    return { user, token, isAuthenticated, login, logout };
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: "auth",
          storage: localStorage,
          paths: ["token", "user", "isAuthenticated"],
        },
      ],
    },
  }
);
