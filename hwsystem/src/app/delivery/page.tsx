import type { Metadata } from "next";
import { Clock, PackageCheck, RefreshCcw, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Delivery & returns",
  description:
    "Order by 2pm for next-working-day delivery across most of the UK. 30-day returns on unused stock.",
};

export default function DeliveryPage() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-12 lg:py-16">
      <h1 className="text-h1 text-ink">Delivery &amp; returns</h1>
      <p className="mt-3 max-w-2xl text-steel">
        The promise is simple: order by 2pm, fit it tomorrow. Here&apos;s the
        detail behind it.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-md border border-line bg-white p-6">
          <span className="flex size-11 items-center justify-center rounded-md border border-line bg-concrete">
            <Clock aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 text-h3 text-ink">Cutoff: 2pm</h2>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            Orders confirmed before 2pm on a working day are picked and
            dispatched the same afternoon. After 2pm, they ship next working
            day.
          </p>
        </section>
        <section className="rounded-md border border-line bg-white p-6">
          <span className="flex size-11 items-center justify-center rounded-md border border-line bg-concrete">
            <Truck aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 text-h3 text-ink">Next working day, most of the UK</h2>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            Mainland England and Wales are next-day as standard. Scottish
            Highlands, islands and NI typically run 2–3 working days — we&apos;ll
            confirm at order.
          </p>
        </section>
        <section className="rounded-md border border-line bg-white p-6">
          <span className="flex size-11 items-center justify-center rounded-md border border-line bg-concrete">
            <PackageCheck aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 text-h3 text-ink">Long and heavy goods</h2>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            Tube, slats and complete doors travel on dedicated transport.
            Lead times are quoted per order — usually within the week, and we
            can deliver to site for trade customers.
          </p>
        </section>
        <section className="rounded-md border border-line bg-white p-6">
          <span className="flex size-11 items-center justify-center rounded-md border border-line bg-concrete">
            <RefreshCcw aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 text-h3 text-ink">Returns: 30 days</h2>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            Unused, unfitted stock items come back within 30 days for a full
            refund — no restocking fee. Made-to-order items (springs wound to
            spec, cut tube, doors) are excluded. Faulty goods are replaced at
            our cost, always.
          </p>
        </section>
      </div>

      <p className="mt-10 max-w-2xl text-sm text-steel">
        Questions about a specific postcode or an urgent job? Call{" "}
        <a href="tel:+443301234567" className="font-medium text-ink underline underline-offset-4">
          +44 (0)330 123 4567
        </a>{" "}
        before you order and we&apos;ll tell you straight what&apos;s possible.
      </p>
    </main>
  );
}
