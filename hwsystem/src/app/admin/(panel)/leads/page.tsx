import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import { getLeadInbox, formatShortDateTime } from "@/lib/adminOps";
import { StatusSelect } from "@/components/admin/StatusSelect";

export const metadata = { title: "Enquiry inbox" };
const statuses = [{value:"new",label:"New"},{value:"contacted",label:"Contacted"},{value:"closed",label:"Closed"}];

export default async function EnquiryInbox({searchParams}: {searchParams: Promise<{q?:string|string[];status?:string|string[];page?:string|string[]}>}) {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  const params = await searchParams;
  const first = (value: string | string[] | undefined, fallback: string) => (Array.isArray(value) ? value[0] : value) ?? fallback;
  const q = first(params.q, "").slice(0, 120);
  const requestedStatus = first(params.status, "new");
  const status = ["new", "contacted", "closed", "all"].includes(requestedStatus) ? requestedStatus : "new";
  const rawPage = first(params.page, "1");
  const page = Math.max(1,Math.min(2000,Number.parseInt(rawPage,10)||1));
  const {leads,total} = await getLeadInbox({query:q,status,page});
  const href = (next:number) => `/admin/leads?${new URLSearchParams({q,status,page:String(next)})}`;
  return <section>
    <h2 className="text-h2 text-ink">Enquiry inbox</h2>
    <p className="mt-2 text-sm text-steel">Confirmed voice enquiries and website requests. Open a record to read the complete enquiry.</p>
    <form className="mt-6 flex flex-wrap items-end gap-4"><label className="text-sm text-steel">Name, contact or enquiry<input name="q" defaultValue={q} maxLength={120} className="mt-1 block h-11 rounded-md border border-line px-3 text-ink" /></label><label className="text-sm text-steel">Status<select name="status" defaultValue={status} className="mt-1 block h-11 rounded-md border border-line px-3 text-ink"><option value="all">All</option>{statuses.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</select></label><button className="h-11 rounded-md bg-ink px-6 text-sm text-white">Filter</button></form>
    <p className="mt-6 text-sm text-steel">{total} {total === 1 ? "enquiry" : "enquiries"} · page {page}</p>
    <div className="mt-4 divide-y divide-line border-y border-line">
      {leads.length ? leads.map(lead=><article key={lead.id} className="py-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-h3 text-ink">{lead.name}</h3><p className="mt-1 text-sm text-steel">{lead.id.startsWith("VOICE-") ? "ElevenLabs voice" : lead.kind === "trade_application" ? "Trade application" : "Website enquiry"} · {formatShortDateTime(lead.createdAt)}</p></div><StatusSelect endpoint={`/api/admin/leads/${lead.id}`} field="status" value={lead.status} options={statuses} label={`Status for ${lead.name}`} /></div><div className="mt-3 flex flex-wrap gap-4 text-sm">{lead.phone && <a href={`tel:${lead.phone.replace(/[^\d+]/g,"")}`} className="text-ink underline underline-offset-4">{lead.phone}</a>}{lead.email && <a href={`mailto:${lead.email}`} className="text-ink underline underline-offset-4">{lead.email}</a>}</div><details className="mt-4"><summary className="cursor-pointer py-2 text-sm font-medium text-ink">Read enquiry</summary><p className="mt-2 whitespace-pre-wrap break-words text-sm text-steel">{lead.detail}</p><p className="mt-3 font-mono text-xs text-mist">{lead.id}</p></details></article>) : <p className="py-8 text-sm text-steel">No matching enquiries.</p>}
    </div>
    <nav aria-label="Enquiry pages" className="mt-6 flex gap-4">{page>1&&<Link href={href(page-1)} className="flex min-h-11 items-center text-sm font-medium text-ink">Previous</Link>}{page*50<total&&<Link href={href(page+1)} className="flex min-h-11 items-center text-sm font-medium text-ink">Next</Link>}</nav>
  </section>;
}
