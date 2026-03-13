import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getRequestIp, makeRateLimitKey, rateLimit } from "@/lib/rate-limit";

const payloadSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(6).max(72),
});

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const ipKey = makeRateLimitKey("auth-signin-ip", ip);
  const ipLimit = await rateLimit({ key: ipKey, limit: 15, windowMs: 60 * 60 * 1000 });
  if (!ipLimit.allowed) {
    return Response.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const json = await req.json();
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid payload." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const emailKey = makeRateLimitKey("auth-signin-email", email);
  const emailLimit = await rateLimit({ key: emailKey, limit: 8, windowMs: 60 * 60 * 1000 });
  if (!emailLimit.allowed) {
    return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ ok: true });
}
