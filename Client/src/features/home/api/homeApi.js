import axiosClient from "../../../lib/api/axiosClient";

export const getTrending = () =>
  axiosClient.get("/home/trending");

export const getPopular = () =>
  axiosClient.get("/home/popular");

export const getRecent = () =>
  axiosClient.get("/home/recent");

export const getByGenre = (genre) =>
  axiosClient.get(`/home/genre/${genre}`);

export const getContinueWatching = () =>
  axiosClient.get("/user/history/continue");

export const getRecommendations = () =>
  axiosClient.get("/recommendations/personal");

export const getBecauseYouWatched = () =>
  axiosClient.get("/recommendations/because");
