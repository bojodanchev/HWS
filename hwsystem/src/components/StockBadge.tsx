import type { DisplayStock } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const LABELS: Record<DisplayStock["status"], string> = {
  in_stock: "In stock",
  low: "Low stock",
  backorder: "Backorder",
  out: "Out of stock",
  unknown: "Availability on request",
};

export function StockBadge({ stock, className }: { stock: DisplayStock; className?: string }) {
  const unknown = stock.status === "unknown";
  const dotColor =
    stock.status === "in_stock"
      ? "bg-success"
      : stock.status === "low"
        ? "bg-warning"
        : stock.status === "backorder"
          ? "bg-steel"
          : stock.status === "out"
            ? "bg-danger"
            : "bg-mist";

  return (
    <p className={cn("flex items-center gap-2 text-sm text-steel", className)}>
      <span aria-hidden className={cn("size-2 rounded-full", dotColor)} />
      <span>
        {LABELS[stock.status]}
        {!unknown && stock.status === "in_stock" && stock.qty !== undefined && stock.qty >= 10 && (
          <span className="text-mist"> · 10+ available</span>
        )}
        {!unknown && stock.nextDayEligible && stock.status !== "out" && (
          <span className="font-medium text-ink"> · Next day</span>
        )}
        {!unknown && stock.status === "backorder" && stock.leadTimeDays !== undefined && (
          <span> · {stock.leadTimeDays}–{stock.leadTimeDays + 2} days</span>
        )}
      </span>
    </p>
  );
}
