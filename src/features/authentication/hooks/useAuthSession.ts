import { useMemo } from "react";
import { resolvePermissions } from "../permissions";
import { useAuthSessionStore } from "../stores/auth-session.store";
import { useCurrentUser } from "./useCurrentUser";

export function useAuthSession() {
  const hasSession = useAuthSessionStore((state) => state.hasSession);
  const clearAuth = useAuthSessionStore((state) => state.reset);
  const currentUserQuery = useCurrentUser(hasSession);

  return useMemo(
    () => ({
      user: currentUserQuery.data ?? null,
      isLoading: hasSession && currentUserQuery.isLoading,
      permissions: resolvePermissions(currentUserQuery.data ?? null),
      clearAuth,
    }),
    [clearAuth, currentUserQuery.data, currentUserQuery.isLoading, hasSession],
  );
}
