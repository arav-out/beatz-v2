import axios from "axios";
import { useAuthToken } from "@/stores/useAuthTokenstore";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthToken.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
