import axiosClient from "../../../lib/api/axiosClient";

export const searchContent = async (query) => {
  if (!query) return { data: [] };

  const res = await axiosClient.get("/search", {
    params: { q: query },
  });

  return res.data;
};
