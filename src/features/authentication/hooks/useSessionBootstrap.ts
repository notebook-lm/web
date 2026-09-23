import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { configureHttpSession } from "@/lib/http-client";
import { authService } from "@/lib/services/auth.service";
import { clearSession, getSession, saveSession } from "../session.storage";
import { useCurrentUser } from "./useCurrentUser";
import { useAuthSessionStore } from "../stores/auth-session.store";

export function useSessionBootstrap() {
  const queryClient = useQueryClient();
  const hasSession = useAuthSessionStore((state) => state.hasSession);
  const clearAuth = useAuthSessionStore((state) => state.reset);
  const currentUserQuery = useCurrentUser(hasSession);

  useEffect(() => {
    configureHttpSession({
      getAccessToken: () => getSession()?.accessToken,
      refresh: async () => {
        const session = getSession();
        if (!session) throw new Error("No refresh session");

        const nextSession = await authService.refresh(session.refreshToken);
        saveSession(nextSession);
        useAuthSessionStore.getState().setSession(nextSession);
        queryClient.setQueryData(
          queryKeys.account.currentUser(),
          nextSession.user,
        );

        return nextSession.accessToken;
      },
      onRefreshFailure: () => {
        clearSession();
        useAuthSessionStore.getState().reset();
        queryClient.removeQueries({ queryKey: queryKeys.account.all });
      },
    });
  }, [queryClient]);

  useEffect(() => {
    if (currentUserQuery.isError) {
      clearAuth();
      queryClient.removeQueries({ queryKey: queryKeys.account.all });
    }
  }, [clearAuth, currentUserQuery.isError, queryClient]);
}
