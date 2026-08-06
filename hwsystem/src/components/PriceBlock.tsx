import Link from "next/link";
import {
  formatGBP,
  formatVatRate,
  getPriceBreakdown,
  hasPublicPrice,
  type DisplayPrice,
} from "@/lib/catalog";

/**
 * Shows a public RRP when one is available. Trade prices never reach this
 * component for unauthenticated viewers — src/lib/catalog.ts strips them
 * server-side — so the trade gate is a link, not a reveal.
 */
export function PriceBlock({
  price,
  compact = false,
  quoteHref = "/quote",
}: {
  price: DisplayPrice;
  compact?: boolean;
  quoteHref?: string;
}) {
  if (!hasPublicPrice(price)) {
    return (
      <div>
        <p className={compact ? "text-xl font-semibold text-ink" : "text-2xl font-semibold text-ink"}>
          Price on request
        </p>
        <p className="mt-1 text-sm text-steel">VAT calculated on the confirmed quote.</p>
        <Link
          href={quoteHref}
          className="mt-1 inline-block text-sm font-medium text-steel underline-offset-4 hover:text-ink hover:underline"
        >
          Request a quote
        </Link>
      </div>
    );
  }

  const breakdown = getPriceBreakdown(price);
  if (!breakdown) return null;

  return (
    <div>
      <p className={compact ? "text-xl font-semibold text-ink" : "text-2xl font-semibold text-ink"}>
        {formatGBP(breakdown.exVat)}
        <span className="ml-1.5 text-sm font-normal text-mist">ex VAT</span>
      </p>
      <p className="mt-1 text-sm text-steel">
        + VAT ({formatVatRate(breakdown.vatRate)}): {formatGBP(breakdown.vat)}
      </p>
      <p className="mt-1 text-sm font-medium text-ink">
        {formatGBP(breakdown.incVat)} <span className="font-normal text-mist">inc VAT</span>
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
                <th className="py-1.5 pr-4 font-medium">Ex VAT</th>
                <th className="py-1.5 font-medium">Inc VAT</th>
              </tr>
            </thead>
            <tbody>
              {price.priceBreaks.map((b) => {
                const breakDown = getPriceBreakdown({ ...price, rrp: b.price });
                return (
                  <tr key={b.qty} className="border-b border-line">
                    <td className="py-1.5 pr-4 font-mono text-ink">{b.qty}+</td>
                    <td className="py-1.5 pr-4 text-ink">{formatGBP(breakDown?.exVat ?? b.price)}</td>
                    <td className="py-1.5 text-ink">{formatGBP(breakDown?.incVat ?? b.price)}</td>
                  </tr>
                );
              })}
            </tbody>
        </table>
      )}
    </div>
  );
}
