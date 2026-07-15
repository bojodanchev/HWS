import "server-only";

/**
 * Lead delivery. Sends to Slack and/or email when the corresponding env
 * vars are set; always logs so leads are recoverable from Vercel function
 * logs even before those integrations are configured.
 */

export type Lead = {
  kind: "quote" | "trade-application";
  fields: Record<string, string>;
};

export async function deliverLead(lead: Lead): Promise<void> {
  const lines = Object.entries(lead.fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const text = `New ${lead.kind === "quote" ? "quote request" : "trade application"} — hwsystem\n${lines}`;

  console.log(`[lead] ${JSON.stringify(lead)}`);

  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  if (slackUrl) {
    await fetch(slackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).catch((err) => console.error("[lead] slack delivery failed", err));
  }

  const resendKey = process.env.RESEND_API_KEY;
  const leadInbox = process.env.LEAD_INBOX_EMAIL;
  if (resendKey && leadInbox) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "HWSystem Leads <leads@hwsystem.co.uk>",
        to: [leadInbox],
        subject: text.split("\n")[0],
        text,
      }),
    }).catch((err) => console.error("[lead] email delivery failed", err));
  }
}
