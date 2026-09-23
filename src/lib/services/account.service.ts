import { endpoints } from "@/lib/endpoints";
import { httpClient } from "@/lib/http-client";
import type {
  ChangeEmailRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  User,
} from "@/shared/types/account";

export const accountService = {
  getCurrentUser: async () =>
    httpClient.get<User>(endpoints.account.currentUser),
  updateProfile: async (payload: UpdateProfileRequest) =>
    httpClient.patch<User>(endpoints.account.currentUser, payload),
  changeEmail: async (payload: ChangeEmailRequest) =>
    httpClient.patch<User>(endpoints.account.email, payload),
  changePassword: async (payload: ChangePasswordRequest) =>
    httpClient.patch<void>(endpoints.account.password, payload),
  deleteAccount: async (currentPassword: string) =>
    httpClient.delete<void>(endpoints.account.currentUser, { currentPassword }),
};
