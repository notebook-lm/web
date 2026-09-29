import { Bot, MessageCircleQuestion } from "lucide-react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getErrorMessage } from "@/shared/errors/error-message";
import type { ChatMessageResponse } from "../api/conversation";
import { useMessages } from "../hooks";

interface Props {
  projectId: string;
  conversationId?: string;
  assistantMessage?: ChatMessageResponse;
  assistantError?: string;
  pendingUserMessage?: string;
}

function MessageBubble({ content, role, status }: { content: string; role: string; status?: string }) {
  const isUser = role.toLowerCase() === "user";
  const messageContent = content || (status === "STREAMING" ? "Thinking…" : "");

  return (
    <article
      className={`max-w-[94%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[88%] ${isUser ? "ml-auto bg-[var(--color-bg-selected)] text-[var(--color-text-action)]" : "bg-[var(--color-bg-surface)] shadow-sm"}`}
    >
      <p className="mb-1 text-xs font-semibold opacity-70">{isUser ? "You" : "Notebook"}</p>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, ...props }) => <a className="font-medium underline underline-offset-2 hover:opacity-75" rel="noreferrer" target="_blank" {...props}>{children}</a>,
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
        {messageContent}
      </ReactMarkdown>
      {status === "CANCELLED" && (
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted">Generation stopped</p>
      )}
    </article>
  );
}

export function ProjectChat({
  projectId,
  conversationId,
  assistantMessage,
  assistantError,
  pendingUserMessage,
}: Props) {
  const { data, isLoading, isError, error } = useMessages(projectId, conversationId);
  const bottom = useRef<HTMLDivElement>(null);
  const localAssistantIsPersisted = data?.items.some((message) => message.id === assistantMessage?.id);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [assistantMessage, data?.items, pendingUserMessage]);

  if (!conversationId && !pendingUserMessage) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-2 text-center sm:px-4">
        <span className="grid size-12 place-items-center rounded-full bg-[var(--color-bg-selected)] text-[var(--color-text-action)]">
          <MessageCircleQuestion size={22} />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Ask your sources anything.</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
          Choose a conversation or write your first question below to explore this project.
        </p>
      </div>
    );
  }

  return (
    <div className="app-scrollbar mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto py-3 pr-1 sm:gap-5 sm:py-4 sm:pr-2">
      {isLoading && <p className="text-center text-sm text-muted">Loading messages…</p>}
      {isError && (
        <p className="rounded-[var(--radius-xs)] bg-[#fff0ee] p-4 text-sm text-[var(--color-state-error)]">
          {getErrorMessage(error, "Couldn’t load messages.")}
        </p>
      )}
      {!isLoading && !isError && !data?.items.length && !pendingUserMessage && !assistantMessage && (
        <div className="my-auto text-center">
          <Bot className="mx-auto text-[var(--color-text-action)]" size={28} />
          <p className="mt-3 text-sm text-muted">This chat is ready when you are.</p>
        </div>
      )}
      {data?.items.map((message) => (
        <MessageBubble content={message.content} key={message.id} role={message.role} status={message.status} />
      ))}
      {pendingUserMessage && <MessageBubble content={pendingUserMessage} role="USER" />}
      {assistantMessage && !localAssistantIsPersisted && (
        <MessageBubble
          content={assistantMessage.content}
          role={assistantMessage.role}
          status={assistantMessage.status}
        />
      )}
      {assistantError && (
        <article className="max-w-[94%] rounded-2xl border border-[#f2cbc5] bg-[#fff7f5] px-4 py-3 text-sm leading-6 text-[var(--color-state-error)] sm:max-w-[88%]">
          <p className="mb-1 text-xs font-semibold opacity-70">Notebook</p>
          <p>{assistantError}</p>
        </article>
      )}
      <div ref={bottom} />
    </div>
  );
}
