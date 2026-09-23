import { endpoints } from "@/lib/endpoints";
import { httpClient } from "@/lib/http-client";
import type { User } from "@/shared/types/account";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/shared/types/authentication";

export const authService = {
  register: (payload: RegisterRequest) =>
    httpClient.post<User>(endpoints.auth.register, payload),
  login: (payload: LoginRequest) =>
    httpClient.post<AuthResponse>(endpoints.auth.login, payload),
  refresh: (refreshToken: string) =>
    httpClient.post<AuthResponse>(endpoints.auth.refresh, { refreshToken }),
  logout: (refreshToken: string) =>
    httpClient.post<void>(endpoints.auth.logout, { refreshToken }),
};
