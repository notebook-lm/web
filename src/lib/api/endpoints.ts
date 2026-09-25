export const endpoints = {
  auth: {
    register: "/api/v1/auth/register",
    login: "/api/v1/auth/login",
    refresh: "/api/v1/auth/refresh",
    logout: "/api/v1/auth/logout",
  },
  projects: {
    collection: "/api/v1/projects",
    byId: (projectId: string) => `/api/v1/projects/${projectId}`,
    documents: (projectId: string) => `/api/v1/projects/${projectId}/documents`,
    documentById: (projectId: string, documentId: string) =>
      `/api/v1/projects/${projectId}/documents/${documentId}`,
    documentContent: (projectId: string, documentId: string) =>
      `/api/v1/projects/${projectId}/documents/${documentId}/content`,
  },
  account: {
    currentUser: "/api/v1/users/me",
    email: "/api/v1/users/me/email",
    password: "/api/v1/users/me/password",
  },
} as const;
