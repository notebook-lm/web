import { useRef, useState } from "react";
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
  const [conversationId, setConversationId] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] = useState("");
  const [assistantMessage, setAssistantMessage] = useState<ChatMessageResponse>();
  const activeRequest = useRef<AbortController | null>(null);
  const assistantMessageId = useRef<string | null>(null);
  const stoppedByUser = useRef(false);
  const create = useCreateConversation(project.id);
  const stream = useStreamMessage(project.id);

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

    try {
      let id = conversationId;
      if (!id) {
        const conversation = await create.mutateAsync(content.slice(0, 48));
        id = conversation.id;
        setConversationId(id);
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
    } catch (error) {
      if (!stoppedByUser.current && !(error instanceof DOMException && error.name === "AbortError")) {
        toast.error(getErrorMessage(error, "We couldn’t send your question. Please try again."));
      }
    } finally {
      if (!stoppedByUser.current) setIsGenerating(false);
      setPendingUserMessage("");
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  };

  return (
    <section className="flex h-svh min-h-0 flex-col overflow-hidden bg-[var(--color-bg-canvas)]">
      <ProjectWorkspaceHeader onOpenDetails={onOpenDetails} project={project} />
      <div className="grid min-h-0 flex-1 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)_310px]">
        <aside className="grid min-h-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] border-r border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
          <ProjectConversationsPanel
            activeId={conversationId}
            onSelect={(id) => {
              setAssistantMessage(undefined);
              setPendingUserMessage("");
              setConversationId(id);
            }}
            projectId={project.id}
          />
          <ProjectSourcesPanel project={project} />
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col px-5 py-5 sm:px-8 xl:px-10">
          <ProjectChat
            assistantMessage={assistantMessage}
            conversationId={conversationId}
            isStreaming={isGenerating}
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

        <ProjectStudioPanel />
      </div>
    </section>
  );
}
