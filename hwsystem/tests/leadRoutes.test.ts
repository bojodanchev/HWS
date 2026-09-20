import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/adminOps", () => ({ recordLead: vi.fn() }));
vi.mock("@/lib/leads", () => ({ deliverLead: vi.fn() }));
vi.mock("@/lib/rateLimit", () => ({ consumeRateLimit: vi.fn().mockResolvedValue({allowed:true}) }));
import { recordLead } from "@/lib/adminOps";
import { deliverLead } from "@/lib/leads";
import { POST as quote } from "@/app/api/quote/route";
import { POST as trade } from "@/app/api/trade-application/route";
import { POST as contact } from "@/app/api/contact-capture/route";

beforeEach(() => { vi.clearAllMocks(); });
const base = { name:"Synthetic HWS Test", email:"test@example.invalid", phone:"+447700900123" };
const cases = [
  {name:"quote",run:quote,body:{...base,postcode:"SW1A 1AA",message:"Synthetic test only; no callback required."}},
  {name:"trade",run:trade,body:{companyName:"Synthetic HWS Test",contactName:base.name,email:base.email,phone:base.phone,monthlyVolume:"under-500"}},
  {name:"contact",run:contact,body:base},
];
describe.each(cases)("$name lead route", ({run,body}) => {
  const request = () => new Request("https://example.invalid/api/test", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  it("does not acknowledge or notify when persistence fails", async () => {
    vi.mocked(recordLead).mockRejectedValueOnce(new Error("Synthetic storage failure"));
    const log = vi.spyOn(console,"error").mockImplementation(() => {});
    try {
      expect((await run(request())).status).toBe(503);
      expect(deliverLead).not.toHaveBeenCalled();
    } finally { log.mockRestore(); }
  });
  it("acknowledges only after the lead has been stored", async () => {
    vi.mocked(recordLead).mockResolvedValueOnce(undefined);
    vi.mocked(deliverLead).mockResolvedValueOnce(undefined);
    expect((await run(request())).status).toBe(200);
    expect(recordLead).toHaveBeenCalledOnce();
    expect(deliverLead).toHaveBeenCalledOnce();
    expect(vi.mocked(recordLead).mock.invocationCallOrder[0]).toBeLessThan(vi.mocked(deliverLead).mock.invocationCallOrder[0]);
  });
});
