import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query";
import type { ListProjectsParams } from "../../../api";
import { projectRepository } from "../../../api";

export function useProjects(params: ListProjectsParams = {}) {
  return useQuery({
    queryKey: queryKeys.projects.list(params),
    queryFn: () => projectRepository.list(params),
  });
}
