import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/errors/error-message";
import { conversationApi, type ChatMessageResponse } from "../api/conversation";
import { useCreateConversation, useStreamMessage } from "../hooks";
import type { Project } from "../model";
import { ProjectChat } from "./ProjectChat";
import { ProjectChatComposer } from "./ProjectChatComposer";
import { ProjectConversationsPanel } from "./ProjectConversationsPanel";
import { ProjectSourcesPanel } from "./ProjectSourcesPanel";
import { ProjectStudioPanel } from "./ProjectStudioPanel";
import { ProjectWorkspaceHeader } from "./ProjectWorkspaceHeader";

interface Props {
  project: Project;
  onOpenDetails: () => void;
}

export function ProjectWorkspace({ project, onOpenDetails }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationId = searchParams.get("conversation") ?? undefined;
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] = useState("");
  const [assistantMessage, setAssistantMessage] = useState<ChatMessageResponse>();
  const [assistantError, setAssistantError] = useState("");
  const activeRequest = useRef<AbortController | null>(null);
  const assistantMessageId = useRef<string | null>(null);
  const stoppedByUser = useRef(false);
  const create = useCreateConversation(project.id);
  const stream = useStreamMessage(project.id);

  const selectConversation = (id: string) => {
    setAssistantError("");
    setAssistantMessage(undefined);
    setPendingUserMessage("");
    setSearchParams({ conversation: id });
  };

  const cancel = async () => {
    const controller = activeRequest.current;
    if (!controller || stoppedByUser.current) return;

    stoppedByUser.current = true;
    setIsGenerating(false);
    controller.abort();

    const id = assistantMessageId.current;
    const activeConversationId = conversationId;
    if (!id || !activeConversationId) return;

    try {
      const cancelled = await conversationApi.cancelMessage(project.id, activeConversationId, id);
      setAssistantMessage(cancelled);
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn’t stop this answer. Please try again."));
    }
  };

  const send = async (content: string) => {
    const controller = new AbortController();
    activeRequest.current = controller;
    assistantMessageId.current = null;
    stoppedByUser.current = false;
    setIsGenerating(true);
    setPendingUserMessage(content);
    setAssistantMessage(undefined);
    setAssistantError("");

    try {
      let id = conversationId;
      if (!id) {
        const conversation = await create.mutateAsync(content.slice(0, 48));
        id = conversation.id;
        setSearchParams({ conversation: id });
      }

      await stream.mutateAsync({
        conversationId: id,
        content,
        onStarted: (message) => {
          assistantMessageId.current = message.id;
          setAssistantMessage(message);

          if (stoppedByUser.current) {
            void conversationApi.cancelMessage(project.id, id, message.id).then(setAssistantMessage);
          }
        },
        onDelta: (delta) => {
          if (!stoppedByUser.current) {
            setAssistantMessage((current) => current && { ...current, content: current.content + delta });
          }
        },
        onDone: (message) => setAssistantMessage(message),
        signal: controller.signal,
      });
      setPendingUserMessage("");
    } catch (error) {
      if (!stoppedByUser.current && !(error instanceof DOMException && error.name === "AbortError")) {
        const message = getErrorMessage(error, "We couldn’t get an answer. Please try again.");
        setAssistantError(message);
        toast.error(message);
      }
    } finally {
      if (!stoppedByUser.current) setIsGenerating(false);
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  };

  const [mobilePanel, setMobilePanel] = useState<"chats" | "sources" | "studio" | null>(null);

  const closeMobilePanel = () => setMobilePanel(null);

  return (
    <section className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--color-bg-canvas)]">
      <ProjectWorkspaceHeader
        onOpenChats={() => setMobilePanel("chats")}
        onOpenDetails={onOpenDetails}
        onOpenSources={() => setMobilePanel("sources")}
        onOpenStudio={() => setMobilePanel("studio")}
        project={project}
      />

      <div className="grid min-h-0 flex-1 xl:grid-cols-[290px_minmax(0,1fr)_310px]">
        <aside className="hidden min-h-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] border-r border-[var(--color-border-default)] bg-[var(--color-bg-surface)] xl:grid">
          <ProjectConversationsPanel activeId={conversationId} onSelect={selectConversation} projectId={project.id} />
          <ProjectSourcesPanel project={project} />
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col px-3 py-3 sm:px-6 sm:py-5 lg:px-8 xl:px-10">
          <ProjectChat
            assistantError={assistantError}
            assistantMessage={assistantMessage}
            conversationId={conversationId}
            pendingUserMessage={pendingUserMessage}
            projectId={project.id}
          />
          <ProjectChatComposer
            disabled={create.isPending}
            isStreaming={isGenerating}
            onCancel={() => void cancel()}
            onSend={send}
          />
        </main>

        <div className="hidden xl:block">
          <ProjectStudioPanel />
        </div>
      </div>

      {mobilePanel && (
        <div className="fixed inset-0 z-50 xl:hidden" role="presentation">
          <button
            aria-label="Close workspace panel"
            className="absolute inset-0 bg-[#11221e]/35 backdrop-blur-[1px]"
            onClick={closeMobilePanel}
            type="button"
          />
          <aside
            aria-label={
              mobilePanel === "chats"
                ? "Chat sessions panel"
                : mobilePanel === "sources"
                  ? "Sources panel"
                  : "Studio panel"
            }
            aria-modal="true"
            className="absolute inset-y-0 left-0 flex w-[min(100%,25rem)] flex-col overflow-hidden border-r border-[var(--color-border-default)] bg-[var(--color-bg-surface)] shadow-[16px_0_40px_rgba(21,36,30,0.18)]"
            role="dialog"
          >
            <div className="flex min-h-16 items-center justify-between border-b border-[var(--color-border-default)] px-4 sm:px-5">
              <p className="text-sm font-bold">
                {mobilePanel === "chats"
                  ? "Chat sessions"
                  : mobilePanel === "sources"
                    ? "Sources"
                    : "Studio"}
              </p>
              <button
                aria-label="Close workspace panel"
                className="grid size-11 place-items-center rounded-full text-muted hover:bg-[var(--color-bg-surface-subtle)]"
                onClick={closeMobilePanel}
                type="button"
              >
                <X size={19} />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              {mobilePanel === "chats" ? (
                <ProjectConversationsPanel
                  activeId={conversationId}
                  onSelect={(id) => {
                    selectConversation(id);
                    closeMobilePanel();
                  }}
                  projectId={project.id}
                />
              ) : mobilePanel === "sources" ? (
                <ProjectSourcesPanel project={project} />
              ) : (
                <ProjectStudioPanel compact />
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
