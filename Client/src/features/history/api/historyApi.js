import axiosClient from "../../../lib/api/axiosClient";

export const getProgressForContent = async (contentId) => {
  const res = await axiosClient.get(`/user/history/${contentId}`);
  return res.data;
};

export const saveProgress = async (contentId, lastWatchedSeconds, totalDuration) => {
  const res = await axiosClient.post("/user/history", {
    content_id: contentId,
    last_watched_seconds: Math.floor(lastWatchedSeconds),
    total_duration: Math.floor(totalDuration || 0),
  });
  return res.data;
};
