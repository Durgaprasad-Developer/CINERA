import axiosClient from "../../../lib/api/axiosClient";

// USER AUTH
export const loginApi = (data) =>
  axiosClient.post("/user/login", data);

export const signupApi = (data) =>
  axiosClient.post("/user/signup", data);

export const forgotPasswordApi = (data) =>
  axiosClient.post("/user/forgot-password", data);

export const resetPasswordApi = (data) =>
  axiosClient.post("/user/reset-password", data);

export const googleLoginApi = (token) =>
  axiosClient.post("/user/google", { token });

// PROFILE
export const getProfileApi = () =>
  axiosClient.get("/user/profile");
