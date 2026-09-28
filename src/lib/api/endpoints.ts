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
    conversations: (projectId: string) =>
      `/api/v1/projects/${projectId}/conversations`,
    conversationById: (projectId: string, conversationId: string) =>
      `/api/v1/projects/${projectId}/conversations/${conversationId}`,
    messages: (projectId: string, conversationId: string) =>
      `/api/v1/projects/${projectId}/conversations/${conversationId}/messages`,
    streamMessages: (projectId: string, conversationId: string) =>
      `/api/v1/projects/${projectId}/conversations/${conversationId}/messages:stream`,
    cancelMessage: (projectId: string, conversationId: string, messageId: string) =>
      `/api/v1/projects/${projectId}/conversations/${conversationId}/messages/${messageId}:cancel`,
  },
  account: {
    currentUser: "/api/v1/users/me",
    email: "/api/v1/users/me/email",
    password: "/api/v1/users/me/password",
  },
} as const;
