import type { AuthSession } from "./auth-session.model";
import type { UserResponse } from "../user";
import { toUser } from "../user";

export interface AuthSessionResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export function toAuthSession(response: AuthSessionResponse): AuthSession {
  return {
    user: toUser(response.user),
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    tokenType: response.tokenType,
    expiresIn: response.expiresIn,
  };
}
