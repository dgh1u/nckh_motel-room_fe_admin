import { defineStore } from "pinia";
import { loginUser, logoutUser, getAvatar } from "../apis/authService";
import { ref } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref(null);
    const token = ref("");
    const isAuthenticated = ref(false);
    // Biến lưu avatar dưới dạng chuỗi base64 hoặc URL
    const avatar = ref("");

    // Đăng nhập: gọi loginUser, sau đó gọi getAvatar để lấy avatar từ API
    const login = async (email, password) => {
      if (!email || !password) {
        return;
      }
      try {
        const response = await loginUser(email, password);
        if (!response || !response.token) {
          throw new Error("Email hoặc mật khẩu không chính xác");
        }

        // Cập nhật thông tin người dùng
        user.value = response;
        token.value = response.token;
        isAuthenticated.value = true;

        // Gọi API getAvatar để lấy avatar từ server và cập nhật store
        const avatarRes = await getAvatar();
        avatar.value = `data:image/png;base64,${avatarRes.data}`;

        return response;
      } catch (error) {
        if (error.response) {
          console.error(error.response.data.message || "Đăng nhập thất bại.");
        } else {
          console.error("Lỗi kết nối hoặc lỗi không xác định:", error.message);
        }
        user.value = null;
        token.value = "";
        isAuthenticated.value = false;
        throw error;
      }
    };

    // Đăng xuất
    const logout = async () => {
      try {
        await logoutUser();
      } catch (error) {
        console.warn("Logout API failed, proceeding to clear session.");
      } finally {
        user.value = null;
        token.value = "";
        isAuthenticated.value = false;
        avatar.value = ""; // reset avatar khi đăng xuất
        localStorage.removeItem("auth");
        console.log("User logged out successfully.");
      }
    };

    // Hàm cập nhật avatar trong store (nếu cần update sau này)
    const setAvatar = (newAvatar) => {
      avatar.value = newAvatar;
    };

    return { user, token, isAuthenticated, avatar, login, logout, setAvatar };
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: "auth",
          storage: localStorage,
          paths: ["token", "user", "isAuthenticated", "avatar"],
        },
      ],
    },
  }
);
