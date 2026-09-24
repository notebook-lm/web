import type { ListProjectsParams } from "@/features/projects/api";

export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    list: (params: ListProjectsParams = {}) =>
      [...queryKeys.projects.all, "list", params] as const,
    detail: (projectId: string) =>
      [...queryKeys.projects.all, "detail", projectId] as const,
  },
  account: {
    all: ["account"] as const,
    currentUser: () => [...queryKeys.account.all, "current-user"] as const,
  },
} as const;
