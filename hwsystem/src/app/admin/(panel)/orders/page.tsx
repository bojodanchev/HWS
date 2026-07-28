import type { Metadata } from "next";
import { Banknote, PackageCheck, ShoppingCart, Truck } from "lucide-react";
import { BreakdownBars } from "@/components/admin/BreakdownBars";
import { StatCard } from "@/components/admin/StatCard";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { formatGBP } from "@/lib/catalog";
import {
  formatShortDateTime,
  getOrders,
  getOrdersSummary,
} from "@/lib/adminOps";
import type { OrderStatus } from "@/types/admin";

export const metadata: Metadata = { title: "Order manager" };

const STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment: "Awaiting payment",
  on_hold: "On hold",
  processing: "Processing",
  picking: "Picking",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

const ORDER_STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export default async function AdminOrdersPage() {
  const [summary, orders] = await Promise.all([getOrdersSummary(), getOrders(25)]);

  return (
    <div className="space-y-8">
      <section aria-label="Order key numbers" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Orders on record"
          value={String(summary.count)}
          hint={`${summary.tradeShare}% from trade accounts`}
          icon={ShoppingCart}
        />
        <StatCard
          label="Revenue on record"
          value={formatGBP(summary.revenue)}
          hint={`Average order ${formatGBP(summary.averageOrderValue)}`}
          icon={Banknote}
        />
        <StatCard
          label="Next-day dispatch"
          value={`${summary.nextDayShare}%`}
          hint="Share of orders on next-day service"
          icon={Truck}
        />
        <StatCard
          label="Needs action"
          value={String(summary.needsAction)}
          hint="Awaiting payment or on hold"
          icon={PackageCheck}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-md border border-line bg-white p-6">
          <h2 className="text-h3 text-ink">Pipeline</h2>
          <p className="mt-1 text-sm text-steel">Orders by fulfilment stage.</p>
          <div className="mt-5">
            <BreakdownBars
              unit="orders"
              items={summary.byStatus.map((s) => ({
                label: STATUS_LABELS[s.status],
                value: s.count,
              }))}
            />
          </div>
        </section>

        <section className="rounded-md border border-line bg-white p-6">
          <h2 className="text-h3 text-ink">Most ordered products</h2>
          <p className="mt-1 text-sm text-steel">
            By number of orders containing the SKU, this month.
          </p>
          <div className="mt-5">
            <BreakdownBars
              unit="orders"
              items={summary.topProducts.map((p) => ({
                label: p.name,
                value: p.orders,
              }))}
            />
          </div>
        </section>
      </div>

      <section className="rounded-md border border-line bg-white p-6">
        <h2 className="text-h3 text-ink">Recent orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[13px] text-steel">
                <th scope="col" className="py-2 pr-4 font-medium">Order</th>
                <th scope="col" className="py-2 pr-4 font-medium">Customer</th>
                <th scope="col" className="py-2 pr-4 font-medium">Account</th>
                <th scope="col" className="py-2 pr-4 font-medium">Items</th>
                <th scope="col" className="py-2 pr-4 font-medium">Value</th>
                <th scope="col" className="py-2 pr-4 font-medium">Delivery</th>
                <th scope="col" className="py-2 pr-4 font-medium">Status</th>
                <th scope="col" className="py-2 font-medium">Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-line last:border-0 align-top">
                  <td className="py-3 pr-4">
                    <p className="font-mono text-[13px] text-ink">{order.id}</p>
                    <p className="text-[13px] text-steel">{order.skus.join(", ")}</p>
                  </td>
                  <td className="py-3 pr-4 text-steel">{order.customer}</td>
                  <td className="py-3 pr-4 text-steel">
                    {order.account === "trade" ? "Trade" : "Retail"}
                  </td>
                  <td className="py-3 pr-4 text-ink tabular-nums">{order.units}</td>
                  <td className="py-3 pr-4 text-ink tabular-nums">
                    {formatGBP(order.value)}
                  </td>
                  <td className="py-3 pr-4 text-steel">
                    {order.nextDay ? "Next day" : "Standard"}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusSelect
                      endpoint={`/api/admin/orders/${order.id}`}
                      field="status"
                      value={order.status}
                      options={ORDER_STATUS_OPTIONS}
                      label={`Status for order ${order.id}`}
                    />
                  </td>
                  <td className="py-3 text-steel">
                    {formatShortDateTime(order.placedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
