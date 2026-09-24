export const queryKeys = {
  account: {
    all: ["account"] as const,
    currentUser: () => [...queryKeys.account.all, "current-user"] as const,
  },
} as const;
