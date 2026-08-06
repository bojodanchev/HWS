import { NextResponse } from "next/server";
import { z } from "zod";
import { recordLead } from "@/lib/adminOps";
import { deliverLead } from "@/lib/leads";
import { consumeRateLimit } from "@/lib/rateLimit";

const schema = z.object({
  name: z.string().trim().min(2).max(200),
  phone: z.string().trim().min(7).max(50),
  email: z.string().trim().email().max(200),
  company_website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  const rateLimit = await consumeRateLimit(request, "contact-capture", 3, 60 * 60);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid contact details" }, { status: 422 });
  if (parsed.data.company_website) return NextResponse.json({ ok: true });

  const fields = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
  };
  await deliverLead({ kind: "quote", fields: { source: "contact-popup", ...fields } });
  await recordLead({
    kind: "quote",
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    detail: "Contact popup — requested product-selection help",
  }).catch((error) => console.error("[lead] contact popup persistence failed", error));

  return NextResponse.json({ ok: true });
}
