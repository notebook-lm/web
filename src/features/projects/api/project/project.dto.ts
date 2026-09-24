export interface ProjectResponse {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface UpdateProjectRequest {
  title: string;
  description?: string;
}

export type ListProjectsResponse = ProjectResponse[];
export type DeleteProjectResponse = void;
