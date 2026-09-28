import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query";
import { conversationRepository, type ListMessagesParams } from "../../../api";
export function useMessages(projectId?: string, conversationId?: string, params: ListMessagesParams = { size: 100 }) { return useQuery({ queryKey: queryKeys.projects.messages(projectId ?? "", conversationId ?? "", params), queryFn: () => conversationRepository.messages(projectId!, conversationId!, params), enabled: Boolean(projectId && conversationId), staleTime: 1000 * 30 }); }
