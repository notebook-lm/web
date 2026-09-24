import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query";
import { projectRepository } from "../../../api";

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectRepository.create,
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: queryKeys.projects.list(),
      }),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectRepository.update,
    onSuccess: (project) => {
      queryClient.setQueryData(queryKeys.projects.detail(project.id), project);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.projects.list(),
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectRepository.delete,
    onSuccess: (_, projectId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.projects.detail(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.projects.list(),
      });
    },
  });
}
