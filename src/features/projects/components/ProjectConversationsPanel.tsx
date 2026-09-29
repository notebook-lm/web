import { Check, ChevronLeft, ChevronRight, MessageSquare, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { getErrorMessage } from "@/shared/errors/error-message";
import { useConversations, useCreateConversation, useDeleteConversation, useRenameConversation } from "../hooks";

interface Props {
  projectId: string;
  activeId?: string;
  onSelect: (id: string) => void;
}

export function ProjectConversationsPanel({ projectId, activeId, onSelect }: Props) {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error, isFetching } = useConversations(projectId, { page, size: 10 });
  const create = useCreateConversation(projectId);
  const rename = useRenameConversation(projectId);
  const remove = useDeleteConversation(projectId);
  const [editing, setEditing] = useState<string>();
  const [title, setTitle] = useState("");

  const createConversation = async () => {
    const value = await create.mutateAsync("New conversation");
    onSelect(value.id);
  };

  return (
    <section aria-label="Chat sessions" className="flex min-h-0 flex-col border-b border-[var(--color-border-default)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Chat sessions</h2>
          <p className="mt-1 text-xs text-muted">Your chats for this project.</p>
        </div>
        <button
          aria-label="New conversation"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--color-bg-selected)] text-[var(--color-text-action)] transition hover:brightness-98 disabled:opacity-50"
          disabled={create.isPending}
          id="new-conversation"
          onClick={() => void createConversation()}
          type="button"
        >
          <Plus size={17} />
        </button>
      </div>

      <div className="app-scrollbar mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {isLoading && <p className="p-3 text-sm text-muted">Loading conversations…</p>}
        {isError && <p className="p-3 text-sm text-[var(--color-state-error)]">{getErrorMessage(error, "Couldn’t load conversations.")}</p>}
        {!isLoading && !isError && !data?.items.length && (
          <p className="rounded-xl bg-[var(--color-bg-surface-subtle)] p-3 text-sm leading-5 text-muted">
            Start a conversation to ask about your sources.
          </p>
        )}
        {data?.items.map((conversation) => (
          <div
            className={`group flex items-center gap-1 rounded-xl ${activeId === conversation.id ? "bg-[var(--color-bg-selected)]" : "hover:bg-[var(--color-bg-surface-subtle)]"}`}
            key={conversation.id}
          >
            {editing === conversation.id ? (
              <>
                <input
                  autoFocus
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                  onChange={(event) => setTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && title.trim()) {
                      void rename.mutateAsync({ conversationId: conversation.id, title: title.trim() }).then(() => setEditing(undefined));
                    }
                  }}
                  value={title}
                />
                <button aria-label="Save conversation name" className="p-2" onClick={() => void rename.mutateAsync({ conversationId: conversation.id, title }).then(() => setEditing(undefined))} type="button">
                  <Check size={15} />
                </button>
              </>
            ) : (
              <>
                <button className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-left text-sm" onClick={() => onSelect(conversation.id)} type="button">
                  <MessageSquare size={15} className="shrink-0" />
                  <span className="truncate">{conversation.title || "Untitled conversation"}</span>
                </button>
                <button aria-label="Rename conversation" className="p-2 opacity-70 transition hover:opacity-100 xl:hidden xl:group-hover:block" onClick={() => { setEditing(conversation.id); setTitle(conversation.title); }} type="button">
                  <Pencil size={14} />
                </button>
                <button aria-label="Delete conversation" className="p-2 text-[var(--color-state-error)] opacity-70 transition hover:opacity-100 xl:hidden xl:group-hover:block" onClick={() => void remove.mutateAsync(conversation.id)} type="button">
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <nav aria-label="Chat session pagination" className="mt-3 flex shrink-0 items-center justify-between border-t border-[var(--color-border-default)] pt-3">
          <span className="text-xs text-muted">{data.page + 1} / {data.totalPages}</span>
          <div className="flex gap-1">
            <button aria-label="Previous chat session page" className="grid size-9 place-items-center rounded-full hover:bg-[var(--color-bg-surface-subtle)] disabled:cursor-not-allowed disabled:opacity-40" disabled={!data.hasPrevious || isFetching} onClick={() => setPage((current) => Math.max(0, current - 1))} type="button"><ChevronLeft size={16} /></button>
            <button aria-label="Next chat session page" className="grid size-9 place-items-center rounded-full hover:bg-[var(--color-bg-surface-subtle)] disabled:cursor-not-allowed disabled:opacity-40" disabled={!data.hasNext || isFetching} onClick={() => setPage((current) => current + 1)} type="button"><ChevronRight size={16} /></button>
          </div>
        </nav>
      )}
    </section>
  );
}
