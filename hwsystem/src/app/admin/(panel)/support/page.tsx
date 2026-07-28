import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, Clock, Inbox } from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import { BreakdownBars } from "@/components/admin/BreakdownBars";
import { StatCard } from "@/components/admin/StatCard";
import {
  formatShortDateTime,
  getStaffById,
  getSupportSummary,
  getSupportTickets,
} from "@/lib/adminOps";
import type { TicketChannel, TicketPriority, TicketStatus } from "@/types/admin";

export const metadata: Metadata = { title: "Customer support" };

const CHANNEL_LABELS: Record<TicketChannel, string> = {
  phone: "Phone",
  email: "Email",
  quote_form: "Quote form",
  trade_form: "Trade form",
};

const STATUS_BADGES: Record<TicketStatus, { tone: "danger" | "warning" | "success"; label: string }> = {
  open: { tone: "danger", label: "Open" },
  pending: { tone: "warning", label: "Pending" },
  resolved: { tone: "success", label: "Resolved" },
};

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

export default function AdminSupportPage() {
  const summary = getSupportSummary();
  const tickets = getSupportTickets();

  return (
    <div className="space-y-8">
      <section aria-label="Support key numbers" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Open tickets"
          value={String(summary.open + summary.pending)}
          hint={`${summary.open} open · ${summary.pending} pending`}
          icon={Inbox}
        />
        <StatCard
          label="High priority"
          value={String(summary.highPriorityOpen)}
          hint="Unresolved, needs same-day answer"
          icon={AlertTriangle}
        />
        <StatCard
          label="Avg first response"
          value={`${summary.avgFirstResponseMins} min`}
          hint="Across all tickets this week"
          icon={Clock}
        />
        <StatCard
          label="Answered within 1 hour"
          value={`${summary.slaHitRate}%`}
          hint={`${summary.resolvedLast7Days} tickets resolved this week`}
          icon={CheckCircle2}
        />
      </section>

      <section className="rounded-md border border-line bg-white p-6 lg:max-w-xl">
        <h2 className="text-h3 text-ink">Tickets by channel</h2>
        <p className="mt-1 text-sm text-steel">Last 7 days, all statuses.</p>
        <div className="mt-5">
          <BreakdownBars
            unit="tickets"
            items={summary.byChannel.map((c) => ({
              label: CHANNEL_LABELS[c.channel],
              value: c.count,
            }))}
          />
        </div>
      </section>

      <section className="rounded-md border border-line bg-white p-6">
        <h2 className="text-h3 text-ink">Ticket queue</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[13px] text-steel">
                <th scope="col" className="py-2 pr-4 font-medium">Ticket</th>
                <th scope="col" className="py-2 pr-4 font-medium">Customer</th>
                <th scope="col" className="py-2 pr-4 font-medium">Channel</th>
                <th scope="col" className="py-2 pr-4 font-medium">Priority</th>
                <th scope="col" className="py-2 pr-4 font-medium">Status</th>
                <th scope="col" className="py-2 pr-4 font-medium">First response</th>
                <th scope="col" className="py-2 pr-4 font-medium">Assigned to</th>
                <th scope="col" className="py-2 font-medium">Opened</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const status = STATUS_BADGES[ticket.status];
                return (
                  <tr key={ticket.id} className="border-b border-line last:border-0 align-top">
                    <td className="py-3 pr-4">
                      <p className="font-mono text-[13px] text-steel">{ticket.id}</p>
                      <p className="font-medium text-ink">{ticket.subject}</p>
                    </td>
                    <td className="py-3 pr-4 text-steel">{ticket.customer}</td>
                    <td className="py-3 pr-4 text-steel">
                      {CHANNEL_LABELS[ticket.channel]}
                    </td>
                    <td className="py-3 pr-4 text-steel">
                      {PRIORITY_LABELS[ticket.priority]}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge tone={status.tone} label={status.label} />
                    </td>
                    <td className="py-3 pr-4 text-ink tabular-nums">
                      {ticket.firstResponseMins !== undefined
                        ? `${ticket.firstResponseMins} min`
                        : "—"}
                    </td>
                    <td className="py-3 pr-4 text-steel">
                      {getStaffById(ticket.assignedTo)?.name ?? "Unassigned"}
                    </td>
                    <td className="py-3 text-steel">
                      {formatShortDateTime(ticket.openedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
