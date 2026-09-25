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
  },
  account: {
    all: ["account"] as const,
    currentUser: () => [...queryKeys.account.all, "current-user"] as const,
  },
} as const;
