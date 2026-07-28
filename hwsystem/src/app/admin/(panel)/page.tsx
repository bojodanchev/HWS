import type { Metadata } from "next";
import { Banknote, FileText, Inbox, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import { BreakdownBars } from "@/components/admin/BreakdownBars";
import { StatCard } from "@/components/admin/StatCard";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { formatGBP } from "@/lib/catalog";
import {
  formatShortDateTime,
  getCatalogSummary,
  getLeadsSummary,
  getOrdersSummary,
  getRecentLeads,
  getSupportSummary,
} from "@/lib/adminOps";

export const metadata: Metadata = { title: "Overview" };

const LEAD_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export default async function AdminOverviewPage() {
  const [leads, recentLeads, support, orders] = await Promise.all([
    getLeadsSummary(),
    getRecentLeads(8),
    getSupportSummary(),
    getOrdersSummary(),
  ]);
  const catalog = getCatalogSummary();

  return (
    <div className="space-y-8">
      <section aria-label="Key numbers" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Leads, last 7 days"
          value={String(leads.total)}
          hint={`${leads.quotes} quotes · ${leads.tradeApps} trade applications`}
          icon={Inbox}
        />
        <StatCard
          label="Open support tickets"
          value={String(support.open + support.pending)}
          hint={`${support.highPriorityOpen} high priority`}
          icon={FileText}
        />
        <StatCard
          label="Orders on record"
          value={String(orders.count)}
          hint={
            orders.count > 0
              ? `${orders.needsAction} need action`
              : "Arrive with the Woo integration"
          }
          icon={ShoppingCart}
        />
        <StatCard
          label="Revenue on record"
          value={formatGBP(orders.revenue)}
          hint={
            orders.count > 0
              ? `Average order ${formatGBP(orders.averageOrderValue)}`
              : "No orders recorded yet"
          }
          icon={Banknote}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-md border border-line bg-white p-6">
          <h2 className="text-h3 text-ink">Leads per day</h2>
          <p className="mt-1 text-sm text-steel">
            Quote requests and trade applications combined.
            {leads.total > 0 ? ` Busiest day: ${leads.busiestDay}.` : ""}
          </p>
          <div className="mt-5">
            <BreakdownBars
              unit="leads"
              items={leads.perDay.map((d) => ({
                label: d.day,
                value: d.quotes + d.tradeApps,
              }))}
            />
          </div>
        </section>

        <section className="rounded-md border border-line bg-white p-6">
          <h2 className="text-h3 text-ink">Catalog health</h2>
          <p className="mt-1 text-sm text-steel">
            {catalog.totalProducts} products across {catalog.brands} brands;{" "}
            {catalog.nextDayEligible} eligible for next-day delivery.
          </p>
          <div className="mt-5">
            <BreakdownBars
              unit="products"
              items={[
                { label: "In stock", value: catalog.inStock },
                { label: "Low stock", value: catalog.lowStock },
                { label: "Backorder", value: catalog.backorder },
                { label: "Out of stock", value: catalog.out },
              ]}
            />
          </div>
        </section>
      </div>

      <section className="rounded-md border border-line bg-white p-6">
        <h2 className="text-h3 text-ink">Recent leads</h2>
        <p className="mt-1 text-sm text-steel">
          Live quote and trade form submissions land here as they arrive.
        </p>
        {recentLeads.length === 0 ? (
          <p className="mt-4 rounded-md border border-line bg-concrete px-4 py-6 text-center text-sm text-steel">
            No leads yet. Submissions from the quote and trade forms appear
            here automatically.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[13px] text-steel">
                  <th scope="col" className="py-2 pr-4 font-medium">Lead</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Type</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Detail</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Status</th>
                  <th scope="col" className="py-2 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-line last:border-0 align-top">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-ink">{lead.name}</p>
                      <p className="text-[13px] text-steel">
                        {lead.email} · {lead.phone}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-steel">
                      {lead.kind === "quote" ? "Quote" : "Trade application"}
                    </td>
                    <td className="max-w-[280px] py-3 pr-4 text-steel">
                      <span className="line-clamp-2">{lead.detail}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusSelect
                        endpoint={`/api/admin/leads/${lead.id}`}
                        field="status"
                        value={lead.status}
                        options={LEAD_STATUS_OPTIONS}
                        label={`Status for lead from ${lead.name}`}
                      />
                    </td>
                    <td className="py-3 text-steel">
                      {formatShortDateTime(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-md border border-line bg-white p-6">
        <h2 className="text-h3 text-ink">Where attention is needed</h2>
        <ul className="mt-4 space-y-3 text-sm text-steel">
          <li className="flex items-center gap-2">
            <Badge tone={leads.uncontacted > 0 ? "warning" : "success"} label={`${leads.uncontacted} new leads`} />
            <span>not yet contacted</span>
          </li>
          <li className="flex items-center gap-2">
            <Badge tone={support.highPriorityOpen > 0 ? "danger" : "success"} label={`${support.highPriorityOpen} high-priority tickets`} />
            <span>waiting in customer support</span>
          </li>
          <li className="flex items-center gap-2">
            <Badge tone={orders.needsAction > 0 ? "warning" : "success"} label={`${orders.needsAction} orders`} />
            <span>awaiting payment or on hold</span>
          </li>
          <li className="flex items-center gap-2">
            <Badge tone={catalog.out > 0 ? "warning" : "success"} label={`${catalog.out} products out of stock`} />
            <span>in the live catalog</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
