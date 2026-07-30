import "server-only";

import { createHash } from "node:crypto";
import { getDb } from "@/lib/db";

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

function requestFingerprint(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address =
    forwarded ?? request.headers.get("x-real-ip") ?? "unknown-address";
  const agent = request.headers.get("user-agent") ?? "unknown-agent";
  return createHash("sha256")
    .update(`hws-chat:${address}:${agent}`)
    .digest("hex");
}

export async function consumeRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);
  const resetAt = now + windowSeconds;
  const key = `${scope}:${requestFingerprint(request)}`;

  const result = await db.execute({
    sql: `INSERT INTO rate_limits (key, count, reset_at)
          VALUES (?, 1, ?)
          ON CONFLICT(key) DO UPDATE SET
            count = CASE
              WHEN rate_limits.reset_at <= ? THEN 1
              ELSE rate_limits.count + 1
            END,
            reset_at = CASE
              WHEN rate_limits.reset_at <= ? THEN ?
              ELSE rate_limits.reset_at
            END
          WHERE rate_limits.reset_at <= ? OR rate_limits.count < ?`,
    args: [key, resetAt, now, now, resetAt, now, limit],
  });

  if (result.rowsAffected > 0) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const { rows } = await db.execute({
    sql: "SELECT reset_at FROM rate_limits WHERE key = ? LIMIT 1",
    args: [key],
  });
  const retryAfterSeconds = Math.max(
    1,
    Number(rows[0]?.reset_at ?? resetAt) - now,
  );
  return { allowed: false, retryAfterSeconds };
}
