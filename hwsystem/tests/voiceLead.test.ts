import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createClient, type Client } from "@libsql/client";
import { persistVoiceLead, validVoiceKey, voiceLeadSchema } from "@/lib/voiceLead";

let db: Client;
const enquiry = {
  conversationId: "conv_synthetic_hws_test",
  name: "Synthetic HWS Test",
  email: "test@example.invalid",
  phone: "+447700900123",
  postcode: "SW1A 1AA",
  summary: "Synthetic enquiry about five garage doors, not a real callback.",
  confirmed: true as const,
  consent: true as const,
};

beforeEach(async () => {
  // Explicit in-memory fixture; never uses the application's environment or DB factory.
  db = createClient({ url: "file::memory:" });
  await db.execute("CREATE TABLE leads (id TEXT PRIMARY KEY,kind TEXT,name TEXT,email TEXT,phone TEXT,detail TEXT,status TEXT,created_at TEXT)");
  await db.execute("CREATE TABLE tickets (id TEXT PRIMARY KEY,subject TEXT,customer TEXT,channel TEXT,status TEXT,priority TEXT,opened_at TEXT,source_ref TEXT UNIQUE)");
});
afterEach(() => db.close());

describe("confirmed voice enquiry persistence", () => {
  it("upserts retries and corrected contact details without duplicating or reopening handled work", async () => {
    const first = await persistVoiceLead(db, enquiry);
    await db.execute({sql:"UPDATE leads SET status='contacted' WHERE id=?",args:[first.leadId]});
    const second = await persistVoiceLead(db, {...enquiry, email:"corrected@example.invalid"});
    expect(second).toEqual(first);
    const leads = await db.execute("SELECT * FROM leads");
    expect(leads.rows).toHaveLength(1);
    expect(leads.rows[0].email).toBe("corrected@example.invalid");
    expect(leads.rows[0].status).toBe("contacted");
    expect((await db.execute("SELECT * FROM tickets")).rows).toHaveLength(1);
  });
  it("rolls back the lead when its matching ticket cannot be stored", async () => {
    await db.execute("DROP TABLE tickets");
    await expect(persistVoiceLead(db,enquiry)).rejects.toThrow();
    expect((await db.execute("SELECT * FROM leads")).rows).toHaveLength(0);
  });
  it("requires consent, read-back confirmation and a usable callback method", () => {
    expect(voiceLeadSchema.safeParse({...enquiry,consent:false}).success).toBe(false);
    expect(voiceLeadSchema.safeParse({...enquiry,confirmed:false}).success).toBe(false);
    expect(voiceLeadSchema.safeParse({...enquiry,email:"",phone:""}).success).toBe(false);
    expect(voiceLeadSchema.safeParse({...enquiry,email:"",phone:"+447700900123"}).success).toBe(true);
  });
  it("rejects absent, short and incorrect tool credentials", () => {
    const secret = "synthetic-test-secret-with-32-characters";
    expect(validVoiceKey(secret,secret)).toBe(true);
    expect(validVoiceKey("wrong",secret)).toBe(false);
    expect(validVoiceKey(null,secret)).toBe(false);
    expect(validVoiceKey("short","short")).toBe(false);
  });
});
