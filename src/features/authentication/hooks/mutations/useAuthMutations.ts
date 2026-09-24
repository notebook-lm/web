import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authRepository } from "../../api";
import { queryKeys } from "@/lib/query";
import { getSession } from "../../storage/session.storage";
import { useAuthSessionStore } from "../../stores/auth-session.store";

export function useSignIn() {
  const queryClient = useQueryClient();
  const setSession = useAuthSessionStore((state) => state.setSession);
  return useMutation({
    mutationFn: authRepository.login,
    onSuccess: (response) => {
      const session = response;
      setSession(session);
      queryClient.setQueryData(queryKeys.account.currentUser(), session.user);
    },
  });
}

export function useSignUp() {
  return useMutation({ mutationFn: authRepository.register });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthSessionStore((state) => state.reset);
  return useMutation({
    mutationFn: async () => {
      const refreshToken = getSession()?.refreshToken;
      if (refreshToken) await authRepository.logout({ refreshToken });
    },
    onSettled: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: queryKeys.account.all });
    },
  });
}
