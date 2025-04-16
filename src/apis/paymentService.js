import axios from "@/axios";

export const getListPayment = async (params) => {
  return axios({
    url: "/api/payment",
    method: "GET",
    params: params,
  });
};
