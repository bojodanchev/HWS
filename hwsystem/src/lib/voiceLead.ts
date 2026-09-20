import { createHash, timingSafeEqual } from "node:crypto";
import type { Client } from "@libsql/client";
import { z } from "zod";

export const voiceLeadSchema = z.object({
  conversationId: z.string().regex(/^conv_[a-zA-Z0-9_-]{8,100}$/),
  name: z.string().trim().min(2).max(200),
  phone: z.string().trim().max(50).default(""),
  email: z.union([z.literal(""), z.string().trim().email().max(254)]).default(""),
  postcode: z.string().trim().max(20).default(""),
  summary: z.string().trim().min(10).max(4000),
  confirmed: z.literal(true),
  consent: z.literal(true),
}).strict().refine(value => value.phone.length >= 7 || value.email.length > 0, {
  message: "A confirmed callback phone or email is required",
});

export type VoiceLead = z.infer<typeof voiceLeadSchema>;

export function validVoiceKey(value: string | null, secret: string | undefined): boolean {
  if (!secret || secret.length < 32 || !value) return false;
  return timingSafeEqual(createHash("sha256").update(value).digest(), createHash("sha256").update(secret).digest());
}

/** Replays and caller corrections update one lead and one support ticket. */
export async function persistVoiceLead(db: Client, lead: VoiceLead): Promise<{ leadId: string }> {
  const suffix = createHash("sha256").update(`elevenlabs:${lead.conversationId}`).digest("hex").slice(0, 24);
  const leadId = `VOICE-${suffix}`;
  const ticketId = `VT-${suffix}`;
  const now = new Date().toISOString();
  const detail = `ElevenLabs enquiry${lead.postcode ? ` · ${lead.postcode}` : ""}: ${lead.summary}`;
  await db.batch([
    {
      sql: `INSERT INTO leads (id,kind,name,email,phone,detail,status,created_at)
            VALUES (?,'quote',?,?,?,?,'new',?)
            ON CONFLICT(id) DO UPDATE SET name=excluded.name,email=excluded.email,
              phone=excluded.phone,detail=excluded.detail`,
      args: [leadId, lead.name, lead.email, lead.phone, detail, now],
    },
    {
      sql: `INSERT INTO tickets (id,subject,customer,channel,status,priority,opened_at,source_ref)
            VALUES (?,?,?,'phone','open','normal',?,?)
            ON CONFLICT(id) DO UPDATE SET subject=excluded.subject,customer=excluded.customer`,
      args: [ticketId, `Voice enquiry — ${lead.summary.slice(0, 100)}`, lead.name, now, `elevenlabs:${lead.conversationId}`],
    },
  ], "write");
  return { leadId };
}

export async function updateVoiceEnquiryStatus(db: Client, id: string, status: "new" | "contacted" | "closed"): Promise<boolean> {
  const ticketStatus = status === "closed" ? "resolved" : status === "contacted" ? "pending" : "open";
  const results = await db.batch([
    { sql: "UPDATE leads SET status=? WHERE id=?", args: [status, id] },
    { sql: "UPDATE tickets SET status=? WHERE id=? AND EXISTS (SELECT 1 FROM leads WHERE id=?)", args: [ticketStatus, id.replace(/^VOICE-/, "VT-"), id] },
  ], "write");
  return results[0].rowsAffected > 0;
}
