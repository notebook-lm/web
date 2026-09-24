import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query";
import { projectRepository } from "../../api";

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.list(),
    queryFn: projectRepository.list,
  });
}
