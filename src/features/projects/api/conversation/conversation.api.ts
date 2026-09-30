import { endpoints, httpClient } from "@/lib/api";

export interface ConversationResponse {
  id: string;
  projectId: string;
  title: string;
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CitationSource {
  citationNumber: number;
  documentId: string;
  filename: string;
  chunkIndex: number;
  excerpt: string;
}

export interface ChatMessageResponse {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  status: string;
  provider?: string | null;
  sources?: CitationSource[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationPageResponse {
  items: ConversationResponse[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ChatMessagePageResponse {
  items: ChatMessageResponse[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ListConversationsParams {
  q?: string;
  page?: number;
  size?: number;
}

export interface ListMessagesParams {
  page?: number;
  size?: number;
}

export interface CreateConversationRequest { title?: string }
export interface UpdateConversationRequest { title: string }

function withQuery(path: string, params?: object) {
  if (!params) return path;
  const query = new URLSearchParams();
  Object.entries(params as Record<string, string | number | undefined>).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `${path}?${value}` : path;
}

export const conversationApi = {
  list: (projectId: string, params?: ListConversationsParams) =>
    httpClient.get<ConversationPageResponse>(withQuery(endpoints.projects.conversations(projectId), params)),
  create: (projectId: string, payload: CreateConversationRequest = {}) =>
    httpClient.post<ConversationResponse>(endpoints.projects.conversations(projectId), payload),
  get: (projectId: string, conversationId: string) =>
    httpClient.get<ConversationResponse>(endpoints.projects.conversationById(projectId, conversationId)),
  update: (projectId: string, conversationId: string, payload: UpdateConversationRequest) =>
    httpClient.patch<ConversationResponse>(endpoints.projects.conversationById(projectId, conversationId), payload),
  delete: (projectId: string, conversationId: string) =>
    httpClient.delete<void>(endpoints.projects.conversationById(projectId, conversationId)),
  messages: (projectId: string, conversationId: string, params?: ListMessagesParams) =>
    httpClient.get<ChatMessagePageResponse>(withQuery(endpoints.projects.messages(projectId, conversationId), params)),
  cancelMessage: (projectId: string, conversationId: string, messageId: string) =>
    httpClient.post<ChatMessageResponse>(endpoints.projects.cancelMessage(projectId, conversationId, messageId)),
};
