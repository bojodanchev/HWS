import type { Metadata } from "next";
import Image from "@/components/OptimizedImage";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Factory,
  FileCheck,
  Headset,
  Percent,
  RefreshCcw,
  Truck,
  Users,
} from "lucide-react";
import { getCategories } from "@/lib/catalog";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "HWSystem — Door components & automation",
  description:
    "Garage door motors, controls and automation for UK installations. Browse by product, compare specifications and request a checked quote.",
};

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Delivery planning",
    text: "Availability confirmed with your quote",
  },
  {
    icon: BadgeCheck,
    title: "Product documentation",
    text: "Ask for model-specific documents",
  },
  {
    icon: Factory,
    title: "Direct from factory",
    text: "SBI doors and selected component brands",
  },
  {
    icon: Users,
    title: "Trade accounts",
    text: "Apply for reviewed trade terms",
  },
];

const WHY_ITEMS = [
  {
    icon: Factory,
    title: "Own manufacturing",
    text: "Explore SBI door systems alongside automation and components from established manufacturers.",
  },
  {
    icon: FileCheck,
    title: "Documentation",
    text: "Request the documents for your exact model and installation before ordering.",
  },
  {
    icon: Clock,
    title: "Delivery enquiries",
    text: "Share your postcode and required date so the team can confirm availability and delivery options.",
  },
  {
    icon: Percent,
    title: "Trade pricing",
    text: "Trade applications are reviewed individually. Pricing and order terms are confirmed with your quotation.",
  },
  {
    icon: Headset,
    title: "Technical support",
    text: "Send the model reference, installation details and your question for a product-specific response.",
  },
  {
    icon: RefreshCcw,
    title: "Returns enquiries",
    text: "Contact the team with your order reference before returning an item. The applicable terms will be confirmed.",
  },
];

export default function Home() {
  const featuredCategories = getCategories().filter((c) => c.slug !== "doors").slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
              Trade &amp; retail garage door supplies
            </p>
            <h1 className="mt-4 text-h1 text-ink lg:text-display">
              Door components.
              <br />
              Clearly specified.
            </h1>
            <p className="mt-5 max-w-md text-lg text-steel">
              UK supplier of garage door motors, controls, and automation.
              Compare the details and request a quote for your installation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="flex h-11 items-center gap-2 rounded-md bg-signal px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-signal-hover"
              >
                Browse catalogue
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
              </Link>
              <Link
                href="/trade"
                className="flex h-11 items-center rounded-md border border-line px-6 text-sm font-medium text-ink transition-colors duration-150 hover:bg-concrete"
              >
                Open trade account
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-line bg-concrete">
            <Image
              src="/images/doors/roller-shutter-home.jpg"
              alt="SBI roller shutter door installed in a commercial unit"
              width={750}
              height={400}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section aria-label="Why buy from HWSystem" className="border-b border-line bg-concrete">
        <ul className="mx-auto grid max-w-[1280px] gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-line bg-white">
                <item.icon aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-ink">{item.title}</h2>
                <p className="mt-0.5 text-[13px] text-steel">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section className="py-20 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
              Product categories
            </p>
            <h2 className="mt-3 text-h1 text-ink">Everything for the job</h2>
            <p className="mt-4 text-steel">
              From motors to remotes, safety devices to complete door systems.
              Find the right part fast with our organised catalogue.
            </p>
          </Reveal>
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/products/${cat.slug}`}
                  className="group flex h-full flex-col rounded-md border border-line bg-white transition-colors duration-150 hover:border-ink"
                >
                  <div className="relative aspect-4/3 overflow-hidden rounded-t-md bg-concrete">
                    {cat.image ? <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-6"
                    /> : <div className="flex h-full items-center justify-center p-6 text-h2 text-steel">{cat.name}</div>}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-h3 text-ink">{cat.name}</h3>
                    <p className="mt-1.5 flex-1 text-sm text-steel">{cat.description}</p>
                    <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-signal">
                      Browse products
                      <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center">
            <Link
              href="/products"
              className="text-sm font-medium text-steel underline-offset-4 hover:text-ink hover:underline"
            >
              View all categories
            </Link>
          </p>
        </div>
      </section>

      {/* Why us */}
      <section className="border-y border-line bg-concrete py-20 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
              Why choose HWSystem
            </p>
            <h2 className="mt-3 text-h1 text-ink">
              Find the right part for the job
            </h2>
            <p className="mt-4 text-steel">
              Start with the model reference, check the specifications, and confirm the details with our team.
            </p>
          </Reveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_ITEMS.map((item) => (
              <li key={item.title} className="border-t border-line py-6">
                <span className="flex size-11 items-center justify-center rounded-md border border-line bg-concrete">
                  <item.icon aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
                </span>
                <h3 className="mt-4 text-h3 text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Doors CTA */}
      <section className="py-20 lg:py-20">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-lg border border-line">
              <Image
                src="/images/doors/sectional-installed.jpg"
                alt="SBI sectional garage door installed on a family home"
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
              </div>
          </Reveal>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
              Complete door solutions
            </p>
            <h2 className="mt-3 text-h1 text-ink">Need the whole door?</h2>
            <p className="mt-4 max-w-md text-steel">
              Our SBI range includes complete sectional and roller doors for
              residential and commercial applications. Available by quotation for trade accounts, with a minimum order of five doors.
            </p>
            <ul className="mt-6 grid max-w-md gap-3 sm:grid-cols-2">
              {[
                "Custom sizes available",
                "Choice of finishes and colours",
                "Installation requirements reviewed",
                "Model-specific warranty information",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-ink">
                  <CheckCircle2 aria-hidden className="size-4 shrink-0 text-success" strokeWidth={1.5} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/doors"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-signal px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-signal-hover"
            >
              Request door quote
              <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
