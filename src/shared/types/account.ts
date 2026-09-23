export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface UpdateProfileRequest {
  displayName: string;
}

export interface ChangeEmailRequest {
  email: string;
  currentPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
