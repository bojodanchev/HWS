export type ChatLocale = "en" | "bg";
export type ChatRole = "user" | "assistant";
export type ChatAnswerSource = "catalog" | "openai";
export type ChatConversationStatus =
  | "active"
  | "needs_follow_up"
  | "contacted"
  | "closed";

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  source?: ChatAnswerSource;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  locale: ChatLocale;
  status: ChatConversationStatus;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  messageCount: number;
}

export interface AssistantProduct {
  name: string;
  sku: string;
  brand: string;
  category: string;
  shortDescription: string;
  compatibility: string[];
  price: string;
  stock: string;
  specs: string[];
  url: string;
}
