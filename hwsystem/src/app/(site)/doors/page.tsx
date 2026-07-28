import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "SBI doors — sectional & roller, made in our own factory",
  description:
    "Complete SBI sectional and roller garage doors, manufactured in Europe to EN 13241. Custom sizes, full colour range, installation support. Request a quote.",
};

const DOOR_RANGE = [
  {
    name: "Residential sectional doors",
    image: "/images/doors/sectional-domestic.png",
    alt: "SBI residential sectional garage door on a modern home",
    text: "Insulated steel panels, quiet tracks, and a finish that suits the house. The everyday choice for family garages.",
  },
  {
    name: "Commercial sectional doors",
    image: "/images/doors/sectional-commercial.png",
    alt: "SBI commercial sectional door on an industrial unit",
    text: "Heavier gauge, higher cycles, glazing options. Built for workshops, depots and loading bays.",
  },
  {
    name: "Compact roller doors — H55 Premium",
    image: "/images/doors/h55-premium.png",
    alt: "SBI H55 premium compact roller garage door",
    text: "Insulated 55 mm slat in a compact box. The retrofit favourite where headroom is tight.",
  },
  {
    name: "Roller doors — H77",
    image: "/images/doors/h77.png",
    alt: "SBI H77 roller garage door",
    text: "77 mm insulated slat for wider domestic and light-commercial openings.",
  },
  {
    name: "Industrial roller doors — H105",
    image: "/images/doors/h105-commercial.png",
    alt: "SBI H105 industrial roller shutter on commercial premises",
    text: "105 mm slat, safety brake compatible, duty-rated motors. Specified for industrial sites.",
  },
  {
    name: "Domestic H105",
    image: "/images/doors/h105-domestic.png",
    alt: "SBI H105 roller door in a domestic setting",
    text: "Industrial strength in a residential setting — for oversized garages and secure storage.",
  },
];

const PANEL_FINISHES = [
  { name: "Flush", image: "/images/finishes/panel-flush.jpg" },
  { name: "Mid-rib", image: "/images/finishes/panel-midrib.jpg" },
  { name: "Rib", image: "/images/finishes/panel-rib.jpg" },
  { name: "Cassette", image: "/images/finishes/panel-cassette.jpg" },
  { name: "Golden oak", image: "/images/finishes/golden-oak.jpg" },
  { name: "Mahogany", image: "/images/finishes/mahogany.jpg" },
];

const RAL_COLOURS = [
  { name: "Traffic white RAL 9016", image: "/images/finishes/traffic-white-ral-9016.png" },
  { name: "White aluminium RAL 9006", image: "/images/finishes/white-aluminium-ral-9006.png" },
  { name: "Light grey RAL 7035", image: "/images/finishes/light-grey-ral-7035.png" },
  { name: "Anthracite grey RAL 7016", image: "/images/finishes/anthracite-grey-ral-7016.png" },
  { name: "Jet black RAL 9005", image: "/images/finishes/jet-black-9005.png" },
  { name: "Steel blue RAL 5011", image: "/images/finishes/steel-blue-ral-5011.png" },
  { name: "Moss green RAL 6005", image: "/images/finishes/moss-green-ral-6005.png" },
  { name: "Ruby red RAL 3003", image: "/images/finishes/ruby-red-ral-3003.png" },
];

export default function DoorsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-32">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
              Complete door solutions
            </p>
            <h1 className="mt-4 text-h1 text-ink lg:text-display">
              Doors from the factory floor, not a catalogue
            </h1>
            <p className="mt-5 max-w-md text-lg text-steel">
              SBI sectional and roller doors are made in our own European
              factory to EN 13241. You&apos;re buying from the manufacturer —
              which shows in the price and the lead time.
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
            <a
              href="#door-quote"
              className="mt-8 inline-flex h-11 items-center rounded-md bg-signal px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-signal-hover"
            >
              Request door quote
            </a>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-line">
            <Image
              src="/images/doors/sectional-installed.jpg"
              alt="SBI sectional garage door installed on a family home"
              width={800}
              height={600}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
            <p className="absolute left-4 top-4 rounded-sm border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink">
              EN 13241 certified
            </p>
          </div>
        </div>
      </section>

      {/* Range */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">The range</p>
            <h2 className="mt-3 text-h1 text-ink">Six platforms, every opening</h2>
          </Reveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DOOR_RANGE.map((door) => (
              <li key={door.name} className="flex flex-col overflow-hidden rounded-md border border-line bg-white">
                <div className="relative aspect-4/3 bg-concrete">
                  <Image
                    src={door.image}
                    alt={door.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-h3 text-ink">{door.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel">{door.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Engineering */}
      <section className="border-y border-line bg-concrete py-20 lg:py-32">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-lg border border-line bg-white p-6">
              <Image
                src="/images/brand/exploded-view.jpg"
                alt="Exploded engineering view of an SBI roller door assembly"
                width={1024}
                height={933}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
              Engineering
            </p>
            <h2 className="mt-3 text-h1 text-ink">Every part is ours</h2>
            <p className="mt-4 max-w-md text-steel">
              Barrel, guides, slats, motor, controls — designed together, made
              together, tested together on the same line. When you need a spare
              in five years, it&apos;s a stock item, not an archaeology project.
            </p>
            <p className="mt-4 max-w-md text-steel">
              That&apos;s also why HWSystem can sell the components separately
              with a straight face: they&apos;re the same parts our own doors run
              on.
            </p>
          </div>
        </div>
      </section>

      {/* Finishes */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
              Finishes &amp; colours
            </p>
            <h2 className="mt-3 text-h1 text-ink">Panel profiles and RAL range</h2>
            <p className="mt-4 text-steel">
              Four panel profiles, woodgrain laminates, and the full standard
              RAL palette. Special colours to order.
            </p>
          </Reveal>
          <h3 className="mt-12 text-h3 text-ink">Panel profiles &amp; woodgrains</h3>
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {PANEL_FINISHES.map((f) => (
              <li key={f.name} className="overflow-hidden rounded-md border border-line bg-white">
                <div className="relative aspect-square bg-concrete">
                  <Image
                    src={f.image}
                    alt={`${f.name} door panel finish`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                    className="object-cover"
                  />
                </div>
                <p className="p-3 text-center text-[13px] font-medium text-ink">{f.name}</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-12 text-h3 text-ink">Standard colours</h3>
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {RAL_COLOURS.map((c) => (
              <li key={c.name} className="overflow-hidden rounded-md border border-line bg-white">
                <div className="relative aspect-square bg-concrete">
                  <Image
                    src={c.image}
                    alt={`${c.name} colour sample on a roller door`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                    className="object-cover"
                  />
                </div>
                <p className="p-2.5 text-center text-xs font-medium text-ink">{c.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quote */}
      <section id="door-quote" className="border-t border-line bg-concrete py-20 lg:py-32">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-h1 text-ink">Get a door quote</h2>
            <p className="mt-4 max-w-md text-steel">
              Doors are quoted, not carted — every opening is different. Send
              the rough size and postcode and we&apos;ll price it same-day,
              usually within the hour.
            </p>
            <p className="mt-4 max-w-md text-steel">
              Installers: door quotes carry your trade tier, and we can
              drop-ship to site.{" "}
              <Link href="/trade" className="font-medium text-ink underline underline-offset-4">
                No account yet?
              </Link>
            </p>
          </div>
          <div className="rounded-md border border-line bg-white p-6 lg:p-8">
            <QuoteForm subject="Complete door" />
          </div>
        </div>
      </section>
    </main>
  );
}
