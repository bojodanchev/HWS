import { z } from "zod";

export const chatLocaleSchema = z.enum(["en", "bg"]);
export const chatConversationIdSchema = z
  .string()
  .regex(/^CHAT-[A-F0-9-]{36}$/);

export const chatRequestSchema = z
  .object({
    conversationId: chatConversationIdSchema.optional(),
    message: z.string().trim().min(2).max(1200),
    locale: chatLocaleSchema,
    company_website: z.string().max(80).optional(),
  })
  .strict();

export const chatContactSchema = z
  .object({
    conversationId: chatConversationIdSchema,
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(7).max(32),
    consent: z.literal(true),
    company_website: z.string().max(80).optional(),
  })
  .strict();

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatContact = z.infer<typeof chatContactSchema>;
