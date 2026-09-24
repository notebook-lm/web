export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    list: () => [...queryKeys.projects.all, "list"] as const,
    detail: (projectId: string) =>
      [...queryKeys.projects.all, "detail", projectId] as const,
    documents: (projectId: string) =>
      [...queryKeys.projects.all, projectId, "documents"] as const,
  },
  account: {
    all: ["account"] as const,
    currentUser: () => [...queryKeys.account.all, "current-user"] as const,
  },
} as const;
