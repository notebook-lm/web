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
export type ListProjectDocumentsResponse = ProjectDocumentResponse[];
export interface RenameDocumentRequest {
  title: string;
}
