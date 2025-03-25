import axios from "@/axios";

// Lấy tất cả bài viết
export const getListAction = async (params) => {
  return axios({
    url: "/api/actions",
    method: "GET",
    params: params,
  });
};
