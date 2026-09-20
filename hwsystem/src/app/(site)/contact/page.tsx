import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to HWSystem: sales, technical support and trade accounts. Mon–Fri 8am–5pm.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-12 lg:py-16">
      <h1 className="text-h1 text-ink">Contact</h1>
      <p className="mt-3 max-w-2xl text-steel">
        Real people who know the products. If you&apos;re on a job and stuck,
        call — that&apos;s what the line is for.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <section className="rounded-md border border-line bg-white p-6">
          <Phone aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          <h2 className="mt-3 text-h3 text-ink">Phone</h2>
          <p className="mt-1.5 text-sm text-steel">
            <a href="tel:+442045774094" className="font-medium text-ink hover:underline">
              +44 (0)20 4577 4094
            </a>
            <br />
            Sales &amp; technical support
          </p>
        </section>
        <section className="rounded-md border border-line bg-white p-6">
          <Mail aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          <h2 className="mt-3 text-h3 text-ink">Email</h2>
          <p className="mt-1.5 text-sm text-steel">
            <a href="mailto:sales@hwsystem.co.uk" className="font-medium text-ink hover:underline">
              sales@hwsystem.co.uk
            </a>
            <br />
            Answered within the working day
          </p>
        </section>
        <section className="rounded-md border border-line bg-white p-6">
          <MapPin aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          <h2 className="mt-3 text-h3 text-ink">Base</h2>
          <p className="mt-1.5 text-sm text-steel">
            SBI Group International Ltd
            <br />
            Bristol BS16, United Kingdom
          </p>
        </section>
        <section className="rounded-md border border-line bg-white p-6">
          <Clock aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          <h2 className="mt-3 text-h3 text-ink">Hours</h2>
          <p className="mt-1.5 text-sm text-steel">
            Mon–Fri: 8am–5pm
            <br />
            Dispatch and delivery confirmed per order
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-steel">
        For structured requests —{" "}
        <Link href="/quote" className="font-medium text-ink underline underline-offset-4">
          quotes
        </Link>{" "}
        and{" "}
        <Link href="/trade" className="font-medium text-ink underline underline-offset-4">
          trade applications
        </Link>{" "}
        — the forms route straight to the right person.
      </p>
    </main>
  );
}
