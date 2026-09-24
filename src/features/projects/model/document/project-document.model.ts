export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  createdAt: Date;
  updatedAt: Date;
}
