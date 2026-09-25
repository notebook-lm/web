export interface ProjectDocumentResponse {
  id: string;
  projectId: string;
  title: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListProjectDocumentsParams {
  q?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: string;
  direction?: "asc" | "desc";
  page?: number;
  size?: number;
}

export interface ProjectDocumentPageResponse {
  items: ProjectDocumentResponse[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface RenameDocumentRequest {
  title: string;
}
