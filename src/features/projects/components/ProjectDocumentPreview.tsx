import { Download, FileText, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/errors/error-message";
import { projectDocumentRepository } from "../api";
import type { ProjectDocument } from "../model";

interface Props {
  projectId: string;
  document: ProjectDocument | null;
  onClose: () => void;
}

type PreviewData =
  | { type: "pdf"; objectUrl: string }
  | { type: "text"; content: string; label: "Markdown" | "Text" }
  | { type: "download"; blob: Blob; label: string };

function getExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

async function createPreviewData(
  document: ProjectDocument,
  blob: Blob,
): Promise<PreviewData> {
  if (document.contentType === "application/pdf") {
    return { type: "pdf", objectUrl: URL.createObjectURL(blob) };
  }

  const extension = getExtension(document.originalFilename);
  if (extension === "pdf") {
    return { type: "pdf", objectUrl: URL.createObjectURL(blob) };
  }

  if (extension === "md") {
    return { type: "text", content: await blob.text(), label: "Markdown" };
  }

  if (extension === "txt") {
    return { type: "text", content: await blob.text(), label: "Text" };
  }

  if (["doc", "docx"].includes(extension)) {
    return { type: "download", blob, label: "Word document" };
  }

  if (["xls", "xlsx"].includes(extension)) {
    return { type: "download", blob, label: "Excel spreadsheet" };
  }

  if (["ppt", "pptx"].includes(extension)) {
    return { type: "download", blob, label: "PowerPoint presentation" };
  }

  return { type: "download", blob, label: "this document type" };
}

export function ProjectDocumentPreview({ projectId, document, onClose }: Props) {
  const [previewData, setPreviewData] = useState<PreviewData>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!document) return;
    let active = true;

    void Promise.resolve().then(async () => {
      if (!active) return;
      setPreviewData(undefined);
      setErrorMessage(undefined);
      setIsLoading(true);

      try {
        const blob = await projectDocumentRepository.content(projectId, document.id);
        const data = await createPreviewData(document, blob);
        if (active) setPreviewData(data);
      } catch (error) {
        if (active) {
          setErrorMessage(
            getErrorMessage(error, "We couldn’t load this document. Please try again."),
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [document, projectId]);

  useEffect(() => () => {
    if (previewData?.type === "pdf") URL.revokeObjectURL(previewData.objectUrl);
  }, [previewData]);

  useEffect(() => {
    if (!document) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [document, onClose]);

  if (!document) return null;

  const download = () => {
    if (!previewData) {
      toast.error("The document is still loading.");
      return;
    }

    switch (previewData.type) {
      case "pdf":
        downloadFile(previewData.objectUrl, document.originalFilename);
        return;
      case "text":
        downloadFile(
          URL.createObjectURL(new Blob([previewData.content], { type: "text/plain" })),
          document.originalFilename,
        );
        return;
      case "download":
        downloadFile(URL.createObjectURL(previewData.blob), document.originalFilename);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#15231f]/45 p-4" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <section aria-labelledby="document-preview-title" aria-modal="true" className="flex h-[min(760px,calc(100vh-2rem))] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[var(--color-bg-surface)] shadow-2xl" role="dialog">
        <PreviewHeader title={document.title} hasContent={Boolean(previewData)} onClose={onClose} onDownload={download} />
        <div className="min-h-0 flex-1 overflow-auto bg-[var(--color-bg-canvas)] p-4 sm:p-6">
          <PreviewContent data={previewData} errorMessage={errorMessage} isLoading={isLoading} title={document.title} onDownload={download} />
        </div>
      </section>
    </div>
  );
}

function PreviewContent({ data, errorMessage, isLoading, title, onDownload }: { data?: PreviewData; errorMessage?: string; isLoading: boolean; title: string; onDownload: () => void }) {
  if (isLoading) return <div className="grid min-h-72 place-items-center"><LoaderCircle className="animate-spin text-muted" size={26} /></div>;
  if (errorMessage) return <PreviewMessage iconClass="text-[var(--color-state-error)]" title="We couldn’t load this document." description={errorMessage} />;
  if (!data) return null;

  switch (data.type) {
    case "pdf":
      return <iframe className="h-full min-h-0 w-full rounded-lg border border-[var(--color-border-default)] bg-white" src={data.objectUrl} title={title} />;
    case "text":
      return <pre className="h-full min-h-0 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[var(--color-bg-surface)] p-5 font-mono text-sm leading-6 text-[var(--color-text-primary)]">{data.content}</pre>;
    case "download":
      return <DownloadFallback label={data.label} onDownload={onDownload} />;
  }
}

function PreviewHeader({ title, hasContent, onClose, onDownload }: { title: string; hasContent: boolean; onClose: () => void; onDownload: () => void }) {
  return <header className="flex items-start justify-between gap-4 border-b border-[var(--color-border-default)] px-5 py-4 sm:px-6"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-action)]">Source preview</p><h2 id="document-preview-title" className="mt-1 line-clamp-2 break-words text-lg font-semibold">{title}</h2></div><div className="flex shrink-0 items-center gap-1"><button aria-label={`Download ${title}`} className="grid size-10 place-items-center rounded-full text-muted hover:bg-[var(--color-bg-surface-subtle)]" disabled={!hasContent} onClick={onDownload} type="button"><Download size={18} /></button><button aria-label="Close document preview" className="grid size-10 place-items-center rounded-full text-muted hover:bg-[var(--color-bg-surface-subtle)]" onClick={onClose} type="button"><X size={19} /></button></div></header>;
}

function DownloadFallback({ label, onDownload }: { label: string; onDownload: () => void }) {
  return <div className="grid min-h-72 place-items-center text-center"><div><FileText className="mx-auto text-[var(--color-text-action)]" size={32} /><p className="mt-4 text-sm font-semibold">Preview isn’t available for {label}.</p><p className="mt-1 max-w-sm text-sm text-muted">Download the original file to view it in a compatible app.</p><button className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--color-bg-selected)] px-4 text-sm font-semibold text-[var(--color-text-action)]" onClick={onDownload} type="button"><Download size={16} /> Download file</button></div></div>;
}

function PreviewMessage({ iconClass, title, description }: { iconClass: string; title: string; description: string }) {
  return <div className="grid min-h-72 place-items-center text-center"><div><FileText className={`mx-auto ${iconClass}`} size={28} /><p className="mt-3 text-sm font-semibold">{title}</p><p className="mt-1 text-sm text-muted">{description}</p></div></div>;
}

function downloadFile(url: string, filename: string) {
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
}
