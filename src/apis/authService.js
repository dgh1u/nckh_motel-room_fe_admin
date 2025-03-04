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
