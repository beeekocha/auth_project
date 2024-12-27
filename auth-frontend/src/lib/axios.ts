import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { TOKEN_KEY, BASE_URL, getValueFromLocalStorage } from "./utils";
import { navigate } from "@/features/common/useNavigateInterceptor";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getValueFromLocalStorage(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      navigate("/signin");
    }
    return Promise.reject(error);
  }
);
