/**
 * Admin database — libSQL/SQLite behind a single seam.
 *
 * - Local dev: a SQLite file at data/hws-admin.db (gitignored).
 * - Production: set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN (the convention
 *   used across our Vercel projects; DATABASE_URL/DATABASE_AUTH_TOKEN are
 *   accepted as a fallback). Without them, Vercel falls back to file:/tmp —
 *   functional but ephemeral per serverless instance, so leads still also
 *   go out through deliverLead (Slack/email/logs).
 *
 * Schema is created on first use. Tables start empty and fill with real
 * records only: leads and tickets come from live site form submissions;
 * orders arrive with the WooCommerce integration.
 */

import "server-only";

import { mkdirSync } from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";

function resolveUrl(): { url: string; authToken?: string } {
  if (process.env.TURSO_DATABASE_URL) {
    return {
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    };
  }
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    };
  }
  if (process.env.VERCEL) {
    return { url: "file:/tmp/hws-admin.db" };
  }
  const dir = path.join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  return { url: `file:${path.join(dir, "hws-admin.db")}` };
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    detail TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    customer TEXT NOT NULL,
    channel TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    opened_at TEXT NOT NULL,
    first_response_mins INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    account TEXT NOT NULL,
    skus TEXT NOT NULL,
    units INTEGER NOT NULL,
    value REAL NOT NULL,
    status TEXT NOT NULL,
    placed_at TEXT NOT NULL,
    next_day INTEGER NOT NULL
  )`,
];

type DbGlobal = typeof globalThis & { __hwsDb?: Promise<Client> };

async function init(): Promise<Client> {
  const { url, authToken } = resolveUrl();
  const client = createClient({ url, authToken });
  for (const statement of SCHEMA) {
    await client.execute(statement);
  }
  return client;
}

/** Initialised database client (singleton across dev reloads). */
export function getDb(): Promise<Client> {
  const g = globalThis as DbGlobal;
  if (!g.__hwsDb) {
    g.__hwsDb = init();
  }
  return g.__hwsDb;
}
