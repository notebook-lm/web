import type { ProjectDocumentResponse } from "../../api/document";
import type { ProjectDocument } from "./project-document.model";
export function toProjectDocument(
  response: ProjectDocumentResponse,
): ProjectDocument {
  return {
    ...response,
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}
