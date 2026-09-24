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

export interface ListProjectsParams {
  q?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: string;
  direction?: "asc" | "desc";
  page?: number;
  size?: number;
}

export interface ProjectPageResponse {
  items: ProjectResponse[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type DeleteProjectResponse = void;
