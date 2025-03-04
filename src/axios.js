import axios from "axios";
import { useAuthStore } from "./stores/store";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add request interceptor để tự động thêm token vào request
instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor để xử lý lỗi và response
instance.interceptors.response.use(
  (response) => response?.data,
  (error) => Promise.reject(error.response?.data)
);

export default instance;
