import { toProject, type Project } from "../../model";
import { projectApi } from "./project.api";
import type {
  CreateProjectRequest,
  ListProjectsParams,
  UpdateProjectRequest,
} from "./project.dto";

export interface ProjectListResult {
  items: Project[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const projectRepository = {
  list: async (params?: ListProjectsParams): Promise<ProjectListResult> => {
    const response = await projectApi.list(params);
    return {
      ...response,
      items: response.items.map(toProject),
    };
  },
  create: async (payload: CreateProjectRequest) =>
    toProject(await projectApi.create(payload)),
  get: async (projectId: string) => toProject(await projectApi.get(projectId)),
  update: async ({
    projectId,
    payload,
  }: {
    projectId: string;
    payload: UpdateProjectRequest;
  }) => toProject(await projectApi.update(projectId, payload)),
  delete: (projectId: string) => projectApi.delete(projectId),
};
