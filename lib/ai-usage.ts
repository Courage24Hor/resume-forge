import type { SupabaseClient, User } from "@supabase/supabase-js";

const DAILY_LIMIT = 2;

const isPaidTier = (user: User) => {
  const tier = (user.user_metadata as { tier?: string } | undefined)?.tier;
  return tier === "PREMIUM_14_DAY" || tier === "ANNUAL";
};

export async function checkAndConsumeAiUsage(
  supabase: SupabaseClient,
  user: User
) {
  if (isPaidTier(user)) {
    return { allowed: true, remaining: null as number | null };
  }

  const now = new Date();
  const { data: existing, error } = await supabase
    .from("ai_usage")
    .select("count, reset_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    return { allowed: false, remaining: 0, error: "Usage check failed." };
  }

  let count = existing?.count ?? 0;
  let resetAt = existing?.reset_at ? new Date(existing.reset_at) : null;

  if (!resetAt || resetAt <= now) {
    count = 0;
    resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }

  if (count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0, resetAt };
  }

  const nextCount = count + 1;
  const { error: upsertError } = await supabase.from("ai_usage").upsert({
    user_id: user.id,
    count: nextCount,
    reset_at: resetAt.toISOString(),
    updated_at: now.toISOString(),
  });

  if (upsertError) {
    return { allowed: false, remaining: 0, error: "Usage update failed." };
  }

  return { allowed: true, remaining: DAILY_LIMIT - nextCount, resetAt };
}
