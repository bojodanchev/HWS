import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About — part of SBI Group International",
  description:
    "HWSystem is the UK components arm of SBI Group International — a family door manufacturer since 1997 with its own highly automated factory in Europe.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:py-32">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">About us</p>
          <h1 className="mt-4 max-w-3xl text-h1 text-ink lg:text-display">
            The components arm of a door factory
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-steel">
            HWSystem is part of SBI Group International Ltd — a family business
            manufacturing roller, sectional and industrial doors since 1997,
            with a highly automated factory in Europe and a base in Bristol.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-h1 text-ink">Why that matters to you</h2>
            <div className="mt-6 max-w-md space-y-4 text-steel">
              <p>
                Most parts suppliers are warehouses: they buy boxes, they ship
                boxes. We make the doors these parts go into. Every motor,
                control panel and slat profile in this catalogue either comes
                off our own line or is fitted on it daily.
              </p>
              <p>
                That means first-hand answers on compatibility, honest stock
                information, and pricing without a distributor&apos;s margin baked
                in.
              </p>
              <p>
                Doors carry the SBI name. Parts carry HWSystem. Same factory,
                same people, one phone number.
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <Link
                href="/products"
                className="flex h-11 items-center rounded-md bg-signal px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-signal-hover"
              >
                Browse the catalogue
              </Link>
              <Link
                href="/doors"
                className="flex h-11 items-center rounded-md border border-line px-6 text-sm font-medium text-ink transition-colors duration-150 hover:bg-concrete"
              >
                See the doors
              </Link>
            </div>
          </div>
          <Reveal>
            <div className="overflow-hidden rounded-lg border border-line bg-white p-6">
              <Image
                src="/images/brand/exploded-view.jpg"
                alt="Exploded engineering drawing of an SBI roller door assembly"
                width={1024}
                height={933}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-concrete py-20 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="text-h1 text-ink">The numbers</h2>
          <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "1997", label: "Family business since" },
              { value: "500+", label: "UK trade customers" },
              { value: "95%", label: "Stock lines available same-day" },
              { value: "24hr", label: "Typical UK delivery" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-md border border-line bg-white p-6">
                <dt className="text-sm text-steel">{stat.label}</dt>
                <dd className="mt-1 font-heading text-h1 font-semibold text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
