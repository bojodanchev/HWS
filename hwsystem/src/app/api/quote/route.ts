import { NextResponse } from "next/server";
import { z } from "zod";
import { recordLead } from "@/lib/adminOps";
import { deliverLead } from "@/lib/leads";

const schema = z.object({
  name: z.string().min(2).max(200),
  phone: z.string().min(7).max(50),
  email: z.string().email().max(200),
  postcode: z.string().min(3).max(20),
  message: z.string().min(10).max(5000),
  company_website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 422 });
  }

  // Honeypot filled → pretend success, deliver nothing
  if (parsed.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const { company_website: _hp, ...fields } = parsed.data;
  await deliverLead({ kind: "quote", fields });

  // Persist for the admin panel; delivery above must not depend on the DB.
  await recordLead({
    kind: "quote",
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    detail: `${fields.postcode} — ${fields.message}`,
  }).catch((err) => console.error("[lead] db persist failed", err));

  return NextResponse.json({ ok: true });
}
