import { createClient } from "@/lib/supabase/server";

const DAILY_LIMIT = 2;

export async function GET() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tier = (user.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const isPremium = tier === "PREMIUM_14_DAY" || tier === "ANNUAL";
  if (isPremium) {
    return Response.json({ unlimited: true });
  }

  const { data: usage } = await supabase
    .from("ai_usage")
    .select("count, reset_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const now = new Date();
  const resetAt = usage?.reset_at ? new Date(usage.reset_at) : null;
  const remaining = resetAt && resetAt <= now ? DAILY_LIMIT : Math.max(0, DAILY_LIMIT - (usage?.count ?? 0));

  return Response.json({
    unlimited: false,
    remaining,
    resetAt: resetAt?.toISOString() ?? null,
  });
}
