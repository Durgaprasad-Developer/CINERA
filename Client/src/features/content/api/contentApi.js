// features/content/api/contentApi.js
import axiosClient from "../../../lib/api/axiosClient";

export const getContentById = async (id) => {
  const res = await axiosClient.get(`/user/content/${id}`);
  return res.data.data;
};

export const getSimilarContent = async (id) => {
  const res = await axiosClient.get(
    `/recommendations/content/${id}/similar`
  );
  return res.data.data || [];
};
