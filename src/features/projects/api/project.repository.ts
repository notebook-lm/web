import { toProject } from "../model";
import { projectApi } from "./project.api";
import type { CreateProjectRequest, UpdateProjectRequest } from "./project.dto";

export const projectRepository = {
  list: async () => (await projectApi.list()).map(toProject),
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
