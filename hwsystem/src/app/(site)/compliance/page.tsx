import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Compliance — EN 13241, EN 12453, UKCA",
  description:
    "Request model-specific declarations, installation manuals and technical documentation for your project.",
};

const STANDARDS = [
  {
    code: "EN 13241",
    title: "Product standard for doors and gates",
    text: "Ask for the declaration and supporting documentation for the exact door or gate model being specified.",
  },
  {
    code: "EN 12453",
    title: "Safety in use of power-operated doors",
    text: "The complete installation and its safety devices need a project-specific review. A catalogue recommendation does not certify an installation.",
  },
  {
    code: "EN 12978",
    title: "Safety devices for power-operated doors",
    text: "Confirm the safety device, control unit and monitoring requirements against the manufacturer documentation.",
  },
  {
    code: "UKCA",
    title: "UK conformity marking",
    text: "Request the conformity documentation applicable to the selected product and destination. Manufacturer and marking details vary by product.",
  },
];

export default function CompliancePage() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-12 lg:py-16">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">Compliance</p>
      <h1 className="mt-3 text-h1 text-ink">Product documentation</h1>
      <p className="mt-4 max-w-2xl text-steel">
        Check the documents for the exact product and installation. Where a document is not listed, send us the SKU and the information you need.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {STANDARDS.map((s) => (
          <section key={s.code} className="rounded-md border border-line bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-md border border-line bg-concrete">
                <ShieldCheck aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="font-mono text-sm font-medium text-ink">{s.code}</h2>
                <p className="text-sm text-steel">{s.title}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-steel">{s.text}</p>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-md border border-line bg-concrete p-6">
        <div className="flex items-start gap-3">
          <FileCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-ink" strokeWidth={1.5} />
          <div>
            <h2 className="text-h3 text-ink">Need a document we haven&apos;t published yet?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-steel">
              We&apos;re migrating the full document library onto the site. If a
              product page is missing the PDF you need, email{" "}
              <a href="mailto:sales@hwsystem.co.uk" className="font-medium text-ink underline underline-offset-4">
                sales@hwsystem.co.uk
              </a>{" "}
              with the SKU, or{" "}
              <Link href="/quote" className="font-medium text-ink underline underline-offset-4">
                raise it with a quote request
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
