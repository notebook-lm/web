import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query";
import type { ListProjectDocumentsParams } from "../../../api";
import { projectDocumentRepository } from "../../../api";

export function useProjectDocuments(
  projectId: string,
  params: ListProjectDocumentsParams = {},
) {
  return useQuery({
    queryKey: queryKeys.projects.documents(projectId, params),
    queryFn: () => projectDocumentRepository.list(projectId, params),
  });
}
