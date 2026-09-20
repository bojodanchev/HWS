import type { Metadata } from "next";
import { Clock, PackageCheck, RefreshCcw, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Delivery & returns",
  description:
    "Delivery availability, timing and return enquiries for HWSystem orders.",
};

export default function DeliveryPage() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-12 lg:py-16">
      <h1 className="text-h1 text-ink">Delivery &amp; returns</h1>
      <p className="mt-3 max-w-2xl text-steel">
        Delivery depends on the product, stock position and destination. Confirm the details with the team before ordering.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-md border border-line bg-white p-6">
          <span className="flex size-11 items-center justify-center rounded-md border border-line bg-concrete">
            <Clock aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 text-h3 text-ink">Dispatch timing</h2>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            Dispatch timing is confirmed once the required products and quantities have been checked.
          </p>
        </section>
        <section className="rounded-md border border-line bg-white p-6">
          <span className="flex size-11 items-center justify-center rounded-md border border-line bg-concrete">
            <Truck aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 text-h3 text-ink">Your delivery address</h2>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            Include your postcode when requesting a quote so delivery options and any location-specific charges can be confirmed.
          </p>
        </section>
        <section className="rounded-md border border-line bg-white p-6">
          <span className="flex size-11 items-center justify-center rounded-md border border-line bg-concrete">
            <PackageCheck aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 text-h3 text-ink">Long and heavy goods</h2>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            Long components and complete doors may require specialist transport. Access requirements and lead times are agreed per order.
          </p>
        </section>
        <section className="rounded-md border border-line bg-white p-6">
          <span className="flex size-11 items-center justify-center rounded-md border border-line bg-concrete">
            <RefreshCcw aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 text-h3 text-ink">Return an item</h2>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            Contact the team with your order reference and the reason for the return before sending an item back. Return options depend on the product and applicable order terms.
          </p>
        </section>
      </div>

      <p className="mt-10 max-w-2xl text-sm text-steel">
        Questions about a specific postcode or an urgent job? Call{" "}
        <a href="tel:+442045774094" className="font-medium text-ink underline underline-offset-4">
          +44 (0)20 4577 4094
        </a>{" "}
        before you order and we&apos;ll tell you straight what&apos;s possible.
      </p>
    </main>
  );
}
