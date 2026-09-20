import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { persistVoiceLead, validVoiceKey, voiceLeadSchema } from "@/lib/voiceLead";

export async function POST(request: Request) {
  if (!validVoiceKey(request.headers.get("x-hws-voice-key"), process.env.HWS_VOICE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > 16_384) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }
  let raw: string;
  try { raw = await request.text(); } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (Buffer.byteLength(raw) > 16_384) return NextResponse.json({ error: "Request too large" }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(raw); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = voiceLeadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Confirmed contact details and consent are required" }, { status: 422 });
  try {
    const result = await persistVoiceLead(await getDb(), parsed.data);
    return NextResponse.json({ saved: true, ...result, nextStep: "The enquiry is saved in the HWS team's inbox. No callback time has been booked." });
  } catch {
    // Do not log caller details or claim delivery after storage failure.
    console.error("[voice-lead] persistence failed");
    return NextResponse.json({ saved: false, error: "Unable to save the enquiry; please try again" }, { status: 503 });
  }
}
