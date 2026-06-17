import { apiClient } from "./client";
import type { ApiResponse, Address, User } from "@/types";
import type { RegisterInput } from "@/lib/validations";

export interface AuthResult {
  user: User;
  access: string;
  refresh: string;
}

export const authApi = {
  async register(payload: RegisterInput): Promise<AuthResult> {
    const { data } = await apiClient.post<ApiResponse<AuthResult>>(
      "/auth/register/",
      payload,
    );
    return data.data;
  },

  async login(email: string, password: string): Promise<AuthResult> {
    const { data } = await apiClient.post<ApiResponse<AuthResult>>("/auth/login/", {
      email,
      password,
    });
    return data.data;
  },

  async profile(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>("/account/profile/");
    return data.data;
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      "/account/profile/",
      payload,
    );
    return data.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/password/reset/", { email });
  },

  async addresses(): Promise<Address[]> {
    const { data } = await apiClient.get<ApiResponse<Address[]>>("/account/addresses/");
    return Array.isArray(data.data) ? data.data : [];
  },

  async createAddress(payload: Omit<Address, "id">): Promise<Address> {
    const { data } = await apiClient.post<ApiResponse<Address>>(
      "/account/addresses/",
      payload,
    );
    return data.data;
  },
};
