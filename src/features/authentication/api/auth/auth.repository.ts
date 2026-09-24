import { toAuthSession, toUser } from "../../model";
import { authApi } from "./auth.api";
import type {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "./auth.dto";

export const authRepository = {
  register: async (payload: RegisterRequest) => {
    const response = await authApi.register(payload);
    return toUser(response);
  },
  login: async (payload: LoginRequest) => {
    const response = await authApi.login(payload);
    return toAuthSession(response);
  },
  refresh: async (payload: RefreshTokenRequest) => {
    const response = await authApi.refresh(payload);
    return toAuthSession(response);
  },
  logout: async (payload: LogoutRequest) => {
    await authApi.logout(payload);
  },
};
