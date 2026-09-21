import "server-only";

/**
 * Lead delivery. Sends to Slack and/or email when the corresponding env
 * vars are set. Callers persist first; logs contain delivery state only.
 */

export type Lead = {
  kind: "quote" | "trade-application" | "voice-enquiry";
  fields: Record<string, string>;
};

function leadText(lead: Lead): string {
  const lines = Object.entries(lead.fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const title = lead.kind === "quote" ? "quote request" : lead.kind === "voice-enquiry" ? "voice enquiry / updated details" : "trade application";
  return `New ${title} — HWSystem\n${lines}`;
}

export type EmailResult = { status: "accepted"; id: string } | { status: "unconfigured" | "failed" };

export async function sendLeadEmail(lead: Lead, idempotencyKey?: string): Promise<EmailResult> {
  const resendKey = process.env.RESEND_API_KEY;
  const leadInbox = process.env.LEAD_INBOX_EMAIL;
  if (!resendKey || !leadInbox) return { status: "unconfigured" };
  const text = leadText(lead);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}`, ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}) },
      body: JSON.stringify({ from: process.env.HWS_LEAD_EMAIL_FROM || "HWSystem Leads <leads@hwsystem.co.uk>", to: [leadInbox], subject: text.split("\n")[0], text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { status: "failed" };
    const body = await response.json();
    return typeof body.id === "string" ? { status: "accepted", id: body.id } : { status: "failed" };
  } catch { return { status: "failed" }; }
}

export async function deliverLead(lead: Lead): Promise<void> {
  const text = leadText(lead);

  console.info(`[lead] notification requested: ${lead.kind}`);

  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  if (slackUrl) {
    const response = await fetch(slackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).catch(() => undefined);
    if (!response?.ok) console.error("[lead] slack delivery failed");
  }

  if ((await sendLeadEmail(lead)).status === "failed") console.error("[lead] email delivery failed");
}
