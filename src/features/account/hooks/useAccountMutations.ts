import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { accountService } from "@/lib/services/account.service";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountService.updateProfile,
    onSuccess: (user) =>
      queryClient.setQueryData(queryKeys.account.currentUser(), user),
  });
}

export function useChangeEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountService.changeEmail,
    onSuccess: (user) =>
      queryClient.setQueryData(queryKeys.account.currentUser(), user),
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountService.changePassword,
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.currentUser(),
      }),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountService.deleteAccount,
    onSuccess: () =>
      queryClient.removeQueries({ queryKey: queryKeys.account.currentUser() }),
  });
}
