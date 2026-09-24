import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query";
import { projectDocumentRepository } from "../../../api";
export function useProjectDocuments(projectId: string) {
  return useQuery({
    queryKey: queryKeys.projects.documents(projectId),
    queryFn: () => projectDocumentRepository.list(projectId),
  });
}
