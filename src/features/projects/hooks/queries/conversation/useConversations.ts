import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query";
import { conversationRepository, type ListConversationsParams } from "../../../api";
export function useConversations(projectId?: string, params: ListConversationsParams = {}) { return useQuery({ queryKey: queryKeys.projects.conversations(projectId ?? "", params), queryFn: () => conversationRepository.list(projectId!, params), enabled: Boolean(projectId), staleTime: 1000 * 60 * 2 }); }
