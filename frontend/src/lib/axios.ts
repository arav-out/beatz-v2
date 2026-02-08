import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
});

// Attach Clerk token automatically
axiosInstance.interceptors.request.use(async (config) => {
  // Clerk exposes auth on window
  const clerk = (window as any).Clerk;

  if (clerk) {
    const token = await clerk.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
