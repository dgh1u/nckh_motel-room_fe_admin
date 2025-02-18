/* eslint-disable no-undef */
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    let localStorageData = window.localStorage.getItem("persist:web/user");
    if (localStorageData && typeof localStorageData === "string") {
      localStorageData = JSON.parse(localStorageData);
      const access_token = JSON.parse(localStorageData?.accessToken);
      config.headers = { Authorization: `Bearer ${access_token}` };
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response?.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error.response?.data;
  }
);

export default instance;
