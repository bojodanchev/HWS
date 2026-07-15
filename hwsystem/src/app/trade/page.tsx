import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { TradeForm } from "@/components/TradeForm";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Trade account — exclusive pricing for professionals",
  description:
    "Open an HWSystem trade account: tiered trade pricing, Net 30 terms for approved accounts, dedicated support and next-day delivery on 95% of stock lines.",
};

const BENEFITS = [
  "Exclusive trade pricing across all products",
  "Net 30 payment terms for approved accounts",
  "Dedicated account manager",
  "Priority technical support",
  "Volume rebates and quarterly incentives",
];

const TIERS = [
  {
    name: "Bronze",
    discount: "Up to 15% off RRP",
    detail: "For installers getting started — instant access after approval.",
  },
  {
    name: "Silver",
    discount: "Up to 20% off RRP",
    detail: "For regular buyers ordering monthly. Includes price breaks on volume.",
  },
  {
    name: "Gold",
    discount: "Up to 25% off RRP",
    detail: "For high-volume firms. Best pricing, rebates and priority stock allocation.",
  },
];

export default function TradePage() {
  return (
    <main>
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-32">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-mist">
              For trade customers
            </p>
            <h1 className="mt-4 text-h1 lg:text-display">Your margin matters</h1>
            <p className="mt-5 max-w-md text-lg text-mist">
              Open a trade account and access pricing that protects your
              profit. Three tiers to match your volume, with next-day delivery
              on 95% of stock lines.
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
          <dl className="grid grid-cols-3 gap-4">
            {[
              { value: "500+", label: "Trade customers" },
              { value: "95%", label: "In-stock rate" },
              { value: "24hr", label: "Typical delivery" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-md border border-white/15 p-5 text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-h2 font-semibold">{stat.value}</dd>
                <dd className="mt-1 text-[13px] text-mist">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
              Pricing tiers
            </p>
            <h2 className="mt-3 text-h1 text-ink">Pricing that grows with you</h2>
            <p className="mt-4 text-steel">
              Every account starts at Bronze and is reviewed quarterly. Move up
              a tier and your whole order history gets cheaper.
            </p>
          </Reveal>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {TIERS.map((tier) => (
              <li key={tier.name} className="rounded-md border border-line bg-white p-6">
                <h3 className="text-h3 text-ink">{tier.name}</h3>
                <p className="mt-2 font-heading text-h2 font-semibold text-ink">{tier.discount}</p>
                <p className="mt-3 text-sm leading-relaxed text-steel">{tier.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-concrete py-20 lg:py-32">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-h1 text-ink">Apply now</h2>
            <p className="mt-4 max-w-md text-steel">
              Five fields, one working day to approval. We review every
              application manually — no one gets trade prices automatically,
              which is why the pricing stays sharp for those who do.
            </p>
            <p className="mt-4 max-w-md text-steel">
              Prefer to talk first? Call{" "}
              <a href="tel:+443301234567" className="font-medium text-ink underline underline-offset-4">
                +44 (0)330 123 4567
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
