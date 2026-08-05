import { NextResponse } from "next/server";
import { z } from "zod";
import { recordLead } from "@/lib/adminOps";
import { deliverLead } from "@/lib/leads";

const schema = z.object({
  companyName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(200),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(50),
  monthlyVolume: z.enum(["under-500", "500-2000", "2000-plus"]),
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

  if (parsed.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const { company_website: _hp, ...fields } = parsed.data;
  await deliverLead({ kind: "trade-application", fields });

  // Persist for the admin panel; delivery above must not depend on the DB.
  await recordLead({
    kind: "trade_application",
    name: fields.companyName,
    email: fields.email,
    phone: fields.phone,
    detail: `Contact ${fields.contactName} — monthly volume ${fields.monthlyVolume}`,
  }).catch((err) => console.error("[lead] db persist failed", err));

  return NextResponse.json({ ok: true });
}
