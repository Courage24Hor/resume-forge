import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export const getRequestIp = (req: Request) => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
};

export const hashKey = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex").slice(0, 24);

export const makeRateLimitKey = (scope: string, identifier: string) =>
  `${scope}:${hashKey(identifier)}`;

export async function rateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const supabase = createAdminClient();
  const now = new Date();

  const { data: existing } = await supabase
    .from("rate_limits")
    .select("count, reset_at")
    .eq("key", key)
    .maybeSingle();

  let count = existing?.count ?? 0;
  let resetAt = existing?.reset_at ? new Date(existing.reset_at) : null;

  if (!resetAt || resetAt <= now) {
    count = 0;
    resetAt = new Date(now.getTime() + windowMs);
  }

  if (count >= limit) {
    return { allowed: false, remaining: 0, resetAt };
  }

  const nextCount = count + 1;
  await supabase.from("rate_limits").upsert({
    key,
    count: nextCount,
    reset_at: resetAt.toISOString(),
    updated_at: now.toISOString(),
  });

  return { allowed: true, remaining: Math.max(0, limit - nextCount), resetAt };
}
