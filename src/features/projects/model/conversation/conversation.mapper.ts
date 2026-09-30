import type { ChatMessageResponse, ConversationResponse } from "../../api/conversation";
import type { ChatMessage, Conversation } from "./conversation.model";
export const toConversation = (value: ConversationResponse): Conversation => ({ ...value, lastMessageAt: value.lastMessageAt ? new Date(value.lastMessageAt) : null, createdAt: new Date(value.createdAt), updatedAt: new Date(value.updatedAt) });
export const toChatMessage = (value: ChatMessageResponse): ChatMessage => ({ ...value, createdAt: new Date(value.createdAt), updatedAt: new Date(value.updatedAt) });
