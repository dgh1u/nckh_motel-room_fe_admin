import axios from "@/http";

export const getListUser = async (params) => {
  return axios({
    url: "/user",
    method: "GET",
    params,
  });
};
