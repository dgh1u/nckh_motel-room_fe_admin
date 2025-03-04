import axios from "@/axios";

export const getListUser = async (params) => {
  return axios({
    url: "/user",
    method: "GET",
    params,
  });
};

export const addUser = async (data) => {
  return axios({
    url: "/user",
    method: "POST",
    data,
  });
};

export const getUserById = (id) => {
  return axios({
    url: `/user/${id}`,
    method: "GET",
  });
};

export const deleteUser = async (id) => {
  return axios({
    url: `/user/${id}`,
    method: "DELETE",
  });
};

export const updateUser = async (data) => {
  return axios({
    url: "/user",
    method: "PUT",
    data,
  });
};
