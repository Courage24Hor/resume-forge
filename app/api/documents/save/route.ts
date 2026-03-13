import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { makeRateLimitKey, rateLimit } from "@/lib/rate-limit";

const payloadSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["resume", "cv", "cover_letter"]),
  title: z.string().max(120).optional(),
  data: z.record(z.any()),
  template: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateKey = makeRateLimitKey("documents-save", user.id);
  const limitResult = await rateLimit({ key: rateKey, limit: 30, windowMs: 60 * 60 * 1000 });
  if (!limitResult.allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const json = await req.json();
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { id, type, title, data, template } = parsed.data;
  const now = new Date().toISOString();

  const payload = {
    id,
    user_id: user.id,
    type,
    title,
    data,
    template,
    updated_at: now,
  };

  const { data: saved, error } = await supabase
    .from("documents")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ document: saved });
}
