import { apiClient, unwrap } from "./client";
import type { ApiEnvelope } from "@/types/api";
import type { User } from "@/types/user";
import type { RegisterInput } from "@/lib/validations";

interface AuthTokens {
  user: User;
  access: string;
  refresh: string;
}

export const authApi = {
  register: (input: RegisterInput) =>
    unwrap<AuthTokens>(
      apiClient.post<ApiEnvelope<AuthTokens>>("/auth/register/", input),
    ),

  profile: () =>
    unwrap<User>(apiClient.get<ApiEnvelope<User>>("/account/profile/")),

  updateProfile: (data: Partial<User>) =>
    unwrap<User>(
      apiClient.patch<ApiEnvelope<User>>("/account/profile/", data),
    ),

  changePassword: (old_password: string, new_password: string) =>
    apiClient.post("/auth/password/change/", { old_password, new_password }),
};
