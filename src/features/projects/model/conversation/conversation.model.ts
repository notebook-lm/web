import type { CitationSource } from "../../api/conversation";

export interface Conversation { id: string; projectId: string; title: string; lastMessageAt?: Date | null; createdAt: Date; updatedAt: Date }
export interface ChatMessage { id: string; conversationId: string; role: string; content: string; status: string; provider?: string | null; sources?: CitationSource[]; createdAt: Date; updatedAt: Date }
