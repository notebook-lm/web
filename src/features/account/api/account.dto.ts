export interface AccountUserResponse {
  id: string;
  email: string;
  displayName: string;
}

export type GetCurrentUserResponse = AccountUserResponse;

export interface UpdateProfileRequest {
  displayName: string;
}

export type UpdateProfileResponse = AccountUserResponse;

export interface ChangeEmailRequest {
  email: string;
  currentPassword: string;
}

export type ChangeEmailResponse = AccountUserResponse;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type ChangePasswordResponse = void;

export interface DeleteAccountRequest {
  currentPassword: string;
}

export type DeleteAccountResponse = void;
