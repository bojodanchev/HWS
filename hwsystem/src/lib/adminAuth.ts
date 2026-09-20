/**
 * Admin panel auth. Requires a deployment-specific secret until real accounts exist.
 * The session cookie carries a static
 * token derived from the password, never the password itself.
 */

import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "hws_admin";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

const ADMIN_PASSWORD = process.env.HWS_ADMIN_PASSWORD ?? "";

export function isAdminConfigured(): boolean {
  return ADMIN_PASSWORD.length >= 16;
}

export const ADMIN_SESSION_TOKEN = createHash("sha256")
  .update(`hws-admin-session:${ADMIN_PASSWORD}`)
  .digest("hex");

export function verifyAdminPassword(input: string): boolean {
  if (!isAdminConfigured()) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(ADMIN_PASSWORD).digest();
  return timingSafeEqual(a, b);
}

export async function isAdminAuthed(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === ADMIN_SESSION_TOKEN;
}
