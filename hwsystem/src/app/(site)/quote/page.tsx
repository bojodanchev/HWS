import type { Metadata } from "next";
import Link from "next/link";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a quote",
  description:
    "Get a fast quote for garage door parts, motors or complete doors. Answered within the hour on working days.",
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
            catalogue. Quotes are answered within the hour on working days —
            if it&apos;s urgent, call{" "}
            <a href="tel:+443301234567" className="font-medium text-ink underline underline-offset-4">
              +44 (0)330 123 4567
            </a>
            .
          </p>
          <ul className="mt-6 max-w-md space-y-2 text-sm text-steel">
            <li>· For doors: rough opening size and location help us quote same-day</li>
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
