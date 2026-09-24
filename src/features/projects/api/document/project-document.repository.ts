import { toProjectDocument } from "../../model/document";
import { projectDocumentApi } from "./project-document.api";
export const projectDocumentRepository = {
  list: async (projectId: string) =>
    (await projectDocumentApi.list(projectId)).map(toProjectDocument),
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
