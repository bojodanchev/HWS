import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { installationDraft as copy } from "@/content/installation";

export const metadata: Metadata = { title: "Installation — draft for review", robots: { index: false, follow: false } };

export default function InstallationDraftPage() {
  // Alex-Shon requested a visual draft for team review, not publication of service promises.
  if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview") notFound();
  return <main>
    <p className="border-b border-line bg-concrete px-6 py-3 text-center text-sm text-steel">Draft for team review · coverage, prices, timing and service terms await confirmation.</p>
    <section className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-20">
        <div><p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">Installation enquiries</p><h1 className="mt-4 text-h1 text-ink lg:text-display">{copy.title}</h1><p className="mt-6 max-w-md text-lg text-steel">{copy.intro}</p>
          <a href="#enquiry" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md bg-signal px-6 py-3 text-sm font-medium text-white hover:bg-signal-hover">Discuss your project <ArrowRight aria-hidden className="size-4" /></a>
        </div>
        <Image src="/images/doors/sectional-installed.jpg" alt="SBI sectional garage door installed at a home" width={800} height={600} priority sizes="(max-width: 1024px) 100vw, 50vw" className="h-auto w-full rounded-md" />
      </div>
    </section>
    <section className="mx-auto max-w-[1280px] px-6 py-16">
      <h2 className="text-h2 text-ink">Start with the work you need</h2>
      <div className="mt-8 grid gap-8 md:grid-cols-2">{copy.services.map(service => <article key={service.title} className="border-t border-line pt-6"><h3 className="text-h3 text-ink">{service.title}</h3><p className="mt-3 max-w-lg text-steel">{service.text}</p></article>)}</div>
    </section>
    <section className="border-y border-line bg-concrete"><div className="mx-auto max-w-[1280px] px-6 py-16"><h2 className="text-h2 text-ink">From enquiry to handover</h2><ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{copy.steps.map((step,index) => <li key={step.title}><span className="font-mono text-sm text-steel">0{index+1}</span><h3 className="mt-3 text-h3 text-ink">{step.title}</h3><p className="mt-3 text-sm text-steel">{step.text}</p></li>)}</ol></div></section>
    <section className="mx-auto grid max-w-[1280px] gap-12 px-6 py-16 lg:grid-cols-2">
      <div><p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">For the trade</p><h2 className="mt-3 text-h2 text-ink">Extra installation capacity for your projects</h2><p className="mt-4 text-steel">Discuss fit-only and white-label work alongside your product order. Agree the customer relationship, scope and responsibilities before booking.</p><Link href="/trade" className="mt-6 inline-flex min-h-11 items-center font-medium text-ink underline underline-offset-4">Trade account enquiries</Link></div>
      <div><h2 className="text-h2 text-ink">Before you book</h2><div className="mt-6 divide-y divide-line">{copy.faqs.map(faq => <details key={faq.q} className="py-4"><summary className="cursor-pointer py-2 font-medium text-ink">{faq.q}</summary><p className="mt-3 text-sm text-steel">{faq.a}</p></details>)}</div></div>
    </section>
    <section id="enquiry" className="scroll-mt-32 border-t border-line bg-concrete"><div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-16 lg:grid-cols-2">
      <div><h2 className="text-h2 text-ink">Tell us about the opening</h2><p className="mt-4 max-w-md text-steel">Proposed enquiry form for the installation service. The team will confirm service areas and how enquiries are handled before launch.</p></div>
      <div className="rounded-md border border-line bg-white p-6"><div className="grid gap-4 sm:grid-cols-2">{["Name","Phone","Email","Postcode"].map(label => <label key={label} className="text-sm font-medium text-ink">{label}<input className="mt-1 h-11 w-full rounded-md border border-line px-3" /></label>)}</div><label className="mt-4 block text-sm font-medium text-ink">What do you need?<select className="mt-1 h-11 w-full rounded-md border border-line px-3"><option>New door</option><option>Automation on an existing door</option><option>Gate automation</option><option>Repair or upgrade</option><option>Trade fit-only</option></select></label><label className="mt-4 block text-sm font-medium text-ink">Opening size and notes<textarea rows={3} className="mt-1 w-full rounded-md border border-line p-3" /></label><p className="mt-3 text-sm text-steel">Photo upload: up to three images proposed for launch.</p><button type="button" disabled className="mt-6 min-h-11 w-full rounded-md bg-ink px-6 text-sm font-medium text-white opacity-50">Preview form — sending disabled</button></div>
    </div></section>
  </main>;
}
