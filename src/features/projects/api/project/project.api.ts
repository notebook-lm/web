import { endpoints, httpClient } from "@/lib/api";
import type {
  CreateProjectRequest,
  DeleteProjectResponse,
  ListProjectsResponse,
  ProjectResponse,
  UpdateProjectRequest,
} from "./project.dto";

export const projectApi = {
  list: () =>
    httpClient.get<ListProjectsResponse>(endpoints.projects.collection),
  create: (payload: CreateProjectRequest) =>
    httpClient.post<ProjectResponse>(endpoints.projects.collection, payload),
  get: (projectId: string) =>
    httpClient.get<ProjectResponse>(endpoints.projects.byId(projectId)),
  update: (projectId: string, payload: UpdateProjectRequest) =>
    httpClient.patch<ProjectResponse>(
      endpoints.projects.byId(projectId),
      payload,
    ),
  delete: (projectId: string) =>
    httpClient.delete<DeleteProjectResponse>(
      endpoints.projects.byId(projectId),
    ),
};
