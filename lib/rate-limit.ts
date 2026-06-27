/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Uses a sliding window algorithm.
 * Production: replace with Redis (Upstash) for multi-instance support.
 */

interface RateRecord { count: number; resetAt: number }

const store = new Map<string, RateRecord>();

// Clean stale entries every 5 minutes
if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    store.forEach((v, k) => { if (v.resetAt < now) store.delete(k); });
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success:   boolean;
  remaining: number;
  resetAt:   number;
}

export function rateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60_000,
): RateLimitResult {
  const now    = Date.now();
  const record = store.get(key);

  if (!record || record.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  record.count += 1;
  const remaining = Math.max(0, limit - record.count);
  return { success: record.count <= limit, remaining, resetAt: record.resetAt };
}

/** Extract a rate-limit key from a Next.js request (IP-based) */
export function getRateLimitKey(req: Request, prefix: string = "rl"): string {
  const forwarded = (req as any).headers?.get?.("x-forwarded-for") || "";
  const ip        = forwarded.split(",")[0]?.trim() || "unknown";
  return `${prefix}:${ip}`;
}
