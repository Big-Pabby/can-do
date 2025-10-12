import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { useAuthStore } from "~/store/auth";


// Create axios instance
const https: AxiosInstance = axios.create({
  baseURL: "https://app.candopeople.uk/", // dev API
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
https.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = useAuthStore().tokens?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
https.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized, redirecting...");
      // Example: redirect to login
    }
    return Promise.reject(error);
  }
);

export default https;
