import { Bot, MessageCircleQuestion, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { defaultUrlTransform } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getErrorMessage } from "@/shared/errors/error-message";
import type { ChatMessageResponse, CitationSource } from "../api/conversation";
import { useMessages } from "../hooks";

interface Props {
  projectId: string;
  conversationId?: string;
  assistantMessage?: ChatMessageResponse;
  assistantError?: string;
  pendingUserMessage?: string;
}

function withCitationLinks(content: string) {
  return content.replace(/\[\^(\d+)\]/g, (_, citationNumber: string) => `[${citationNumber}](citation:${citationNumber})`);
}

function CitationChip({ citation, citationNumber }: { citation?: CitationSource; citationNumber: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!citation) {
    return <sup className="mx-0.5 inline-flex size-5 items-center justify-center rounded-md bg-[var(--color-text-action)] text-[10px] font-bold text-white">{citationNumber}</sup>;
  }

  const keepTooltipOpen = () => {
    if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current);
    setIsHovered(true);
  };
  const scheduleTooltipClose = () => {
    hoverCloseTimer.current = window.setTimeout(() => setIsHovered(false), 180);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <span
        className="relative mx-0.5 inline-flex align-baseline"
        onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && scheduleTooltipClose()}
        onMouseEnter={keepTooltipOpen}
        onMouseLeave={scheduleTooltipClose}
      >
        <button
          aria-describedby={`citation-detail-${citation.citationNumber}`}
          aria-expanded={isModalOpen}
          className="inline-flex size-5 items-center justify-center rounded-md bg-[var(--color-text-action)] text-[10px] font-bold leading-none text-white shadow-sm transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-text-action)] focus:ring-offset-1"
          id={`citation-${citation.documentId}-${citation.citationNumber}`}
          onClick={() => setIsModalOpen(true)}
          onFocus={keepTooltipOpen}
          type="button"
        >
          {citation.citationNumber}
        </button>
        {isHovered && !isModalOpen && (
          <span className="absolute bottom-full left-0 z-30 w-72 rounded-xl bg-[var(--color-bg-surface)] p-3 text-left text-xs font-normal leading-5 text-[var(--color-text-primary)] shadow-xl sm:w-80" id={`citation-detail-${citation.citationNumber}`} role="tooltip">
            <span className="block truncate font-semibold text-[var(--color-text-action)]" title={citation.filename}>{citation.filename}</span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-muted">Chunk {citation.chunkIndex} · Click to read</span>
            <span className="app-scrollbar mt-2 block max-h-36 overflow-y-auto whitespace-pre-wrap rounded-md bg-[var(--color-bg-surface-subtle)] p-2 pr-1 text-[11px] leading-4 text-muted">{citation.excerpt}</span>
          </span>
        )}
      </span>
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[#15231f]/55 p-4 backdrop-blur-sm" onMouseDown={(event) => event.currentTarget === event.target && closeModal()} role="presentation">
          <section aria-labelledby={`citation-modal-title-${citation.citationNumber}`} aria-modal="true" className="flex max-h-[min(760px,calc(100dvh-2rem))] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[var(--color-bg-surface)] shadow-2xl" role="dialog">
            <header className="flex items-start justify-between gap-4 border-b border-[var(--color-border-default)] px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-action)]">Citation {citation.citationNumber} · Chunk {citation.chunkIndex}</p>
                <h2 className="mt-1 truncate text-lg font-semibold" id={`citation-modal-title-${citation.citationNumber}`} title={citation.filename}>{citation.filename}</h2>
              </div>
              <button aria-label="Close citation" className="grid size-10 shrink-0 place-items-center rounded-full text-muted transition hover:bg-[var(--color-bg-surface-subtle)]" onClick={closeModal} type="button"><X size={19} /></button>
            </header>
            <div className="app-scrollbar min-h-0 overflow-y-auto p-5 sm:p-6">
              <p className="whitespace-pre-wrap break-words rounded-xl bg-[var(--color-bg-surface-subtle)] p-4 text-sm leading-7 text-[var(--color-text-primary)] sm:p-5">{citation.excerpt}</p>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function MessageBubble({ content, role, sources, status }: { content: string; role: string; sources?: CitationSource[]; status?: string }) {
  const isUser = role.toLowerCase() === "user";
  const messageContent = content || (status === "STREAMING" ? "Thinking…" : "");
  const sourcesByNumber = new Map((Array.isArray(sources) ? sources : []).map((source) => [source.citationNumber, source]));

  return (
    <article className={`max-w-[94%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[88%] ${isUser ? "ml-auto bg-[var(--color-bg-selected)] text-[var(--color-text-action)]" : "bg-[var(--color-bg-surface)] shadow-sm"}`}>
      <p className="mb-1 text-xs font-semibold opacity-70">{isUser ? "You" : "Notebook"}</p>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) => url.startsWith("citation:") ? url : defaultUrlTransform(url)}
        components={{
          a: ({ children, href, ...props }) => {
            const citationMatch = href?.match(/^citation:(\d+)$/);
            if (citationMatch) {
              const citationNumber = Number(citationMatch[1]);
              return <CitationChip citation={sourcesByNumber.get(citationNumber)} citationNumber={citationNumber} />;
            }
            return <a className="font-medium underline underline-offset-2 hover:opacity-75" rel="noreferrer" target="_blank" {...props} href={href}>{children}</a>;
          },
          blockquote: ({ children }) => <blockquote className="my-2 border-l-2 border-current/30 pl-3 opacity-80">{children}</blockquote>,
          code: ({ children, className, ...props }) => className ? <code className={`block overflow-x-auto rounded-lg bg-black/8 p-3 font-mono text-xs leading-5 ${className}`} {...props}>{children}</code> : <code className="rounded bg-black/8 px-1 py-0.5 font-mono text-[0.85em]" {...props}>{children}</code>,
          h1: ({ children }) => <h3 className="mb-2 mt-3 text-lg font-bold leading-7 first:mt-0">{children}</h3>,
          h2: ({ children }) => <h4 className="mb-2 mt-3 text-base font-bold leading-6 first:mt-0">{children}</h4>,
          h3: ({ children }) => <h5 className="mb-1 mt-3 text-sm font-bold first:mt-0">{children}</h5>,
          li: ({ children }) => <li className="ml-5 pl-1">{children}</li>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1">{children}</ol>,
          p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
          pre: ({ children }) => <pre className="my-2 whitespace-pre-wrap first:mt-0 last:mb-0">{children}</pre>,
          table: ({ children }) => <div className="my-2 overflow-x-auto"><table className="w-full border-collapse text-left text-xs">{children}</table></div>,
          td: ({ children }) => <td className="border border-current/15 px-2 py-1 align-top">{children}</td>,
          th: ({ children }) => <th className="border border-current/15 bg-black/5 px-2 py-1 text-left font-semibold">{children}</th>,
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1">{children}</ul>,
        }}
      >
        {withCitationLinks(messageContent)}
      </ReactMarkdown>
      {status === "CANCELLED" && <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted">Generation stopped</p>}
    </article>
  );
}

export function ProjectChat({ projectId, conversationId, assistantMessage, assistantError, pendingUserMessage }: Props) {
  const { data, isLoading, isError, error } = useMessages(projectId, conversationId);
  const bottom = useRef<HTMLDivElement>(null);
  const localAssistantIsPersisted = data?.items.some((message) => message.id === assistantMessage?.id);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [assistantMessage, data?.items, pendingUserMessage]);

  if (!conversationId && !pendingUserMessage) {
    return <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-2 text-center sm:px-4"><span className="grid size-12 place-items-center rounded-full bg-[var(--color-bg-selected)] text-[var(--color-text-action)]"><MessageCircleQuestion size={22} /></span><h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Ask your sources anything.</h1><p className="mt-3 max-w-lg text-sm leading-6 text-muted">Choose a conversation or write your first question below to explore this project.</p></div>;
  }

  return (
    <div className="app-scrollbar mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto py-3 pr-1 sm:gap-5 sm:py-4 sm:pr-2">
      {isLoading && <p className="text-center text-sm text-muted">Loading messages…</p>}
      {isError && <p className="rounded-[var(--radius-xs)] bg-[#fff0ee] p-4 text-sm text-[var(--color-state-error)]">{getErrorMessage(error, "Couldn’t load messages.")}</p>}
      {!isLoading && !isError && !data?.items.length && !pendingUserMessage && !assistantMessage && <div className="my-auto text-center"><Bot className="mx-auto text-[var(--color-text-action)]" size={28} /><p className="mt-3 text-sm text-muted">This chat is ready when you are.</p></div>}
      {data?.items.map((message) => <MessageBubble content={message.content} key={message.id} role={message.role} sources={message.sources} status={message.status} />)}
      {pendingUserMessage && <MessageBubble content={pendingUserMessage} role="USER" />}
      {assistantMessage && !localAssistantIsPersisted && <MessageBubble content={assistantMessage.content} role={assistantMessage.role} sources={assistantMessage.sources} status={assistantMessage.status} />}
      {assistantError && <article className="max-w-[94%] rounded-2xl border border-[#f2cbc5] bg-[#fff7f5] px-4 py-3 text-sm leading-6 text-[var(--color-state-error)] sm:max-w-[88%]"><p className="mb-1 text-xs font-semibold opacity-70">Notebook</p><p>{assistantError}</p></article>}
      <div ref={bottom} />
    </div>
  );
}
