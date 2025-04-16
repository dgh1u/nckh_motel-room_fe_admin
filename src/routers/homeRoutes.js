import Home from "../pages/home/Home.vue";
import NotFound from "../pages/not-found/NotFound.vue";
import User from "../pages/user/UserManagement.vue";
import Dashboard from "../pages/dashboard/Dashboard.vue";
import Action from "../pages/action/Action.vue";

// Import các loại bài đăng
import ShopPost from "../pages/post/ShopPost.vue";
import DeliveryPost from "../pages/post/deliveryPost.vue";
import MotelManagement from "../pages/post/motel/MotelManagement.vue";
import PaymentManagement from "../pages/payment/PaymentManagement.vue";

export default [
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: "payment",
        name: "PaymentManagement",
        component: PaymentManagement,
        meta: { requiresAuth: false },
      },
      {
        path: "user",
        name: "User",
        component: User,
        meta: { requiresAuth: false },
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { requiresAuth: false },
      },
      {
        path: "action",
        name: "Action",
        component: Action,
        meta: { requiresAuth: false },
      },
      {
        path: "post/motel",
        name: "MotelPost",
        component: MotelManagement,
        meta: { requiresAuth: false },
      },
      {
        path: "post/shop",
        name: "ShopPost",
        component: ShopPost,
        meta: { requiresAuth: false },
      },
      {
        path: "post/delivery",
        name: "DeliveryPost",
        component: DeliveryPost,
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: "/not-found",
    name: "NotFound",
    component: NotFound,
    meta: { requiresAuth: false },
  },
];
