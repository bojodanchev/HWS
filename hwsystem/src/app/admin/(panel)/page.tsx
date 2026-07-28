import type { Metadata } from "next";
import { Banknote, FileText, Inbox, Users } from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import { BreakdownBars } from "@/components/admin/BreakdownBars";
import { StatCard } from "@/components/admin/StatCard";
import { formatGBP } from "@/lib/catalog";
import {
  formatShortDateTime,
  getCatalogSummary,
  getLeadDays,
  getLeadsSummary,
  getOrdersSummary,
  getStaff,
  getSupportSummary,
} from "@/lib/adminOps";
import type { StaffRole } from "@/types/admin";

export const metadata: Metadata = { title: "Overview" };

const ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Admin",
  support: "Customer support",
  orders: "Order manager",
};

export default function AdminOverviewPage() {
  const leads = getLeadsSummary();
  const leadDays = getLeadDays();
  const support = getSupportSummary();
  const orders = getOrdersSummary();
  const catalog = getCatalogSummary();
  const staff = getStaff();

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
          label="Orders this month"
          value={String(orders.countThisMonth)}
          hint={`${orders.needsAction} need action`}
          icon={Users}
        />
        <StatCard
          label="Revenue this month"
          value={formatGBP(orders.revenueThisMonth)}
          hint={`Average order ${formatGBP(orders.averageOrderValue)}`}
          icon={Banknote}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-md border border-line bg-white p-6">
          <h2 className="text-h3 text-ink">Leads per day</h2>
          <p className="mt-1 text-sm text-steel">
            Quote requests and trade applications combined. Busiest day:{" "}
            {leads.busiestDay}.
          </p>
          <div className="mt-5">
            <BreakdownBars
              unit="leads"
              items={leadDays.map((d) => ({
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
        <h2 className="text-h3 text-ink">Team</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[13px] text-steel">
                <th scope="col" className="py-2 pr-4 font-medium">Name</th>
                <th scope="col" className="py-2 pr-4 font-medium">Role</th>
                <th scope="col" className="py-2 pr-4 font-medium">Focus</th>
                <th scope="col" className="py-2 pr-4 font-medium">Actions this week</th>
                <th scope="col" className="py-2 font-medium">Last active</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id} className="border-b border-line last:border-0">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-ink">{member.name}</p>
                    <p className="text-[13px] text-steel">{member.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-steel">{ROLE_LABELS[member.role]}</td>
                  <td className="py-3 pr-4 text-steel">{member.focus}</td>
                  <td className="py-3 pr-4 text-ink tabular-nums">
                    {member.actionsThisWeek}
                  </td>
                  <td className="py-3 text-steel">
                    {formatShortDateTime(member.lastActive)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-md border border-line bg-white p-6">
        <h2 className="text-h3 text-ink">Where attention is needed</h2>
        <ul className="mt-4 space-y-3 text-sm text-steel">
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
