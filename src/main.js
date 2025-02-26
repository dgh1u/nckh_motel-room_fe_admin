import { createApp } from "vue";
import App from "./App.vue";
import router from "./routers";
import Antd from "ant-design-vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import "ant-design-vue/dist/reset.css";
import "./style.css";

const app = createApp(App);
app.use(router);
app.use(Antd);
app.use(VueQueryPlugin);
app.mount("#app");
