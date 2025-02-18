// Import các component cần thiết
import Login from "../pages/login/Login.vue";
import Logout from "../pages/logout/Logout.vue";

export default [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresAuth: false, // Không yêu cầu đăng nhập
    },
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    meta: {
      requiresAuth: true, // Chỉ dành cho người dùng đã đăng nhập
    },
  },
];
