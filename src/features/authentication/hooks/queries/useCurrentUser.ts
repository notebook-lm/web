import { useQuery } from "@tanstack/react-query";
import { accountRepository } from "@/features/account/api";
import { queryKeys } from "@/lib/query";

export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.account.currentUser(),
    queryFn: accountRepository.getCurrentUser,
    enabled,
    staleTime: 5 * 60_000,
  });
}
