import axios from "@/axios";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post("/auth/login", { email, password });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {};

// Lấy token từ localStorage (key = "auth")
const getToken = () => {
  const authData = localStorage.getItem("auth");
  return authData ? JSON.parse(authData)?.user?.token : null;
};

// Lấy thông tin hồ sơ
export const getProfile = async () => {
  const token = getToken();
  return axios({
    url: "/auth/profile",
    method: "GET",
  });
};

// Cập nhật hồ sơ
export const updateProfile = async (data) => {
  const token = getToken();
  return axios({
    url: "/auth/profile",
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};

// Lấy avatar
export const getAvatar = async (id) => {
  if (!id) {
    const profileRes = await getProfile();
    id = profileRes.data.id;
  }
  return axios({
    url: `/user/${id}/avatar`,
    method: "GET",
  });
};

// Cập nhật avatar
export const postAvatar = async (id, avatarFile) => {
  if (!id) {
    const profileRes = await getProfile();
    id = profileRes.data.id;
  }
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  return axios({
    url: `/user/${id}/avatar`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
