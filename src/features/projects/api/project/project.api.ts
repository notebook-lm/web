import { endpoints, httpClient } from "@/lib/api";
import type {
  CreateProjectRequest,
  DeleteProjectResponse,
  ListProjectsParams,
  ProjectPageResponse,
  ProjectResponse,
  UpdateProjectRequest,
} from "./project.dto";

function buildListProjectsPath(params?: ListProjectsParams) {
  if (!params) return endpoints.projects.collection;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query
    ? `${endpoints.projects.collection}?${query}`
    : endpoints.projects.collection;
}

export const projectApi = {
  list: (params?: ListProjectsParams) =>
    httpClient.get<ProjectPageResponse>(buildListProjectsPath(params)),
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
