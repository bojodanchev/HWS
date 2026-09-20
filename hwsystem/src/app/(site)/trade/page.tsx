import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { TradeForm } from "@/components/TradeForm";

export const metadata: Metadata = {
  title: "Trade account — exclusive pricing for professionals",
  description:
    "Apply for an HWSystem trade account. Company details and requested terms are reviewed individually.",
};

const BENEFITS = [
  "Pricing confirmed for your order",
  "Payment terms agreed after review",
  "Company account applications",
  "Product and specification enquiries",
  "Volume quotation requests",
];


export default function TradePage() {
  return (
    <main>
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-20 lg:py-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-mist">
              For trade customers
            </p>
            <h1 className="mt-4 text-h1 lg:text-display">Trade account applications</h1>
            <p className="mt-5 max-w-md text-lg text-mist">
              Tell us about your business and the products you need. Our team will review your application and confirm the available terms.
            </p>
            <ul className="mt-8 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 aria-hidden className="size-4 shrink-0 text-signal" strokeWidth={1.5} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>


      <section className="border-t border-line bg-concrete py-20 lg:py-32">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-h1 text-ink">Apply now</h2>
            <p className="mt-4 max-w-md text-steel">
              We review every application manually. Submitting this form does not activate a trade account or confirm credit terms.
            </p>
            <p className="mt-4 max-w-md text-steel">
              Prefer to talk first? Call{" "}
              <a href="tel:+442045774094" className="font-medium text-ink underline underline-offset-4">
                +44 (0)20 4577 4094
              </a>{" "}
              and ask for trade accounts.
            </p>
          </div>
          <div className="rounded-md border border-line bg-white p-6 lg:p-8">
            <TradeForm />
          </div>
        </div>
      </section>
    </main>
  );
}
