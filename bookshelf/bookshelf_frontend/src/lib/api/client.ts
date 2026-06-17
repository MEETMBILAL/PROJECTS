import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { getSession } from "next-auth/react";
import { API_URL } from "@/constants/config";
import type { ApiEnvelope } from "@/types/api";

/**
 * Shared Axios instance. The backend wraps every payload in an
 * `{ success, data, message, errors }` envelope; the response interceptor
 * unwraps `data` so callers receive the inner payload directly.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const session = await getSession();
      const token = (session as { accessToken?: string } | null)?.accessToken;
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "Something went wrong.";
    return Promise.reject(new Error(message));
  },
);

/** Unwrap the standard backend envelope and return the inner data. */
export async function unwrap<T>(promise: Promise<{ data: ApiEnvelope<T> }>) {
  const response = await promise;
  return response.data.data;
}
