import { createClient } from "@/lib/supabase/server";
import { checkAndConsumeAiUsage } from "@/lib/ai-usage";
import { makeRateLimitKey, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return Response.json(
      { error: "AI optimization is unavailable right now." },
      { status: 503 }
    );
  }

  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateKey = makeRateLimitKey("ai-optimize", auth.user.id);
  const limitResult = await rateLimit({ key: rateKey, limit: 20, windowMs: 60 * 60 * 1000 });
  if (!limitResult.allowed) {
    return Response.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const usage = await checkAndConsumeAiUsage(supabase, auth.user);
  if (!usage.allowed) {
    return Response.json(
      { error: "Free AI usage limit reached. Try again tomorrow." },
      { status: 429 }
    );
  }

  const { body, role, company } = await req.json();

  let payload: any = null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a cover letter coach. Rewrite the body to be concise, professional, and results-driven. Preserve the user's intent and keep it under 160 words.",
          },
          {
            role: "user",
            content: `Role/Subject: ${role ?? ""}\nCompany: ${company ?? ""}\nBody:\n${body ?? ""}`,
          },
        ],
      }),
      signal: controller.signal,
    });
    payload = await res.json();
    if (!res.ok) {
      console.error("OpenRouter optimize error", {
        status: res.status,
        message: payload?.error?.message ?? payload?.error ?? "Unknown error",
      });
      return Response.json({ error: "Optimization failed." }, { status: 500 });
    }
  } catch (error) {
    console.error("OpenRouter optimize request failed", error);
    return Response.json({ error: "Optimization timed out." }, { status: 504 });
  } finally {
    clearTimeout(timeout);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    return Response.json({ error: "Optimization failed." }, { status: 500 });
  }

  return Response.json({ optimized: content });
}
