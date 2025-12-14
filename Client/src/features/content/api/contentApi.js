import axiosClient from "../../../lib/api/axiosClient";

export const getContentById = (id) =>
  axiosClient.get(`/content/${id}`);

export const getSimilarContent = (id) =>
  axiosClient.get(`/recommendations/content/${id}/similar`);
