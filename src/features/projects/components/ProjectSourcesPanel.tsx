import { endpoints } from "@/lib/api";
import { FileText, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteProjectDocument, useProjectDocuments } from "../hooks";
import { ProjectDocumentUpload } from "./ProjectDocumentUpload";
import type { Project } from "../model";
const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function ProjectSourcesPanel({ project }: { project: Project }) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { data, isLoading, isError } = useProjectDocuments(project.id);
  const documents = data?.items ?? [];
  const { mutateAsync: remove } = useDeleteProjectDocument();
  return (
    <aside
      aria-label="Sources"
      className="min-w-0 overflow-hidden border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-4 lg:border-r lg:border-b-0"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Sources</h2>
        <span className="text-xs text-muted">
          {documents.length} {documents.length === 1 ? "source" : "sources"}
        </span>
      </div>
      <button
        id="project-document-upload"
        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-bg-selected)] px-4 text-sm font-semibold text-[var(--color-text-action)]"
        onClick={() => setIsUploadOpen(true)}
      >
        <Plus size={17} /> Add source
      </button>
      {isLoading ? (
        <div className="grid min-h-48 place-items-center">
          <LoaderCircle className="animate-spin text-muted" size={22} />
        </div>
      ) : isError ? (
        <p
          role="alert"
          className="mt-6 text-sm text-[var(--color-state-error)]"
        >
          We couldn’t load sources. Refresh and try again.
        </p>
      ) : documents.length ? (
        <ul className="mt-5 grid gap-2">
          {documents.map((document) => (
            <li
              key={document.id}
              className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2 rounded-lg p-2 hover:bg-[var(--color-bg-surface-subtle)]"
            >
              <FileText
                className="shrink-0 text-[var(--color-text-action)]"
                size={17}
              />
              <a
                className="min-w-0 text-sm font-medium"
                href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}${endpoints.projects.documentContent(project.id, document.id)}`}
                target="_blank"
                rel="noreferrer"
                title={document.title}
              >
                <span className="line-clamp-2 break-words">
                  {document.title}
                </span>
                <span className="mt-0.5 block text-xs font-normal text-muted">
                  {formatSize(document.sizeBytes)}
                </span>
              </a>
              <button
                aria-label={`Delete ${document.title}`}
                className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-[#fff0ee] hover:text-[var(--color-state-error)]"
                onClick={() => {
                  if (window.confirm(`Delete “${document.title}”?`))
                    void remove({
                      projectId: project.id,
                      documentId: document.id,
                    });
                }}
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid min-h-48 place-items-center py-8 text-center">
          <div>
            <FileText className="mx-auto text-muted" size={24} />
            <p className="mt-3 text-sm font-semibold">No sources yet</p>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-muted">
              Add a document to start building this project’s source collection.
            </p>
          </div>
        </div>
      )}
      <ProjectDocumentUpload
        projectId={project.id}
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </aside>
  );
}
