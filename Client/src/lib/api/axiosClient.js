import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://cinera.onrender.com",
  withCredentials: true,
});

// Inject JWT token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("cinera_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 auto logout
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cinera_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
