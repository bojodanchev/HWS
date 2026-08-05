import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Application received",
  robots: { index: false },
};

export default function TradeThankYouPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-1 items-center px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <CheckCircle2 aria-hidden className="mx-auto size-12 text-success" strokeWidth={1.5} />
        <h1 className="mt-5 text-h1 text-ink">Application received</h1>
        <p className="mt-4 text-steel">
          We review every application manually and reply within one working
          day. Keep an eye on your inbox — we may call to confirm details.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-11 items-center rounded-md border border-line px-6 text-sm font-medium text-ink transition-colors duration-150 hover:bg-concrete"
        >
          Browse the catalogue meanwhile
        </Link>
      </div>
    </main>
  );
}
