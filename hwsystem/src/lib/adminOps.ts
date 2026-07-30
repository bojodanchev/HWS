/**
 * Admin panel data access. Admin pages and API routes import ONLY from
 * here — the backing store (libSQL via src/lib/db.ts) is an implementation
 * detail. Server-side only: this module aggregates operational data that
 * must never ship to unauthenticated clients.
 */

import "server-only";

import type { Row } from "@libsql/client";
import { getDb } from "@/lib/db";
import { getProducts, getProductsBySkus } from "@/lib/catalog";
import type {
  AdminOrder,
  LeadDay,
  LeadKind,
  LeadRecord,
  LeadStatus,
  OrderStatus,
  SupportTicket,
  TicketChannel,
  TicketPriority,
  TicketStatus,
} from "@/types/admin";

function rowToLead(row: Row): LeadRecord {
  return {
    id: String(row.id),
    kind: row.kind as LeadKind,
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    detail: String(row.detail),
    status: row.status as LeadStatus,
    createdAt: String(row.created_at),
  };
}

function rowToTicket(row: Row): SupportTicket {
  return {
    id: String(row.id),
    subject: String(row.subject),
    customer: String(row.customer),
    channel: row.channel as TicketChannel,
    status: row.status as TicketStatus,
    priority: row.priority as TicketPriority,
    openedAt: String(row.opened_at),
    firstResponseMins:
      row.first_response_mins === null ? undefined : Number(row.first_response_mins),
  };
}

function rowToOrder(row: Row): AdminOrder {
  return {
    id: String(row.id),
    customer: String(row.customer),
    account: row.account === "trade" ? "trade" : "retail",
    skus: JSON.parse(String(row.skus)) as string[],
    units: Number(row.units),
    value: Number(row.value),
    status: row.status as OrderStatus,
    placedAt: String(row.placed_at),
    nextDay: Number(row.next_day) === 1,
  };
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export interface NewLead {
  kind: LeadKind;
  name: string;
  email: string;
  phone: string;
  detail: string;
}

/**
 * Persist a live site submission and open a matching support ticket.
 * Called from the public form API routes.
 */
export async function recordLead(lead: NewLead): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  // Time-ordered and collision-proof for concurrent submissions.
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  const detail = lead.detail.slice(0, 300);

  await db.batch(
    [
      {
        sql: `INSERT INTO leads (id, kind, name, email, phone, detail, status, created_at)
              VALUES (?, ?, ?, ?, ?, ?, 'new', ?)`,
        args: [`L-${suffix}`, lead.kind, lead.name, lead.email, lead.phone, detail, now],
      },
      {
        sql: `INSERT INTO tickets (id, subject, customer, channel, status, priority, opened_at, first_response_mins)
              VALUES (?, ?, ?, ?, 'open', 'normal', ?, NULL)`,
        args: [
          `T-${suffix}`,
          lead.kind === "quote"
            ? `Quote follow-up — ${detail.slice(0, 80)}`
            : `Trade application — ${lead.name}`,
          lead.name,
          lead.kind === "quote" ? "quote_form" : "trade_form",
          now,
        ],
      },
    ],
    "write",
  );
}

export async function getRecentLeads(limit = 8): Promise<LeadRecord[]> {
  const db = await getDb();
  const { rows } = await db.execute({
    sql: "SELECT * FROM leads ORDER BY created_at DESC LIMIT ?",
    args: [limit],
  });
  return rows.map(rowToLead);
}

const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<boolean> {
  if (!LEAD_STATUSES.includes(status)) return false;
  const db = await getDb();
  const result = await db.execute({
    sql: "UPDATE leads SET status = ? WHERE id = ?",
    args: [status, id],
  });
  return result.rowsAffected > 0;
}

export interface LeadsSummary {
  total: number;
  quotes: number;
  tradeApps: number;
  uncontacted: number;
  busiestDay: string;
  perDay: LeadDay[];
}

/** Last 7 calendar days of leads, oldest day first. */
export async function getLeadsSummary(): Promise<LeadsSummary> {
  const db = await getDb();
  const since = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
  since.setUTCHours(0, 0, 0, 0);
  const { rows } = await db.execute({
    sql: "SELECT kind, status, created_at FROM leads WHERE created_at >= ?",
    args: [since.toISOString()],
  });

  const dayFormat = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const perDay: LeadDay[] = [];
  const dayIndex = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const date = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
    const key = date.toISOString().slice(0, 10);
    dayIndex.set(key, perDay.length);
    perDay.push({ day: dayFormat.format(date), quotes: 0, tradeApps: 0 });
  }

  let quotes = 0;
  let tradeApps = 0;
  let uncontacted = 0;
  for (const row of rows) {
    const isQuote = row.kind === "quote";
    if (isQuote) quotes++;
    else tradeApps++;
    if (row.status === "new") uncontacted++;
    const index = dayIndex.get(String(row.created_at).slice(0, 10));
    if (index !== undefined) {
      if (isQuote) perDay[index].quotes++;
      else perDay[index].tradeApps++;
    }
  }

  const busiest = perDay.reduce((a, b) =>
    b.quotes + b.tradeApps > a.quotes + a.tradeApps ? b : a,
  );
  return {
    total: quotes + tradeApps,
    quotes,
    tradeApps,
    uncontacted,
    busiestDay: busiest.day,
    perDay,
  };
}

// ---------------------------------------------------------------------------
// Support tickets
// ---------------------------------------------------------------------------

export async function getSupportTickets(limit = 25): Promise<SupportTicket[]> {
  const db = await getDb();
  const { rows } = await db.execute({
    sql: "SELECT * FROM tickets ORDER BY opened_at DESC LIMIT ?",
    args: [limit],
  });
  return rows.map(rowToTicket);
}

/** Store the visitor's first chat question in the support queue. */
export async function recordChatQuestion(question: string): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  await db.execute({
    sql: `INSERT INTO tickets (id, subject, customer, channel, status, priority, opened_at, first_response_mins)
          VALUES (?, ?, 'Website visitor', 'ai_chat', 'resolved', 'normal', ?, 0)`,
    args: [`T-${suffix}`, `AI chat — ${question.slice(0, 180)}`, now],
  });
}

const TICKET_STATUSES: TicketStatus[] = ["open", "pending", "resolved"];
const TICKET_PRIORITIES: TicketPriority[] = ["low", "normal", "high"];

export async function updateTicket(
  id: string,
  patch: { status?: TicketStatus; priority?: TicketPriority },
): Promise<boolean> {
  if (patch.status && !TICKET_STATUSES.includes(patch.status)) return false;
  if (patch.priority && !TICKET_PRIORITIES.includes(patch.priority)) return false;
  const sets: string[] = [];
  const args: (string | number)[] = [];
  if (patch.status) {
    sets.push("status = ?");
    args.push(patch.status);
  }
  if (patch.priority) {
    sets.push("priority = ?");
    args.push(patch.priority);
  }
  if (sets.length === 0) return false;
  args.push(id);
  const db = await getDb();
  const result = await db.execute({
    sql: `UPDATE tickets SET ${sets.join(", ")} WHERE id = ?`,
    args,
  });
  return result.rowsAffected > 0;
}

export interface SupportSummary {
  open: number;
  pending: number;
  resolved: number;
  /** Tickets with a recorded first response. */
  responded: number;
  avgFirstResponseMins: number;
  /** Share of answered tickets first-answered within 60 minutes. */
  slaHitRate: number;
  byChannel: { channel: TicketChannel; count: number }[];
  highPriorityOpen: number;
  awaitingFirstResponse: number;
}

const SLA_FIRST_RESPONSE_MINS = 60;

export async function getSupportSummary(): Promise<SupportSummary> {
  const tickets = await getSupportTickets(500);
  const open = tickets.filter((t) => t.status === "open").length;
  const pending = tickets.filter((t) => t.status === "pending").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;

  const responded = tickets.filter((t) => t.firstResponseMins !== undefined);
  const avg =
    responded.reduce((n, t) => n + (t.firstResponseMins ?? 0), 0) /
    Math.max(responded.length, 1);
  const withinSla = responded.filter(
    (t) => (t.firstResponseMins ?? Infinity) <= SLA_FIRST_RESPONSE_MINS,
  ).length;

  const channels: TicketChannel[] = [
    "phone",
    "email",
    "quote_form",
    "trade_form",
    "ai_chat",
  ];
  const byChannel = channels
    .map((channel) => ({
      channel,
      count: tickets.filter((t) => t.channel === channel).length,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    open,
    pending,
    resolved,
    responded: responded.length,
    avgFirstResponseMins: Math.round(avg),
    slaHitRate: Math.round((withinSla / Math.max(responded.length, 1)) * 100),
    byChannel,
    highPriorityOpen: tickets.filter(
      (t) => t.priority === "high" && t.status !== "resolved",
    ).length,
    awaitingFirstResponse: tickets.filter(
      (t) => t.firstResponseMins === undefined && t.status !== "resolved",
    ).length,
  };
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function getOrders(limit = 25): Promise<AdminOrder[]> {
  const db = await getDb();
  const { rows } = await db.execute({
    sql: "SELECT * FROM orders ORDER BY placed_at DESC LIMIT ?",
    args: [limit],
  });
  return rows.map(rowToOrder);
}

const ORDER_STATUSES: OrderStatus[] = [
  "awaiting_payment",
  "on_hold",
  "processing",
  "picking",
  "dispatched",
  "delivered",
];

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<boolean> {
  if (!ORDER_STATUSES.includes(status)) return false;
  const db = await getDb();
  const result = await db.execute({
    sql: "UPDATE orders SET status = ? WHERE id = ?",
    args: [status, id],
  });
  return result.rowsAffected > 0;
}

export interface OrdersSummary {
  count: number;
  revenue: number;
  averageOrderValue: number;
  tradeShare: number;
  nextDayShare: number;
  needsAction: number;
  byStatus: { status: OrderStatus; count: number }[];
  topProducts: { sku: string; name: string; orders: number }[];
}

export async function getOrdersSummary(): Promise<OrdersSummary> {
  const orders = await getOrders(500);
  const revenue = orders.reduce((n, o) => n + o.value, 0);
  const trade = orders.filter((o) => o.account === "trade").length;
  const nextDay = orders.filter((o) => o.nextDay).length;

  const byStatus = ORDER_STATUSES.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));

  const skuOrders = new Map<string, number>();
  for (const order of orders) {
    for (const sku of order.skus) {
      skuOrders.set(sku, (skuOrders.get(sku) ?? 0) + 1);
    }
  }
  const topSkus = [...skuOrders.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const named = getProductsBySkus(topSkus.map(([sku]) => sku));
  const topProducts = topSkus.map(([sku, count]) => ({
    sku,
    name: named.find((p) => p.sku === sku)?.name ?? sku,
    orders: count,
  }));

  return {
    count: orders.length,
    revenue,
    averageOrderValue: revenue / Math.max(orders.length, 1),
    tradeShare: Math.round((trade / Math.max(orders.length, 1)) * 100),
    nextDayShare: Math.round((nextDay / Math.max(orders.length, 1)) * 100),
    needsAction: orders.filter(
      (o) => o.status === "awaiting_payment" || o.status === "on_hold",
    ).length,
    byStatus,
    topProducts,
  };
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export interface CatalogSummary {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  backorder: number;
  out: number;
  nextDayEligible: number;
  brands: number;
}

export function getCatalogSummary(): CatalogSummary {
  const products = getProducts();
  return {
    totalProducts: products.length,
    inStock: products.filter((p) => p.stock.status === "in_stock").length,
    lowStock: products.filter((p) => p.stock.status === "low").length,
    backorder: products.filter((p) => p.stock.status === "backorder").length,
    out: products.filter((p) => p.stock.status === "out").length,
    nextDayEligible: products.filter((p) => p.stock.nextDayEligible).length,
    brands: new Set(products.map((p) => p.brand)).size,
  };
}

export function formatShortDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(iso));
}
