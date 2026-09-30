export interface AuthUserResponse {
  id: string;
  email: string;
  displayName: string;
}

export interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
}

export type RegisterResponse = AuthUserResponse;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUserResponse;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  user: AuthUserResponse;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LogoutRequest {
  refreshToken: string;
}

export type LogoutResponse = void;
