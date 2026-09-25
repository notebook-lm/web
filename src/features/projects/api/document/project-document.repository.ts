import {
  toProjectDocument,
  type ProjectDocument,
} from "../../model/document";
import { projectDocumentApi } from "./project-document.api";
import type { ListProjectDocumentsParams } from "./project-document.dto";

export interface ProjectDocumentListResult {
  items: ProjectDocument[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const projectDocumentRepository = {
  list: async (
    projectId: string,
    params?: ListProjectDocumentsParams,
  ): Promise<ProjectDocumentListResult> => {
    const response = await projectDocumentApi.list(projectId, params);
    return {
      ...response,
      items: response.items.map(toProjectDocument),
    };
  },
  upload: async ({
    projectId,
    file,
    title,
  }: {
    projectId: string;
    file: File;
    title?: string;
  }) =>
    toProjectDocument(await projectDocumentApi.upload(projectId, file, title)),
  rename: async ({
    projectId,
    documentId,
    title,
  }: {
    projectId: string;
    documentId: string;
    title: string;
  }) =>
    toProjectDocument(
      await projectDocumentApi.rename(projectId, documentId, { title }),
    ),
  delete: ({
    projectId,
    documentId,
  }: {
    projectId: string;
    documentId: string;
  }) => projectDocumentApi.delete(projectId, documentId),
};
