// Simple in-memory rate limiter per IP + route. Suitable for single-instance dev
// For production across instances, move to Redis/upstash.

const buckets = new Map();

export function rateLimit({ windowMs = 60_000, max = 30 } = {}) {
  return function check(key) {
    const now = Date.now();
    const until = now + windowMs;
    const entry = buckets.get(key) || { count: 0, until };
    if (entry.until < now) {
      entry.count = 0;
      entry.until = until;
    }
    entry.count += 1;
    buckets.set(key, entry);
    const allowed = entry.count <= max;
    return { allowed, remaining: Math.max(0, max - entry.count), reset: entry.until };
  };
}
