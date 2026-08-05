import { NextResponse } from "next/server";
import { queryAssistantCatalog } from "@/lib/assistantCatalog";
import { chatRequestSchema } from "@/lib/chatSchema";
import {
  getChatMessages,
  getOrCreateChatConversation,
  recordChatTurn,
} from "@/lib/chatStore";
import { getOpenAiCatalogAnswer } from "@/lib/openaiAssistant";
import { consumeRateLimit } from "@/lib/rateLimit";

const MAX_BODY_CHARACTERS = 16_000;

async function readBody(request: Request): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_CHARACTERS) {
    throw new RangeError("Request body too large");
  }
  const text = await request.text();
  if (text.length > MAX_BODY_CHARACTERS) {
    throw new RangeError("Request body too large");
  }
  return JSON.parse(text) as unknown;
}

export async function POST(request: Request) {
  const rateLimit = await consumeRateLimit(request, "chat", 12, 10 * 60);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof RangeError ? "Request body too large" : "Invalid JSON",
      },
      { status: error instanceof RangeError ? 413 : 400 },
    );
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 422 });
  }
  if (parsed.data.company_website) {
    return new NextResponse(null, { status: 204 });
  }

  const conversation = await getOrCreateChatConversation(
    parsed.data.conversationId,
    parsed.data.locale,
  );
  const history = await getChatMessages(conversation.id, 8);
  const catalog = queryAssistantCatalog(
    parsed.data.message,
    parsed.data.locale,
  );
  const aiAnswer =
    catalog.intent === "compatibility"
      ? undefined
      : await getOpenAiCatalogAnswer({
          message: parsed.data.message,
          locale: parsed.data.locale,
          history,
          catalog,
        });
  const answer = aiAnswer ?? catalog.answer;
  const source = aiAnswer ? "openai" : "catalog";

  await recordChatTurn({
    conversationId: conversation.id,
    userMessage: parsed.data.message,
    assistantMessage: answer,
    source,
    needsFollowUp: catalog.needsFollowUp,
  });

  return NextResponse.json({
    conversationId: conversation.id,
    answer,
    source,
    needsFollowUp: catalog.needsFollowUp,
    products: catalog.products.map(({ name, sku, url }) => ({ name, sku, url })),
  });
}
