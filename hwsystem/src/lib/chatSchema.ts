import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(1200),
});

export const chatRequestSchema = z.object({
  message: z.string().trim().min(2).max(1200),
  history: z.array(chatMessageSchema).max(8),
  company_website: z.string().max(0).optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
