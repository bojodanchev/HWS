/**
 * Admin panel data access. Admin pages import ONLY from here — the backing
 * store (src/content/adminOps.ts today, WooCommerce later) is an
 * implementation detail. Server-side only: this module aggregates
 * operational data that must never ship to unauthenticated clients.
 */

import "server-only";

import { leadDays, orders, staff, supportTickets } from "@/content/adminOps";
import { getProducts, getProductsBySkus } from "@/lib/catalog";
import type {
  AdminOrder,
  LeadDay,
  OrderStatus,
  StaffMember,
  SupportTicket,
  TicketChannel,
} from "@/types/admin";

export function getStaff(): StaffMember[] {
  return staff;
}

export function getStaffById(id: string): StaffMember | undefined {
  return staff.find((s) => s.id === id);
}

export function getLeadDays(): LeadDay[] {
  return leadDays;
}

export function getSupportTickets(): SupportTicket[] {
  return supportTickets;
}

export function getOrders(): AdminOrder[] {
  return orders;
}

export interface LeadsSummary {
  total: number;
  quotes: number;
  tradeApps: number;
  busiestDay: string;
}

export function getLeadsSummary(): LeadsSummary {
  const quotes = leadDays.reduce((n, d) => n + d.quotes, 0);
  const tradeApps = leadDays.reduce((n, d) => n + d.tradeApps, 0);
  const busiest = leadDays.reduce((a, b) =>
    b.quotes + b.tradeApps > a.quotes + a.tradeApps ? b : a,
  );
  return { total: quotes + tradeApps, quotes, tradeApps, busiestDay: busiest.day };
}

export interface SupportSummary {
  open: number;
  pending: number;
  resolvedLast7Days: number;
  avgFirstResponseMins: number;
  /** Share of tickets first-answered within 60 minutes. */
  slaHitRate: number;
  byChannel: { channel: TicketChannel; count: number }[];
  highPriorityOpen: number;
}

const SLA_FIRST_RESPONSE_MINS = 60;

export function getSupportSummary(): SupportSummary {
  const open = supportTickets.filter((t) => t.status === "open").length;
  const pending = supportTickets.filter((t) => t.status === "pending").length;
  const resolved = supportTickets.filter((t) => t.status === "resolved").length;

  const responded = supportTickets.filter((t) => t.firstResponseMins !== undefined);
  const avg =
    responded.reduce((n, t) => n + (t.firstResponseMins ?? 0), 0) /
    Math.max(responded.length, 1);
  const withinSla = responded.filter(
    (t) => (t.firstResponseMins ?? Infinity) <= SLA_FIRST_RESPONSE_MINS,
  ).length;

  const channels: TicketChannel[] = ["phone", "email", "quote_form", "trade_form"];
  const byChannel = channels
    .map((channel) => ({
      channel,
      count: supportTickets.filter((t) => t.channel === channel).length,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    open,
    pending,
    resolvedLast7Days: resolved,
    avgFirstResponseMins: Math.round(avg),
    slaHitRate: Math.round((withinSla / Math.max(responded.length, 1)) * 100),
    byChannel,
    highPriorityOpen: supportTickets.filter(
      (t) => t.priority === "high" && t.status !== "resolved",
    ).length,
  };
}

export interface OrdersSummary {
  countThisMonth: number;
  revenueThisMonth: number;
  averageOrderValue: number;
  tradeShare: number;
  nextDayShare: number;
  needsAction: number;
  byStatus: { status: OrderStatus; count: number }[];
  topProducts: { sku: string; name: string; orders: number }[];
}

const ORDER_STATUSES: OrderStatus[] = [
  "awaiting_payment",
  "on_hold",
  "processing",
  "picking",
  "dispatched",
  "delivered",
];

export function getOrdersSummary(): OrdersSummary {
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
    countThisMonth: orders.length,
    revenueThisMonth: revenue,
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
  }).format(new Date(iso));
}
