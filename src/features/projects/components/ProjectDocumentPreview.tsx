import { FileText, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getErrorMessage } from "@/shared/errors/error-message";
import { projectDocumentRepository } from "../api";
import type { ProjectDocument } from "../model";

interface Props {
  projectId: string;
  document: ProjectDocument | null;
  onClose: () => void;
}

export function ProjectDocumentPreview({ projectId, document, onClose }: Props) {
  const [content, setContent] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!document) return;
    let active = true;

    void Promise.resolve().then(async () => {
      if (!active) return;
      setContent(undefined);
      setErrorMessage(undefined);
      setIsLoading(true);

      try {
        const blob = await projectDocumentRepository.content(projectId, document.id);
        const text = await blob.text();
        if (active) setContent(text);
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

  useEffect(() => {
    if (!document) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [document, onClose]);

  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#15231f]/45 p-4" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <section aria-labelledby="document-preview-title" aria-modal="true" className="flex h-[min(760px,calc(100vh-2rem))] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[var(--color-bg-surface)] shadow-2xl" role="dialog">
        <PreviewHeader title={document.title} onClose={onClose} />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-5 sm:p-6">
          {isLoading ? (
            <div className="grid flex-1 place-items-center"><LoaderCircle className="animate-spin text-muted" size={26} /></div>
          ) : errorMessage ? (
            <PreviewMessage title="We couldn’t load this document." description={errorMessage} />
          ) : content !== undefined ? (
            <div className="app-scrollbar min-h-0 flex-1 overflow-y-auto rounded-xl bg-[#e8efeb] p-4 sm:p-5">
              <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6 text-[var(--color-text-primary)]">{content}</pre>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function PreviewHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return <header className="flex items-start justify-between gap-4 border-b border-[var(--color-border-default)] px-5 py-4 sm:px-6"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-action)]">Source preview</p><h2 id="document-preview-title" className="mt-1 line-clamp-2 break-words text-lg font-semibold">{title}</h2></div><button aria-label="Close document preview" className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-[var(--color-bg-surface-subtle)]" onClick={onClose} type="button"><X size={19} /></button></header>;
}

function PreviewMessage({ title, description }: { title: string; description: string }) {
  return <div className="grid flex-1 place-items-center text-center"><div><FileText className="mx-auto text-[var(--color-state-error)]" size={28} /><p className="mt-3 text-sm font-semibold">{title}</p><p className="mt-1 text-sm text-muted">{description}</p></div></div>;
}
