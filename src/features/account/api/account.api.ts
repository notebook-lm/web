import { endpoints, httpClient } from "@/lib/api";
import type {
  ChangeEmailRequest,
  ChangeEmailResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  DeleteAccountRequest,
  DeleteAccountResponse,
  GetCurrentUserResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "./account.dto";

export const accountApi = {
  getCurrentUser: () =>
    httpClient.get<GetCurrentUserResponse>(endpoints.account.currentUser),
  updateProfile: (payload: UpdateProfileRequest) =>
    httpClient.patch<UpdateProfileResponse>(endpoints.account.currentUser, payload),
  changeEmail: (payload: ChangeEmailRequest) =>
    httpClient.patch<ChangeEmailResponse>(endpoints.account.email, payload),
  changePassword: (payload: ChangePasswordRequest) =>
    httpClient.patch<ChangePasswordResponse>(endpoints.account.password, payload),
  deleteAccount: (payload: DeleteAccountRequest) =>
    httpClient.delete<DeleteAccountResponse>(endpoints.account.currentUser, payload),
};
