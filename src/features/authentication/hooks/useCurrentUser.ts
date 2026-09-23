import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { accountService } from "@/lib/services/account.service";

export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.account.currentUser(),
    queryFn: accountService.getCurrentUser,
    enabled,
    staleTime: 5 * 60_000,
  });
}
