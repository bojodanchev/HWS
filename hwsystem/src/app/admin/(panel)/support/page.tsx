import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Inbox,
  MessageSquareText,
} from "lucide-react";
import { BreakdownBars } from "@/components/admin/BreakdownBars";
import { StatCard } from "@/components/admin/StatCard";
import { StatusSelect } from "@/components/admin/StatusSelect";
import {
  formatShortDateTime,
  getSupportSummary,
  getSupportTickets,
} from "@/lib/adminOps";
import { getRecentChatConversations } from "@/lib/chatStore";
import type { TicketChannel } from "@/types/admin";

export const metadata: Metadata = { title: "Customer support" };

const CHANNEL_LABELS: Record<TicketChannel, string> = {
  phone: "Phone",
  email: "Email",
  quote_form: "Quote form",
  trade_form: "Trade form",
  ai_chat: "AI chat",
};

const TICKET_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
];

const TICKET_PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

export default async function AdminSupportPage() {
  const [summary, tickets, conversations] = await Promise.all([
    getSupportSummary(),
    getSupportTickets(25),
    getRecentChatConversations(12),
  ]);

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
          value={
            summary.responded > 0 ? `${summary.avgFirstResponseMins} min` : "—"
          }
          hint={`${summary.awaitingFirstResponse} awaiting a first reply`}
          icon={Clock}
        />
        <StatCard
          label="Answered within 1 hour"
          value={summary.responded > 0 ? `${summary.slaHitRate}%` : "—"}
          hint={`${summary.resolved} tickets resolved in total`}
          icon={CheckCircle2}
        />
      </section>

      <section className="rounded-md border border-line bg-white p-6 lg:max-w-xl">
        <h2 className="text-h3 text-ink">Tickets by channel</h2>
        <p className="mt-1 text-sm text-steel">
          All stored tickets — form submissions open tickets automatically.
        </p>
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
        <div className="flex items-start gap-3">
          <MessageSquareText
            aria-hidden
            className="mt-0.5 size-5 text-steel"
            strokeWidth={1.5}
          />
          <div>
            <h2 className="text-h3 text-ink">AI conversations</h2>
            <p className="mt-1 text-sm text-steel">
              Standalone catalogue conversations. Follow-up requests also open
              a support ticket.
            </p>
          </div>
        </div>
        {conversations.length === 0 ? (
          <p className="mt-4 rounded-md border border-line bg-concrete px-4 py-6 text-center text-sm text-steel">
            No AI conversations yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[13px] text-steel">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Conversation
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Contact
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Status
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Messages
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conversation) => (
                  <tr
                    key={conversation.id}
                    className="border-b border-line last:border-0 align-top"
                  >
                    <td className="max-w-[360px] py-3 pr-4">
                      <Link
                        href={`/admin/support/chats/${conversation.id}`}
                        className="font-mono text-[13px] text-ink underline-offset-2 hover:underline"
                      >
                        {conversation.id}
                      </Link>
                      <p className="mt-1 truncate text-steel">
                        {conversation.lastMessage ?? "—"}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-steel">
                      {conversation.visitorEmail ?? "Anonymous"}
                    </td>
                    <td className="py-3 pr-4 text-ink">
                      {conversation.status.replaceAll("_", " ")}
                    </td>
                    <td className="py-3 pr-4 text-ink tabular-nums">
                      {conversation.messageCount}
                    </td>
                    <td className="py-3 text-steel">
                      {formatShortDateTime(conversation.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-md border border-line bg-white p-6">
        <h2 className="text-h3 text-ink">Ticket queue</h2>
        {tickets.length === 0 ? (
          <p className="mt-4 rounded-md border border-line bg-concrete px-4 py-6 text-center text-sm text-steel">
            No tickets yet. A ticket opens automatically for every quote and
            trade form submission.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[13px] text-steel">
                  <th scope="col" className="py-2 pr-4 font-medium">Ticket</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Customer</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Channel</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Priority</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Status</th>
                  <th scope="col" className="py-2 pr-4 font-medium">First response</th>
                  <th scope="col" className="py-2 font-medium">Opened</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-line last:border-0 align-top">
                    <td className="max-w-[300px] py-3 pr-4">
                      <p className="font-mono text-[13px] text-steel">{ticket.id}</p>
                      {ticket.sourceRef ? (
                        <Link
                          href={`/admin/support/chats/${ticket.sourceRef}`}
                          className="font-medium text-ink underline-offset-2 hover:underline"
                        >
                          {ticket.subject}
                        </Link>
                      ) : (
                        <p className="font-medium text-ink">{ticket.subject}</p>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-steel">{ticket.customer}</td>
                    <td className="py-3 pr-4 text-steel">
                      {CHANNEL_LABELS[ticket.channel]}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusSelect
                        endpoint={`/api/admin/tickets/${ticket.id}`}
                        field="priority"
                        value={ticket.priority}
                        options={TICKET_PRIORITY_OPTIONS}
                        label={`Priority for ticket ${ticket.id}`}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <StatusSelect
                        endpoint={`/api/admin/tickets/${ticket.id}`}
                        field="status"
                        value={ticket.status}
                        options={TICKET_STATUS_OPTIONS}
                        label={`Status for ticket ${ticket.id}`}
                      />
                    </td>
                    <td className="py-3 pr-4 text-ink tabular-nums">
                      {ticket.firstResponseMins !== undefined
                        ? `${ticket.firstResponseMins} min`
                        : "—"}
                    </td>
                    <td className="py-3 text-steel">
                      {formatShortDateTime(ticket.openedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
