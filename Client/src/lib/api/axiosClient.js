import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://cinera.onrender.com/api",
  withCredentials: true, // cookies only
});

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
