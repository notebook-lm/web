import { endpoints, httpClient } from "@/lib/api";
import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "./auth.dto";

export const authApi = {
  register: (payload: RegisterRequest) =>
    httpClient.post<RegisterResponse>(endpoints.auth.register, payload),
  login: (payload: LoginRequest) =>
    httpClient.post<LoginResponse>(endpoints.auth.login, payload),
  refresh: (payload: RefreshTokenRequest) =>
    httpClient.post<RefreshTokenResponse>(endpoints.auth.refresh, payload),
  logout: (payload: LogoutRequest) =>
    httpClient.post<LogoutResponse>(endpoints.auth.logout, payload),
};
