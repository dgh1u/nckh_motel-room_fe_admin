import Login from "../pages/login/Login.vue";
import Logout from "../pages/logout/Logout.vue";

export default [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    meta: {
      requiresAuth: true,
    },
  },
];
