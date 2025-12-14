import axiosClient from "../../../lib/api/axiosClient";

// USER AUTH
export const loginApi = (data) =>
  axiosClient.post("/auth/login", data);

export const signupApi = (data) =>
  axiosClient.post("/auth/signup", data);

export const forgotPasswordApi = (data) =>
  axiosClient.post("/auth/forgot-password", data);

export const resetPasswordApi = (data) =>
  axiosClient.post("/auth/reset-password", data);

export const googleLoginApi = (token) =>
  axiosClient.post("/auth/google", { token });

// PROFILE
export const getProfileApi = () =>
  axiosClient.get("/user/profile");
