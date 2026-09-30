import { endpoints, httpClient } from "@/lib/api";
import type {
  ListProjectDocumentsParams,
  ProjectDocumentPageResponse,
  ProjectDocumentResponse,
  RenameDocumentRequest,
} from "./project-document.dto";

function withQuery<T extends object>(path: string, params?: T) {
  if (!params) return path;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

export const projectDocumentApi = {
  list: (projectId: string, params?: ListProjectDocumentsParams) =>
    httpClient.get<ProjectDocumentPageResponse>(
      withQuery(endpoints.projects.documents(projectId), params),
    ),
  upload: (projectId: string, file: File, title?: string) => {
    const data = new FormData();
    data.append("file", file);

    return httpClient.post<ProjectDocumentResponse>(
      withQuery(endpoints.projects.documents(projectId), {
        title: title?.trim() || undefined,
      }),
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
  content: (projectId: string, documentId: string) =>
    httpClient.getBlob(endpoints.projects.documentContent(projectId, documentId)),
  delete: (projectId: string, documentId: string) =>
    httpClient.delete<void>(
      endpoints.projects.documentById(projectId, documentId),
    ),
};
