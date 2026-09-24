export const endpoints = {
  auth: {
    register: "/api/v1/auth/register",
    login: "/api/v1/auth/login",
    refresh: "/api/v1/auth/refresh",
    logout: "/api/v1/auth/logout",
  },
  account: {
    currentUser: "/api/v1/users/me",
    email: "/api/v1/users/me/email",
    password: "/api/v1/users/me/password",
  },
} as const;
