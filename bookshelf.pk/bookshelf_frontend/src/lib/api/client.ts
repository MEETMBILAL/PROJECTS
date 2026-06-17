import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { getSession } from "next-auth/react";

import { API_URL } from "@/constants/config";
import { getSessionId } from "@/lib/utils";
import type { ApiEnvelope } from "@/types/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      // Attach the anonymous cart session id for guest requests.
      config.headers.set("X-Session-Id", getSessionId());

      // Attach the JWT access token when the user is authenticated.
      const session = await getSession();
      const accessToken = (session as { accessToken?: string } | null)
        ?.accessToken;
      if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      }
    }
    return config;
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.detail ??
      error.message ??
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

/** Unwrap the standard `{ success, data }` envelope. */
export function unwrap<T>(envelope: ApiEnvelope<T>): T {
  return envelope.data;
}
