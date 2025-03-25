import axios from "@/axios";

// Lấy tất cả bài viết
export const getListPost = async (params) => {
  return axios({
    url: "/api/posts",
    method: "GET",
    params: params,
  });
};

// Lấy chi tiết 1 bài viết
export const getDetailPost = async (id) => {
  return axios({
    url: `api/post/${id}`,
    method: "GET",
  });
};

// Lấy danh sách tin đăng của một người dùng theo userId
export const getPostsByUserId = async (idUser, params) => {
  return axios({
    url: `/api/posts/${idUser}`,
    method: "GET",
    params: params,
  });
};

// Tạo bài đăng mới
export const createPost = async (data) => {
  return axios({
    url: `/api/post`,
    method: "POST",
    data,
  });
};

// Cập nhật bài đăng
export const updatePost = async (id, data) => {
  return axios({
    url: `/api/post/${id}`,
    method: "PUT",
    data,
  });
};

// Duyệt/Khóa một bài đăng (Admin only)
export const approvePost = async (id, bool) => {
  return axios({
    url: `/api/post/${id}/approve/${bool}`,
    method: "PUT",
  });
};

// Xóa bài đăng (Admin only)
export const deletePost = async (id) => {
  return axios({
    url: `/api/post/${id}`,
    method: "DELETE",
  });
};
