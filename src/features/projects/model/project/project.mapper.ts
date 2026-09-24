import type { ProjectResponse } from "../../api";
import type { Project } from "./project.model";

export function toProject(response: ProjectResponse): Project {
  return {
    id: response.id,
    title: response.title,
    description: response.description ?? "",
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}
