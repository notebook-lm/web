import { Download, FileText, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { projectDocumentRepository } from "../api";
import type { ProjectDocument } from "../model";

interface Props {
  projectId: string;
  document: ProjectDocument | null;
  onClose: () => void;
}

const textExtensions = new Set(["txt", "md", "csv", "json", "xml", "html"]);

function getExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

export function ProjectDocumentPreview({ projectId, document, onClose }: Props) {
  const [blob, setBlob] = useState<Blob>();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string>();

  const extension = document ? getExtension(document.originalFilename) : "";
  const isPdf = document?.contentType === "application/pdf" || extension === "pdf";
  const isText = document?.contentType.startsWith("text/") || textExtensions.has(extension);

  useEffect(() => {
    if (!document) return;
    let active = true;

    void Promise.resolve().then(() => {
      if (!active) return;
      setBlob(undefined);
      setText("");
      setError(false);
      setIsLoading(true);

      return projectDocumentRepository.content(projectId, document.id)
        .then(async (content) => {
          if (!active) return;
          setBlob(content);
          setObjectUrl(URL.createObjectURL(content));
          if (isText) setText(await content.text());
        })
        .catch(() => active && setError(true))
        .finally(() => active && setIsLoading(false));
    });

    return () => {
      active = false;
    };
  }, [document, isText, projectId]);

  useEffect(() => () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, [objectUrl]);

  useEffect(() => {
    if (!document) return;
    const handleEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [document, onClose]);

  if (!document) return null;

  const download = () => {
    if (!blob || !objectUrl) return toast.error("The document is still loading.");
    const anchor = window.document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = document.originalFilename;
    anchor.click();
  };

  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#15231f]/45 p-4" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
    <section aria-labelledby="document-preview-title" aria-modal="true" className="flex max-h-[min(760px,calc(100vh-2rem))] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[var(--color-bg-surface)] shadow-2xl" role="dialog">
      <header className="flex items-start justify-between gap-4 border-b border-[var(--color-border-default)] px-5 py-4 sm:px-6">
        <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-action)]">Source preview</p><h2 id="document-preview-title" className="mt-1 line-clamp-2 break-words text-lg font-semibold">{document.title}</h2></div>
        <div className="flex shrink-0 items-center gap-1"><button aria-label={`Download ${document.title}`} className="grid size-10 place-items-center rounded-full text-muted hover:bg-[var(--color-bg-surface-subtle)]" disabled={!blob} onClick={download} type="button"><Download size={18} /></button><button aria-label="Close document preview" className="grid size-10 place-items-center rounded-full text-muted hover:bg-[var(--color-bg-surface-subtle)]" onClick={onClose} type="button"><X size={19} /></button></div>
      </header>
      <div className="min-h-0 flex-1 overflow-auto bg-[var(--color-bg-canvas)] p-4 sm:p-6">
        {isLoading ? <div className="grid min-h-72 place-items-center"><LoaderCircle className="animate-spin text-muted" size={26} /></div>
          : error ? <PreviewMessage iconClass="text-[var(--color-state-error)]" title="We couldn’t load this document." description="Please try again in a moment." />
          : isPdf && objectUrl ? <iframe className="min-h-[65vh] w-full rounded-lg border border-[var(--color-border-default)] bg-white" src={objectUrl} title={document.title} />
          : isText ? <pre className="min-h-[50vh] whitespace-pre-wrap break-words rounded-lg bg-[var(--color-bg-surface)] p-5 font-mono text-sm leading-6 text-[var(--color-text-primary)]">{text}</pre>
          : <div className="grid min-h-72 place-items-center text-center"><div><FileText className="mx-auto text-[var(--color-text-action)]" size={32} /><p className="mt-4 text-sm font-semibold">Preview isn’t available for this file type.</p><p className="mt-1 max-w-sm text-sm text-muted">Download the original {extension ? `.${extension.toUpperCase()}` : "file"} document to view it in a compatible app.</p><button className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--color-bg-selected)] px-4 text-sm font-semibold text-[var(--color-text-action)]" disabled={!blob} onClick={download} type="button"><Download size={16} /> Download file</button></div></div>}
      </div>
    </section>
  </div>;
}

function PreviewMessage({ iconClass, title, description }: { iconClass: string; title: string; description: string }) {
  return <div className="grid min-h-72 place-items-center text-center"><div><FileText className={`mx-auto ${iconClass}`} size={28} /><p className="mt-3 text-sm font-semibold">{title}</p><p className="mt-1 text-sm text-muted">{description}</p></div></div>;
}
