import { toChatMessage, toConversation, type ChatMessage, type Conversation } from "../../model";
import { conversationApi, type CreateConversationRequest, type ListConversationsParams, type ListMessagesParams, type UpdateConversationRequest } from "./conversation.api";

export const conversationRepository = {
  list: async (projectId: string, params: ListConversationsParams = {}) => {
    const response = await conversationApi.list(projectId, params);
    return { ...response, items: response.items.map(toConversation) };
  },
  create: async (projectId: string, payload: CreateConversationRequest = {}) => toConversation(await conversationApi.create(projectId, payload)),
  update: async (projectId: string, conversationId: string, payload: UpdateConversationRequest) => toConversation(await conversationApi.update(projectId, conversationId, payload)),
  delete: (projectId: string, conversationId: string) => conversationApi.delete(projectId, conversationId),
  messages: async (projectId: string, conversationId: string, params: ListMessagesParams = {}) => {
    const response = await conversationApi.messages(projectId, conversationId, params);
    return { ...response, items: response.items.map(toChatMessage) };
  },
};

export type { ChatMessage, Conversation };
