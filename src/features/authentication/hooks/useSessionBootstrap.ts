import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authRepository } from "../api";
import { configureHttpSession } from "@/lib/api";
import { queryKeys } from "@/lib/query";
import { clearSession, getSession, saveSession } from "../storage/session.storage";
import { useAuthSessionStore } from "../stores/auth-session.store";
import { useCurrentUser } from "./queries/useCurrentUser";

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

        const response = await authRepository.refresh({
          refreshToken: session.refreshToken,
        });
        const nextSession = response;
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
