import { toast } from "sonner";
import { DialogModal, useModal } from "react-dialog-confirm";
import { getErrorMessage } from "@/shared/errors/error-message";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useDeleteProjectDocument, useProjectDocuments } from "../hooks";
import type { Project, ProjectDocument } from "../model";
import { ProjectDocumentPreview } from "./ProjectDocumentPreview";
import { ProjectDocumentUpload } from "./ProjectDocumentUpload";

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const documentStatus = (status: string) => {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus === "COMPLETED") {
    return {
      label: "Ready",
      className:
        "bg-[color-mix(in_srgb,var(--color-text-action)_12%,transparent)] text-[var(--color-text-action)]",
    };
  }

  if (normalizedStatus === "FAILED") {
    return {
      label: "Failed",
      className:
        "bg-[color-mix(in_srgb,var(--color-state-error)_12%,transparent)] text-[var(--color-state-error)]",
    };
  }

  return {
    label: normalizedStatus === "PENDING" ? "Pending" : "Processing",
    className:
      "bg-[var(--color-bg-surface-subtle)] text-muted",
  };
};

export function ProjectSourcesPanel({ project }: { project: Project }) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ProjectDocument | null>(null);
  const [page, setPage] = useState(0);
  const { openModal, closeModal } = useModal();
  const { data, error, isLoading, isError, isFetching } = useProjectDocuments(project.id, {
    page,
    size: 10,
  });
  const documents = data?.items ?? [];
  const { mutateAsync: remove } = useDeleteProjectDocument();

  return (
    <section
      aria-label="Sources"
      className="flex min-h-0 flex-col bg-[var(--color-bg-surface)] p-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Sources</h2>
        <span className="text-xs text-muted">
          {data?.totalItems ?? 0} {(data?.totalItems ?? 0) === 1 ? "source" : "sources"}
        </span>
      </div>
      <button
        id="project-document-upload"
        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-bg-selected)] px-4 text-sm font-semibold text-[var(--color-text-action)]"
        onClick={() => setIsUploadOpen(true)}
      >
        <Plus size={17} /> Add source
      </button>
      <div className="app-scrollbar mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="grid min-h-48 place-items-center">
            <LoaderCircle className="animate-spin text-muted" size={22} />
          </div>
        ) : isError ? (
          <p role="alert" className="mt-1 text-sm text-[var(--color-state-error)]">
            {getErrorMessage(error, "We couldn’t load sources. Refresh and try again.")}
          </p>
        ) : documents.length ? (
          <ul className="grid gap-2">
            {documents.map((document) => (
              <li key={document.id} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2 rounded-lg p-2 hover:bg-[var(--color-bg-surface-subtle)]">
                <FileText className="shrink-0 text-[var(--color-text-action)]" size={17} />
                <button className="min-w-0 text-left text-sm font-medium" onClick={() => setSelectedDocument(document)} title={`Preview ${document.title}`} type="button">
                  <span className="line-clamp-2 break-words">{document.title}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs font-normal text-muted">
                    {formatSize(document.sizeBytes)}
                    <span
                      aria-label={`Status: ${documentStatus(document.status).label}`}
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${documentStatus(document.status).className}`}
                    >
                      {documentStatus(document.status).label}
                    </span>
                  </span>
                </button>
                <button
                  aria-label={`Delete ${document.title}`}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-[#fff0ee] hover:text-[var(--color-state-error)]"
                  onClick={() =>
                    openModal(
                      <DialogModal
                        description={`“${document.title}” will be permanently removed from this project.`}
                        icon="warning"
                        title="Delete this source?"
                        customFooter={
                          <div className="flex justify-end gap-3">
                            <button
                              className="min-h-10 rounded-full px-4 text-sm font-semibold text-muted hover:bg-[var(--color-bg-surface-subtle)]"
                              onClick={closeModal}
                              type="button"
                            >
                              Cancel
                            </button>
                            <button
                              className="min-h-10 rounded-full bg-[var(--color-state-error)] px-4 text-sm font-semibold text-white hover:brightness-95"
                              onClick={async () => {
                                try {
                                  await remove({
                                    projectId: project.id,
                                    documentId: document.id,
                                  });
                                  toast.success("Source deleted.");
                                  closeModal();
                                } catch (error) {
                                  toast.error(getErrorMessage(error, "We couldn’t delete this source. Please try again."));
                                }
                              }}
                              type="button"
                            >
                              Delete source
                            </button>
                          </div>
                        }
                      />,
                    )
                  }
                  type="button"
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
      </div>

      {data && data.totalPages > 1 ? (
        <nav aria-label="Source pagination" className="mt-3 flex shrink-0 items-center justify-between border-t border-[var(--color-border-default)] pt-3">
          <span className="text-xs text-muted">{data.page + 1} / {data.totalPages}</span>
          <div className="flex gap-1">
            <button aria-label="Previous source page" className="grid size-9 place-items-center rounded-full hover:bg-[var(--color-bg-surface-subtle)] disabled:cursor-not-allowed disabled:opacity-40" disabled={!data.hasPrevious || isFetching} onClick={() => setPage((current) => Math.max(0, current - 1))} type="button"><ChevronLeft size={16} /></button>
            <button aria-label="Next source page" className="grid size-9 place-items-center rounded-full hover:bg-[var(--color-bg-surface-subtle)] disabled:cursor-not-allowed disabled:opacity-40" disabled={!data.hasNext || isFetching} onClick={() => setPage((current) => current + 1)} type="button"><ChevronRight size={16} /></button>
          </div>
        </nav>
      ) : null}
      <ProjectDocumentPreview
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
        projectId={project.id}
      />
      <ProjectDocumentUpload projectId={project.id} open={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </section>
  );
}
