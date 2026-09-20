import { NextResponse } from "next/server";
import { contactCaptureSchema } from "@/lib/contactCaptureSchema";
import { recordLead } from "@/lib/adminOps";
import { deliverLead } from "@/lib/leads";
import { consumeRateLimit } from "@/lib/rateLimit";

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

  const parsed = contactCaptureSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid contact details" }, { status: 422 });
  if (parsed.data.company_website) return NextResponse.json({ ok: true });

  const fields = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    purpose: parsed.data.purpose,
    message: parsed.data.message,
  };
  try {
    await recordLead({
    kind: "quote",
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    detail: `Contact popup — ${fields.purpose}${fields.message ? `: ${fields.message}` : ""}`,
    });
  } catch {
    console.error("[lead] persistence failed");
    return NextResponse.json({ error: "Unable to save your request. Please try again." }, { status: 503 });
  }
  await deliverLead({ kind: "quote", fields: { source: "contact-popup", ...fields } });

  return NextResponse.json({ ok: true });
}
