import { FileText, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUploadProjectDocument } from "../hooks";

interface Props {
  projectId: string;
  open: boolean;
  onClose: () => void;
}
const extensions = [
  "pdf",
  "docx",
  "doc",
  "xlsx",
  "xls",
  "pptx",
  "ppt",
  "md",
  "txt",
];
const accept = ".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.md,.txt";

export function ProjectDocumentUpload({ projectId, open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"file" | "text">("file");
  const [file, setFile] = useState<File>();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const { mutateAsync: upload, isPending } = useUploadProjectDocument();
  const close = () => {
    if (!isPending) {
      setFile(undefined);
      setTitle("");
      setText("");
      setMode("file");
      onClose();
    }
  };
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    if (open) window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  });
  if (!open) return null;
  const choose = (candidate?: File) => {
    if (!candidate) return;
    const ext = candidate.name.split(".").pop()?.toLowerCase();
    if (!ext || !extensions.includes(ext)) {
      toast.error("Choose a PDF, Office, Markdown, or text document.");
      return;
    }
    setFile(candidate);
    if (!title) setTitle(candidate.name.replace(/\.[^.]+$/, ""));
  };
  const submit = async () => {
    const source =
      mode === "file"
        ? file
        : text.trim()
          ? new File([text], `${title.trim() || "Pasted notes"}.txt`, {
              type: "text/plain;charset=utf-8",
            })
          : undefined;
    if (!source) {
      toast.error(
        mode === "file"
          ? "Choose a file to upload."
          : "Enter some text to add as a source.",
      );
      return;
    }
    await upload({ projectId, file: source, title: title.trim() || undefined });
    toast.success("Source added.");
    close();
  };
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#15231f]/35 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) close();
      }}
    >
      <section
        aria-labelledby="add-source-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl bg-[var(--color-bg-surface)] p-5 shadow-2xl sm:p-7"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-text-action)]">
              Project sources
            </p>
            <h2 id="add-source-title" className="mt-2 text-xl font-semibold">
              Add a source
            </h2>
          </div>
          <button
            aria-label="Close add source dialog"
            className="grid size-10 place-items-center rounded-full text-muted hover:bg-[var(--color-bg-surface-subtle)]"
            disabled={isPending}
            onClick={close}
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 grid grid-cols-2 rounded-xl bg-[var(--color-bg-surface-subtle)] p-1">
          <button
            className={`min-h-10 rounded-lg text-sm font-semibold ${mode === "file" ? "bg-[var(--color-bg-surface)] text-[var(--color-text-action)] shadow-sm" : "text-muted"}`}
            onClick={() => setMode("file")}
            type="button"
          >
            Upload file
          </button>
          <button
            className={`min-h-10 rounded-lg text-sm font-semibold ${mode === "text" ? "bg-[var(--color-bg-surface)] text-[var(--color-text-action)] shadow-sm" : "text-muted"}`}
            onClick={() => setMode("text")}
            type="button"
          >
            Paste text
          </button>
        </div>
        <label
          className="mt-5 block text-xs font-semibold text-muted"
          htmlFor="source-title"
        >
          Source title <span className="font-normal">(optional)</span>
        </label>
        <input
          className="mt-2 min-h-11 w-full rounded-lg bg-[var(--color-bg-surface-subtle)] px-3 text-sm outline-none"
          id="source-title"
          maxLength={255}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={
            mode === "file" ? "Use file name" : "e.g. Interview notes"
          }
          value={title}
        />
        {mode === "file" ? (
          <>
            <input
              ref={inputRef}
              accept={accept}
              className="sr-only"
              id="source-file"
              onChange={(event) => choose(event.target.files?.[0])}
              type="file"
            />
            <button
              className="mt-4 grid min-h-40 w-full place-items-center rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-bg-surface-subtle)] p-5 text-center hover:bg-[var(--color-bg-selected)]"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                choose(event.dataTransfer.files[0]);
              }}
              type="button"
            >
              <span>
                <Upload
                  className="mx-auto text-[var(--color-text-action)]"
                  size={22}
                />
                <span className="mt-3 block text-sm font-semibold">
                  {file ? file.name : "Drop a file here or browse"}
                </span>
                <span className="mt-1 block text-xs text-muted">
                  PDF, Office, Markdown, or text files
                </span>
              </span>
            </button>
          </>
        ) : (
          <textarea
            className="mt-4 min-h-40 w-full resize-y rounded-xl bg-[var(--color-bg-surface-subtle)] p-3 text-sm outline-none"
            id="source-text"
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste notes, an article excerpt, or any text you want to reference."
            value={text}
          />
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="min-h-11 rounded-full px-4 text-sm font-semibold text-muted hover:bg-[var(--color-bg-surface-subtle)]"
            disabled={isPending}
            onClick={close}
            type="button"
          >
            Close
          </button>
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-text-action)] px-5 text-sm font-semibold text-white disabled:opacity-60"
            disabled={isPending}
            onClick={() => void submit()}
            type="button"
          >
            {isPending ? "Adding…" : "Add source"}
            <FileText size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
