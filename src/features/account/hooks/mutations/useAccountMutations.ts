import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountRepository } from "../../api";
import { queryKeys } from "@/lib/query";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountRepository.updateProfile,
    onSuccess: (response) =>
      queryClient.setQueryData(queryKeys.account.currentUser(), response),
  });
}

export function useChangeEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountRepository.changeEmail,
    onSuccess: (response) =>
      queryClient.setQueryData(queryKeys.account.currentUser(), response),
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountRepository.changePassword,
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.currentUser(),
      }),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountRepository.deleteAccount,
    onSuccess: () =>
      queryClient.removeQueries({ queryKey: queryKeys.account.currentUser() }),
  });
}
