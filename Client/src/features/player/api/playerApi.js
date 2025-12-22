import axiosClient from "../../../lib/api/axiosClient";

export const getStreamUrl = (id) =>
  axiosClient.get(`/stream/${id}`);
