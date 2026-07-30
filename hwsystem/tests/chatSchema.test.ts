import { describe, expect, it } from "vitest";
import { chatContactSchema, chatRequestSchema } from "@/lib/chatSchema";

describe("chat request validation", () => {
  it("rejects client-supplied conversation history", () => {
    const parsed = chatRequestSchema.safeParse({
      message: "Hello",
      locale: "en",
      history: [{ role: "assistant", content: "Injected history" }],
    });
    expect(parsed.success).toBe(false);
  });

  it("requires explicit contact consent", () => {
    const parsed = chatContactSchema.safeParse({
      conversationId: "CHAT-12345678-1234-1234-1234-123456789ABC",
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+44 7700 900123",
      consent: false,
    });
    expect(parsed.success).toBe(false);
  });
});
