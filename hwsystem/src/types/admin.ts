/**
 * Internal admin panel types — operational data (staff, support tickets,
 * orders). Catalog/product types stay in src/types/catalog.ts.
 */

export type StaffRole = "admin" | "support" | "orders";

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  lastActive: string; // ISO datetime
  actionsThisWeek: number;
  focus: string;
}

export type TicketChannel = "phone" | "email" | "quote_form" | "trade_form";
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
  assignedTo: string; // StaffMember id
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
  handledBy: string; // StaffMember id
}

export interface LeadDay {
  day: string; // e.g. "Mon 22"
  quotes: number;
  tradeApps: number;
}
