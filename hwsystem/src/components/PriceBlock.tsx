import Link from "next/link";
import type { Price } from "@/types/catalog";
import { formatGBP } from "@/lib/catalog";

/**
 * Shows RRP for everyone. Trade prices never reach this component for
 * unauthenticated viewers — src/lib/catalog.ts strips them server-side —
 * so the trade gate is a link, not a reveal.
 */
export function PriceBlock({ price, compact = false }: { price: Price; compact?: boolean }) {
  return (
    <div>
      <p className={compact ? "text-xl font-semibold text-ink" : "text-2xl font-semibold text-ink"}>
        {formatGBP(price.rrp)}
        <span className="ml-1.5 text-sm font-normal text-mist">
          {price.vatIncluded ? "inc VAT" : "ex VAT"}
        </span>
      </p>
      <Link
        href="/trade"
        className="mt-1 inline-block text-sm font-medium text-steel underline-offset-4 hover:text-ink hover:underline"
      >
        Log in for trade price
      </Link>
      {!compact && price.priceBreaks && price.priceBreaks.length > 1 && (
        <table className="mt-4 w-full max-w-xs border-collapse text-sm">
          <caption className="mb-1 text-left text-xs font-medium uppercase tracking-[0.08em] text-mist">
            Volume pricing
          </caption>
          <thead>
            <tr className="border-b border-line text-left text-steel">
              <th className="py-1.5 pr-4 font-medium">Qty</th>
              <th className="py-1.5 font-medium">Unit price ex VAT</th>
            </tr>
          </thead>
          <tbody>
            {price.priceBreaks.map((b) => (
              <tr key={b.qty} className="border-b border-line">
                <td className="py-1.5 pr-4 font-mono text-ink">{b.qty}+</td>
                <td className="py-1.5 text-ink">{formatGBP(b.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
