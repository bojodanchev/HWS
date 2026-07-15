import type { Metadata } from "next";
import Image from "next/image";
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
  title: "HWSystem — The parts you need. Delivered tomorrow.",
  description:
    "UK trade and retail supplier of garage door motors, controls and automation. Own European factory, full compliance documentation, next-day delivery.",
};

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Next-day delivery",
    text: "Order by 2pm for next working day",
  },
  {
    icon: BadgeCheck,
    title: "UKCA certified",
    text: "Full compliance documentation",
  },
  {
    icon: Factory,
    title: "Direct from factory",
    text: "Own manufacturing, better prices",
  },
  {
    icon: Users,
    title: "Trade accounts",
    text: "Exclusive pricing for professionals",
  },
];

const WHY_ITEMS = [
  {
    icon: Factory,
    title: "Own manufacturing",
    text: "Our SBI factory produces doors and components to exacting standards. No middlemen means better quality control and sharper pricing for you.",
  },
  {
    icon: FileCheck,
    title: "Full compliance pack",
    text: "Every product ships with Declaration of Performance, UKCA marking, and technical documentation. No chasing paperwork — it's all there.",
  },
  {
    icon: Clock,
    title: "Same-day dispatch",
    text: "Order before 2pm and we ship same day. Most of the UK receives next working day. Because your customer is waiting.",
  },
  {
    icon: Percent,
    title: "Trade pricing",
    text: "Qualified trade accounts unlock tiered pricing that improves with volume. The more you buy, the better your margins.",
  },
  {
    icon: Headset,
    title: "Technical support",
    text: "Stuck on a job? Our team knows these products inside out. Call us and speak to someone who's actually installed them.",
  },
  {
    icon: RefreshCcw,
    title: "Hassle-free returns",
    text: "Ordered the wrong part? It happens. Return unused stock within 30 days for a full refund. No questions, no drama.",
  },
];

export default function Home() {
  const featuredCategories = getCategories().filter((c) => c.slug !== "doors").slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-32">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
              Trade &amp; retail garage door supplies
            </p>
            <h1 className="mt-4 text-h1 text-ink lg:text-display">
              The parts you need.
              <br />
              Delivered tomorrow.
            </h1>
            <p className="mt-5 max-w-md text-lg text-steel">
              UK supplier of garage door motors, controls, and automation.
              Trade accounts available with exclusive pricing and next-day
              delivery.
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
            <dl className="mt-12 flex gap-8 border-t border-line pt-8">
              {[
                { value: "500+", label: "Trade customers" },
                { value: "95%", label: "In-stock rate" },
                { value: "24hr", label: "Delivery" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-heading text-h2 font-semibold text-ink">{stat.value}</dd>
                  <dd className="mt-0.5 text-sm text-steel">{stat.label}</dd>
                </div>
              ))}
            </dl>
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
            <p className="absolute left-4 top-4 rounded-sm border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink">
              UKCA certified
            </p>
            <p className="absolute bottom-4 right-4 rounded-sm bg-ink px-3 py-1.5 text-xs font-medium text-white">
              Next-day delivery
            </p>
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
      <section className="py-20 lg:py-32">
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
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
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
      <section className="border-y border-line bg-concrete py-20 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
              Why choose HWSystem
            </p>
            <h2 className="mt-3 text-h1 text-ink">
              Built for professionals who demand more
            </h2>
            <p className="mt-4 text-steel">
              We&apos;re not just another supplier. With our own factory in Europe
              and decades of industry experience, we deliver quality parts at
              prices the competition can&apos;t match.
            </p>
          </Reveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_ITEMS.map((item) => (
              <li key={item.title} className="rounded-md border border-line bg-white p-6">
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
      <section className="py-20 lg:py-32">
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
              <p className="absolute left-4 top-4 rounded-sm border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink">
                EN 13241 certified
              </p>
            </div>
          </Reveal>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
              Complete door solutions
            </p>
            <h2 className="mt-3 text-h1 text-ink">Need the whole door?</h2>
            <p className="mt-4 max-w-md text-steel">
              Our SBI range includes complete sectional and roller doors for
              residential and commercial applications. Manufactured in Europe
              to EN 13241 standards.
            </p>
            <ul className="mt-6 grid max-w-md gap-3 sm:grid-cols-2">
              {[
                "Custom sizes available",
                "Choice of finishes and colours",
                "Full installation support",
                "Extended warranty options",
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
