/**
 * Internal admin panel types — operational data (leads, support tickets,
 * orders). Catalog/product types stay in src/types/catalog.ts.
 */

export type TicketChannel =
  | "phone"
  | "email"
  | "quote_form"
  | "trade_form"
  | "ai_chat";
export type TicketStatus = "open" | "pending" | "resolved";
export type TicketPriority = "low" | "normal" | "high";

export interface SupportTicket {
  id: string;
  subject: string;
  customer: string;
  channel: TicketChannel;
  status: TicketStatus;
  priority: TicketPriority;
  openedAt: string; // ISO datetime
  firstResponseMins?: number;
}

export type OrderStatus =
  | "awaiting_payment"
  | "processing"
  | "picking"
  | "dispatched"
  | "delivered"
  | "on_hold";

export interface AdminOrder {
  id: string;
  customer: string;
  account: "trade" | "retail";
  skus: string[];
  units: number;
  value: number; // GBP
  status: OrderStatus;
  placedAt: string; // ISO datetime
  nextDay: boolean;
}

export interface LeadDay {
  day: string; // e.g. "Mon 22"
  quotes: number;
  tradeApps: number;
}

export type LeadKind = "quote" | "trade_application";
export type LeadStatus = "new" | "contacted" | "closed";

export interface LeadRecord {
  id: string;
  kind: LeadKind;
  name: string;
  email: string;
  phone: string;
  /** Message excerpt (quote) or contact + volume summary (trade). */
  detail: string;
  status: LeadStatus;
  createdAt: string; // ISO datetime
}
