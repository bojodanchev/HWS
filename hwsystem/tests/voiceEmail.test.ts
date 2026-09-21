import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createClient, type Client } from "@libsql/client";
vi.mock("server-only", () => ({}));
import { notifyVoiceEnquiry } from "@/lib/voiceEmail";

let db: Client;
const lead = { conversationId: "conv_synthetic_email_test", name: "Synthetic HWS Test", phone: "+447700900123", email: "", postcode: "", summary: "Synthetic notification test; no callback needed.", confirmed: true as const, consent: true as const };
beforeEach(() => {
  db = createClient({ url: "file::memory:" });
  vi.stubEnv("RESEND_API_KEY", "synthetic-test-key");
  vi.stubEnv("LEAD_INBOX_EMAIL", "team@example.invalid");
  vi.stubEnv("HWS_LEAD_EMAIL_FROM", "HWS <test@example.invalid>");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "synthetic-email-id" }))));
});
afterEach(() => { db.close(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("voice email notifications", () => {
  it("deduplicates accepted snapshots and sends corrected contact details with a new key", async () => {
    expect((await notifyVoiceEnquiry(db, "VOICE-test", lead)).status).toBe("accepted");
    expect((await notifyVoiceEnquiry(db, "VOICE-test", lead)).status).toBe("accepted");
    expect(fetch).toHaveBeenCalledTimes(1);
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ id: "synthetic-correction-id" })));
    await notifyVoiceEnquiry(db, "VOICE-test", { ...lead, phone: "+447700900124" });
    expect(fetch).toHaveBeenCalledTimes(2);
    const first = vi.mocked(fetch).mock.calls[0][1]!;
    const corrected = vi.mocked(fetch).mock.calls[1][1]!;
    expect(JSON.parse(String(corrected.body)).text).toContain("+447700900124");
    expect(JSON.parse(String(corrected.body)).to).toEqual(["team@example.invalid"]);
    expect(new Headers(corrected.headers).get("Idempotency-Key")).not.toBe(new Headers(first.headers).get("Idempotency-Key"));
    expect((await db.execute("SELECT * FROM voice_email_notifications")).rows).toHaveLength(2);
  });
  it("records failure and retries the same snapshot with the same provider key", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("provider unavailable", { status: 503 }));
    expect((await notifyVoiceEnquiry(db, "VOICE-test", lead)).status).toBe("failed");
    expect((await notifyVoiceEnquiry(db, "VOICE-test", lead)).status).toBe("accepted");
    const calls = vi.mocked(fetch).mock.calls;
    expect(new Headers(calls[0][1]!.headers).get("Idempotency-Key")).toBe(new Headers(calls[1][1]!.headers).get("Idempotency-Key"));
  });
  it("does not send or claim acceptance before sender configuration exists", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await notifyVoiceEnquiry(db, "VOICE-test", lead)).status).toBe("unconfigured");
    expect(fetch).not.toHaveBeenCalled();
  });
});
