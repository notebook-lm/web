import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints, getHttpAccessToken, handleHttpRefreshFailure, refreshHttpAccessToken } from "@/lib/api";
import { queryKeys } from "@/lib/query";
import type { ChatMessageResponse, CitationSource } from "../../../api/conversation";

type StreamMessageInput = {
  conversationId: string;
  content: string;
  onStarted: (message: ChatMessageResponse) => void;
  onDelta: (value: string) => void;
  onSources: (sources: CitationSource[]) => void;
  onDone: (message: ChatMessageResponse) => void;
  signal?: AbortSignal;
};

type ErrorPayload = { message?: string };
type DeltaPayload = { delta?: string };
type SourcesPayload = CitationSource[] | { sources?: CitationSource[] };

function parseSources(value: string): CitationSource[] {
  const payload = parseEventData<SourcesPayload>(value);
  return Array.isArray(payload) ? payload : (payload.sources ?? []);
}

function parseEventData<T>(value: string): T {
  return JSON.parse(value) as T;
}

function readEvent(frame: string) {
  const lines = frame.replace(/\r/g, "").split("\n");
  const event = lines.find((line) => line.startsWith("event:"))?.slice(6).trim() ?? "message";
  const data = lines
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");

  return { event, data };
}

export function useStreamMessage(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content, onStarted, onDelta, onSources, onDone, signal }: StreamMessageInput) => {
      const request = async (retry = true): Promise<Response> => {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}${endpoints.projects.streamMessages(projectId, conversationId)}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getHttpAccessToken() ?? ""}`,
              "Content-Type": "application/json",
              Accept: "text/event-stream",
            },
            body: JSON.stringify({ content }),
            signal,
          },
        );

        if (response.status !== 401 || !retry) return response;

        const error = (await response.json().catch(() => null)) as { code?: string } | null;
        if (error?.code !== "ACCESS_TOKEN_EXPIRED") return response;

        try {
          await refreshHttpAccessToken();
        } catch (refreshError) {
          handleHttpRefreshFailure();
          throw refreshError;
        }

        return request(false);
      };

      const response = await request();
      if (!response.ok || !response.body) {
        throw new Error("We couldn’t get an answer. Please try again.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;

      const consumeFrames = (flush = false) => {
        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = flush ? "" : (frames.pop() ?? "");

        for (const frame of frames) {
          const { event, data } = readEvent(frame);
          if (!data) continue;

          if (event === "started") {
            onStarted(parseEventData<ChatMessageResponse>(data));
            continue;
          }
          if (event === "message") {
            onDelta(parseEventData<DeltaPayload>(data).delta ?? "");
            continue;
          }
          if (event === "sources") {
            onSources(parseSources(data));
            continue;
          }
          if (event === "done") {
            onDone(parseEventData<ChatMessageResponse>(data));
            finished = true;
            continue;
          }
          if (event === "error") {
            throw new Error(parseEventData<ErrorPayload>(data).message || "We couldn’t get an answer. Please try again.");
          }
        }
      };

      try {
        while (!finished) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
          consumeFrames(done);
          if (done) break;
        }
      } finally {
        reader.releaseLock();
      }
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.projects.messages(projectId, variables.conversationId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.conversationsAll(projectId) });
    },
  });
}
