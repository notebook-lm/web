import { endpoints, httpClient } from "@/lib/api";
import type {
  ListProjectDocumentsResponse,
  ProjectDocumentResponse,
  RenameDocumentRequest,
} from "./project-document.dto";
export const projectDocumentApi = {
  list: (projectId: string) =>
    httpClient.get<ListProjectDocumentsResponse>(
      endpoints.projects.documents(projectId),
    ),
  upload: (projectId: string, file: File, title?: string) => {
    const data = new FormData();
    data.append("file", file);
    if (title?.trim()) data.append("title", title.trim());
    return httpClient.post<ProjectDocumentResponse>(
      endpoints.projects.documents(projectId),
      data,
    );
  },
  rename: (
    projectId: string,
    documentId: string,
    payload: RenameDocumentRequest,
  ) =>
    httpClient.patch<ProjectDocumentResponse>(
      endpoints.projects.documentById(projectId, documentId),
      payload,
    ),
  delete: (projectId: string, documentId: string) =>
    httpClient.delete<void>(
      endpoints.projects.documentById(projectId, documentId),
    ),
};
