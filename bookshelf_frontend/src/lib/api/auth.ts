import { apiClient, unwrap } from "./client";
import type { Address, AuthTokens, User } from "@/types/user";

export interface RegisterPayload {
  email: string;
  username: string;
  full_name: string;
  phone?: string;
  password: string;
  password2: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    unwrap<AuthTokens>(apiClient.post("/auth/login/", { email, password })),

  register: (payload: RegisterPayload) =>
    unwrap<AuthTokens>(apiClient.post("/auth/register/", payload)),

  refresh: (refresh: string) =>
    unwrap<{ access: string }>(apiClient.post("/auth/token/refresh/", { refresh })),

  requestPasswordReset: (email: string) =>
    apiClient.post("/auth/password/reset/", { email }),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post("/auth/password/change/", {
      old_password: oldPassword,
      new_password: newPassword,
    }),

  profile: () => unwrap<User>(apiClient.get("/account/profile/")),

  updateProfile: (data: Partial<User>) =>
    unwrap<User>(apiClient.patch("/account/profile/", data)),

  addresses: () => unwrap<Address[]>(apiClient.get("/account/addresses/")),

  createAddress: (data: Partial<Address>) =>
    unwrap<Address>(apiClient.post("/account/addresses/", data)),

  updateAddress: (id: number, data: Partial<Address>) =>
    unwrap<Address>(apiClient.patch(`/account/addresses/${id}/`, data)),

  deleteAddress: (id: number) =>
    apiClient.delete(`/account/addresses/${id}/`),
};
