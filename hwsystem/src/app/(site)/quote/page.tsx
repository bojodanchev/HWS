import type { Metadata } from "next";
import Link from "next/link";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a quote",
  description:
    "Request a quote for garage door parts, motors or complete doors. Include your SKU, quantities and project details.",
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ sku?: string | string[] }>;
}) {
  const sp = await searchParams;
  const sku = Array.isArray(sp.sku) ? sp.sku[0] : sp.sku;

  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-mist">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-steel">Quote</span>
      </nav>
      <div className="mt-4 grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-h1 text-ink">Request a quote</h1>
          <p className="mt-4 max-w-md text-steel">
            Doors, bulk part orders, or anything you can&apos;t find in the
            catalogue. For a question about your request,
            if it&apos;s urgent, call{" "}
            <a href="tel:+442045774094" className="font-medium text-ink underline underline-offset-4">
              +44 (0)20 4577 4094
            </a>
            .
          </p>
          <ul className="mt-6 max-w-md space-y-2 text-sm text-steel">
            <li>· For doors: include rough opening size, quantity and location</li>
            <li>· For parts: the SKU or a photo of the old part&apos;s label is enough</li>
            <li>· Trade customers: quote prices reflect your tier</li>
          </ul>
        </div>
        <div className="rounded-md border border-line bg-white p-6 lg:p-8">
          <QuoteForm subject={sku} />
        </div>
      </div>
    </main>
  );
}
