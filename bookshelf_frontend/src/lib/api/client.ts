import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { API_URL } from "@/constants/config";
import type { ApiEnvelope } from "@/types/api";

let accessTokenGetter: (() => string | null | undefined) | null = null;

/**
 * Allow the auth layer (NextAuth session) to provide the current access token
 * without coupling the client to React.
 */
export function registerAccessTokenGetter(getter: () => string | null | undefined) {
  accessTokenGetter = getter;
}

let inMemoryToken: string | null = null;
export function setAccessToken(token: string | null) {
  inMemoryToken = token;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = accessTokenGetter?.() ?? inMemoryToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "Something went wrong. Please try again.";
    return Promise.reject(new ApiError(message, error.response?.status, error.response?.data?.errors));
  },
);

export class ApiError extends Error {
  status?: number;
  fieldErrors?: Record<string, unknown> | null;

  constructor(message: string, status?: number, fieldErrors?: Record<string, unknown> | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Unwrap the standard {success, data, ...} envelope. */
export async function unwrap<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const response = await promise;
  return response.data.data;
}
