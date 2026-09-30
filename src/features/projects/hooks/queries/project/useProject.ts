import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query";
import { projectRepository } from "../../../api";

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.projects.detail(projectId ?? ""),
    queryFn: () => projectRepository.get(projectId!),
    enabled: Boolean(projectId),
  });
}
