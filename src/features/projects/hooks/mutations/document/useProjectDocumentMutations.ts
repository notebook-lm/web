import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query";
import { projectDocumentRepository } from "../../../api";
const refresh = (
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string,
) =>
  void queryClient.invalidateQueries({
    queryKey: queryKeys.projects.documents(projectId),
  });
export function useUploadProjectDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectDocumentRepository.upload,
    onSuccess: (document) => refresh(queryClient, document.projectId),
  });
}
export function useRenameProjectDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectDocumentRepository.rename,
    onSuccess: (document) => refresh(queryClient, document.projectId),
  });
}
export function useDeleteProjectDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectDocumentRepository.delete,
    onSuccess: (_, variables) => refresh(queryClient, variables.projectId),
  });
}
