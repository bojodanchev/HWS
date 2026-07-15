import type { Stock } from "@/types/catalog";
import { cn } from "@/lib/utils";

const LABELS: Record<Stock["status"], string> = {
  in_stock: "In stock",
  low: "Low stock",
  backorder: "Backorder",
  out: "Out of stock",
};

export function StockBadge({ stock, className }: { stock: Stock; className?: string }) {
  const dotColor =
    stock.status === "in_stock"
      ? "bg-success"
      : stock.status === "low"
        ? "bg-warning"
        : stock.status === "backorder"
          ? "bg-steel"
          : "bg-danger";

  return (
    <p className={cn("flex items-center gap-2 text-sm text-steel", className)}>
      <span aria-hidden className={cn("size-2 rounded-full", dotColor)} />
      <span>
        {LABELS[stock.status]}
        {stock.status === "in_stock" && stock.qty !== undefined && stock.qty >= 10 && (
          <span className="text-mist"> · 10+ available</span>
        )}
        {stock.nextDayEligible && stock.status !== "out" && (
          <span className="font-medium text-ink"> · Next day</span>
        )}
        {stock.status === "backorder" && stock.leadTimeDays !== undefined && (
          <span> · {stock.leadTimeDays}–{stock.leadTimeDays + 2} days</span>
        )}
      </span>
    </p>
  );
}
