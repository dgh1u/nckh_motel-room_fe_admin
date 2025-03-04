import { createApp } from "vue";
import App from "./App.vue";
import router from "./routers";
import Antd from "ant-design-vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import "ant-design-vue/dist/reset.css";
import "./style.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(Antd);
app.use(VueQueryPlugin);

app.mount("#app");
