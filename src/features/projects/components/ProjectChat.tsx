import { Bot, MessageCircleQuestion } from "lucide-react";
import { useEffect, useRef } from "react";
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

  return (
    <article
      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${isUser ? "ml-auto bg-[var(--color-bg-selected)] text-[var(--color-text-action)]" : "bg-[var(--color-bg-surface)] shadow-sm"}`}
    >
      <p className="mb-1 text-xs font-semibold opacity-70">{isUser ? "You" : "Notebook"}</p>
      <p className="whitespace-pre-wrap">{content || (status === "STREAMING" ? "Thinking…" : "")}</p>
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
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center text-center">
        <span className="grid size-12 place-items-center rounded-full bg-[var(--color-bg-selected)] text-[var(--color-text-action)]">
          <MessageCircleQuestion size={22} />
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Ask your sources anything.</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
          Choose a conversation or write your first question below to explore this project.
        </p>
      </div>
    );
  }

  return (
    <div className="app-scrollbar mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 overflow-y-auto py-4 pr-2">
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
        <article className="max-w-[88%] rounded-2xl border border-[#f2cbc5] bg-[#fff7f5] px-4 py-3 text-sm leading-6 text-[var(--color-state-error)]">
          <p className="mb-1 text-xs font-semibold opacity-70">Notebook</p>
          <p>{assistantError}</p>
        </article>
      )}
      <div ref={bottom} />
    </div>
  );
}
