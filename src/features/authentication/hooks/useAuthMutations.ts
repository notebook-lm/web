import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { authService } from "@/lib/services/auth.service";
import { getSession } from "../session.storage";
import { useAuthSessionStore } from "../stores/auth-session.store";

export function useSignIn() {
  const queryClient = useQueryClient();
  const setSession = useAuthSessionStore((state) => state.setSession);
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => {
      setSession(session);
      queryClient.setQueryData(queryKeys.account.currentUser(), session.user);
    },
  });
}

export function useSignUp() {
  return useMutation({ mutationFn: authService.register });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthSessionStore((state) => state.reset);
  return useMutation({
    mutationFn: async () => {
      const refreshToken = getSession()?.refreshToken;
      if (refreshToken) await authService.logout(refreshToken);
    },
    onSettled: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: queryKeys.account.all });
    },
  });
}
