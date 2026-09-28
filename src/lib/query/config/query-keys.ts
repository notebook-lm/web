import type {
  ListProjectDocumentsParams,
  ListProjectsParams,
} from "@/features/projects/api";

export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    list: (params: ListProjectsParams = {}) =>
      [...queryKeys.projects.all, "list", params] as const,
    detail: (projectId: string) =>
      [...queryKeys.projects.all, "detail", projectId] as const,
    documents: (
      projectId: string,
      params: ListProjectDocumentsParams = {},
    ) => [...queryKeys.projects.all, projectId, "documents", params] as const,
    documentsAll: (projectId: string) =>
      [...queryKeys.projects.all, projectId, "documents"] as const,
    conversations: (projectId: string, params: { q?: string; page?: number; size?: number } = {}) =>
      [...queryKeys.projects.all, projectId, "conversations", params] as const,
    conversationsAll: (projectId: string) =>
      [...queryKeys.projects.all, projectId, "conversations"] as const,
    messages: (projectId: string, conversationId: string, params: { page?: number; size?: number } = {}) =>
      [...queryKeys.projects.all, projectId, "conversations", conversationId, "messages", params] as const,
  },
  account: {
    all: ["account"] as const,
    currentUser: () => [...queryKeys.account.all, "current-user"] as const,
  },
} as const;
