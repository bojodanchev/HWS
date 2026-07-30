import { NextResponse } from "next/server";
import { chatContactSchema } from "@/lib/chatSchema";
import { saveChatContact } from "@/lib/chatStore";
import { consumeRateLimit } from "@/lib/rateLimit";

const MAX_BODY_CHARACTERS = 8_000;

export async function POST(request: Request) {
  const rateLimit = await consumeRateLimit(request, "chat-contact", 5, 60 * 60);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const text = await request.text();
  if (text.length > MAX_BODY_CHARACTERS) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = chatContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid contact details" }, { status: 422 });
  }
  if (parsed.data.company_website) {
    return new NextResponse(null, { status: 204 });
  }

  const saved = await saveChatContact(parsed.data);
  if (!saved) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }
  return NextResponse.json({ saved: true });
}
