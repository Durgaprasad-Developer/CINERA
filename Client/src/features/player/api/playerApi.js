import axiosClient from "../../../lib/api/axiosClient";

export const getSteamUrl = (id) => 
    axiosClient.get(`/stream/${id}`);

export const saveProgress = (data) => 
    axiosClient.post(`/user/history`, data);

export const trackEvent = (data) =>
    axiosClient.post(`/analytics/track`, data);