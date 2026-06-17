import axios from "axios";

import { API_URL } from "@/constants/config";
import { apiClient, unwrap } from "./client";
import type { ApiEnvelope } from "@/types/api";
import type { Address, AuthTokens, User } from "@/types/user";
import type { RegisterInput } from "@/lib/validations";

export const authApi = {
  async register(payload: RegisterInput): Promise<AuthTokens> {
    const { data } = await axios.post<ApiEnvelope<AuthTokens>>(
      `${API_URL}/auth/register/`,
      payload,
    );
    return data.data;
  },

  async profile(): Promise<User> {
    const { data } = await apiClient.get<ApiEnvelope<User>>(
      "/account/profile/",
    );
    return unwrap(data);
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    const { data } = await apiClient.patch<ApiEnvelope<User>>(
      "/account/profile/",
      payload,
    );
    return unwrap(data);
  },

  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    await apiClient.post("/auth/password/change/", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  async requestPasswordReset(email: string): Promise<void> {
    await axios.post(`${API_URL}/auth/password/reset/`, { email });
  },

  async addresses(): Promise<Address[]> {
    const { data } = await apiClient.get<ApiEnvelope<Address[]>>(
      "/account/addresses/",
    );
    return unwrap(data);
  },

  async createAddress(payload: Partial<Address>): Promise<Address> {
    const { data } = await apiClient.post<ApiEnvelope<Address>>(
      "/account/addresses/",
      payload,
    );
    return unwrap(data);
  },

  async deleteAddress(id: number): Promise<void> {
    await apiClient.delete(`/account/addresses/${id}/`);
  },
};
