import "server-only";
import { createHash } from "node:crypto";
import type { Client } from "@libsql/client";
import { sendLeadEmail, type EmailResult } from "@/lib/leads";
import type { VoiceLead } from "@/lib/voiceLead";

/** Accepted snapshots are not resent; a correction creates a new notification. */
export async function notifyVoiceEnquiry(db: Client, leadId: string, lead: VoiceLead): Promise<EmailResult> {
  const fields = { enquiryId: leadId, name: lead.name, phone: lead.phone, email: lead.email, postcode: lead.postcode, summary: lead.summary, inbox: "https://hwsystem.co.uk/admin/leads" };
  const recipient = process.env.LEAD_INBOX_EMAIL || "";
  const key = createHash("sha256").update(JSON.stringify({ recipient, fields })).digest("hex");
  await db.execute(`CREATE TABLE IF NOT EXISTS voice_email_notifications (
    id TEXT PRIMARY KEY, lead_id TEXT NOT NULL, status TEXT NOT NULL, provider_id TEXT, updated_at TEXT NOT NULL
  )`);
  const previous = await db.execute({ sql: "SELECT status,provider_id FROM voice_email_notifications WHERE id=?", args: [key] });
  if (previous.rows[0]?.status === "accepted") return { status: "accepted", id: String(previous.rows[0].provider_id) };
  const result = await sendLeadEmail({ kind: "voice-enquiry", fields }, `hws-voice-${key}`);
  await db.execute({
    sql: "INSERT INTO voice_email_notifications VALUES (?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=CASE WHEN voice_email_notifications.status='accepted' THEN 'accepted' ELSE excluded.status END,provider_id=COALESCE(voice_email_notifications.provider_id,excluded.provider_id),updated_at=excluded.updated_at",
    args: [key, leadId, result.status, result.status === "accepted" ? result.id : null, new Date().toISOString()],
  });
  return result;
}
