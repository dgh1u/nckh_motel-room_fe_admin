<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-t from-sky-200 to-sky-100"
  >
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-2xl">
      <!-- Logo -->
      <div class="flex justify-center mb-4 gap-x-4">
        <img
          src="@/assets/logo-admin.png"
          alt="Logo"
          class="w-12 h-14 object-contain"
        />
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        ĐĂNG NHẬP
      </h2>
      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400 focus:shadow-md focus:shadow-blue-200 outline-none transition duration-300"
            @input="clearError('email')"
            required
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div class="mb-4 relative">
          <label for="password" class="block text-gray-700 font-medium mb-2"
            >Mật khẩu</label
          >
          <div class="relative w-full">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400 focus:shadow-md focus:shadow-blue-200 outline-none transition duration-300"
              @input="clearError('password')"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center"
              @click="togglePasswordVisibility"
            >
              <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A9.956 9.956 0 0112 19c-5.523 0-10-4.477-10-10 0-1.482.319-2.885.875-4.125M21.125 9.175A9.956 9.956 0 0122 12c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.125-.875M3 3l18 18"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">
            {{ errors.password }}
          </p>
        </div>

        <!-- General Error -->
        <p v-if="generalError" class="text-red-500 text-center text-sm mb-4">
          {{ generalError }}
        </p>

        <!-- Button -->
        <div class="mt-6">
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
          >
            <span v-if="loading" class="loader"></span>
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/store"; // Import Pinia store

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errors = ref({});
const generalError = ref("");
const router = useRouter();
const authStore = useAuthStore();

const validateInput = () => {
  errors.value = {};

  if (!email.value) {
    errors.value.email = "Email không được để trống.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = "Email không đúng định dạng.";
  }

  if (!password.value) {
    errors.value.password = "Mật khẩu không được để trống.";
  } else if (password.value.length < 6 || password.value.length > 15) {
    errors.value.password = "Mật khẩu phải từ 6-15 kí tự.";
  }

  return Object.keys(errors.value).length === 0;
};

const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = "";
  }
  generalError.value = "";
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  loading.value = true;
  generalError.value = "";

  if (!validateInput()) {
    loading.value = false;
    return;
  }

  try {
    await authStore.login(email.value, password.value);
    router.push("/home/dashboard");
  } catch (err) {
    generalError.value = err?.message || "Đăng nhập thất bại!";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import "@/style.css";
</style>
