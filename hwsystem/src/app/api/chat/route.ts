import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/chatSchema";
import { formatGBP, getProducts, searchProducts } from "@/lib/catalog";
import { recordChatQuestion } from "@/lib/adminOps";

type OpenAIResponse = {
  choices?: { message?: { content?: string } }[];
};

const LANGUAGE_HINT = /[\u0400-\u04ff]/;

function catalogContext(): string {
  return getProducts()
    .map((product) => {
      const specs = product.specs
        .map((spec) => `${spec.key}: ${spec.value}${spec.unit ? ` ${spec.unit}` : ""}`)
        .join(", ");
      return [
        product.name,
        `SKU ${product.sku}`,
        `${formatGBP(product.price.rrp)} ex VAT`,
        `stock: ${product.stock.status}`,
        `compatibility: ${product.compatibility.join(", ") || "not specified"}`,
        specs,
        `URL: /products/${product.category}/${product.slug}`,
      ].join(" | ");
    })
    .join("\n");
}

function fallbackAnswer(message: string): string {
  const Bulgarian = LANGUAGE_HINT.test(message);
  const translatedQuery = /мотори?|двигатели?/i.test(message)
    ? "motor"
    : /дистанционни?/i.test(message)
      ? "remote"
      : /фотоклетки?/i.test(message)
        ? "photocell"
        : /контролни? панели?/i.test(message)
          ? "control panel"
          : message;
  const matches = searchProducts(translatedQuery).slice(0, 3);
  if (matches.length === 0) {
    return Bulgarian
      ? "Не намирам сигурен отговор в продуктовия каталог. Оставете запитване през формата за оферта и екипът ни ще провери точната съвместимост."
      : "I cannot find a reliable answer in the product catalogue. Please send a quote request and our team will confirm the exact compatibility.";
  }
  const names = matches
    .map((product) => `${product.name} (${product.sku}, ${formatGBP(product.price.rrp)} ex VAT)`)
    .join("; ");
  return Bulgarian
    ? `Намерих следните възможности: ${names}. Проверете размерите и модела на съществуващата система преди поръчка.`
    : `I found these options: ${names}. Please confirm the dimensions and existing system model before ordering.`;
}

async function getAiAnswer(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackAnswer(message);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL ?? "gpt-4.1-mini",
      temperature: 0.2,
      max_tokens: 350,
      messages: [
        {
          role: "system",
          content:
            "You are the HWSystem product assistant. Reply in the language used by the customer (Bulgarian or English). Be concise and practical. Use only the catalogue supplied below for product facts, compatibility, stock and public prices. Never reveal or guess trade prices. Say when compatibility must be confirmed. For sales follow-up, direct the customer to /quote.\n\nCATALOGUE:\n" +
            catalogContext(),
        },
        ...history,
        { role: "user", content: message },
      ],
    }),
  });

  if (!response.ok) return fallbackAnswer(message);
  const data = (await response.json()) as OpenAIResponse;
  return data.choices?.[0]?.message?.content?.trim() || fallbackAnswer(message);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 422 });
  }
  if (parsed.data.company_website) return NextResponse.json({ answer: "" });

  if (parsed.data.history.length === 0) {
    await recordChatQuestion(parsed.data.message).catch((error) =>
      console.error("[chat] ticket persist failed", error),
    );
  }

  const answer = await getAiAnswer(parsed.data.message, parsed.data.history);
  return NextResponse.json({ answer });
}
