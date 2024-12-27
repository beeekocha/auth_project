export const TOKEN_KEY = "token";
export const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const getValueFromLocalStorage = (key: string): string | null => localStorage.getItem(key);

export const setToken = (token: string): void =>
  localStorage.setItem("token", token);

export const removeToken = (): void => localStorage.removeItem("token");