import axiosClient from "../../../lib/api/axiosClient";

export const likeContent = (contentId) => 
    axiosClient.post("/user/favorites", { contentId });

export const unlikeContent = (contentId) => 
    axiosClient.delete(`/user/favorites/${contentId}`);

export const getLikes = () => 
    axiosClient.get("/user/favorites/likes");

export const addToFavorites = (contentId) =>
    axiosClient.post("/user/favorites/favorite", {contentId});

export const removeFromFavorites = (contentId) => 
    axiosClient.delete(`/user/favorites/favorite/${contentId}`);

export const getFavorites = () => 
    axiosClient.get("/user/favorites");