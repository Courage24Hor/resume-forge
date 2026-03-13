import { initiatePayment } from "@/lib/paystack";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { makeRateLimitKey, rateLimit } from "@/lib/rate-limit";

export async function POST() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!user.email) {
    return NextResponse.json({ error: "No email found on account" }, { status: 400 });
  }

  const rateKey = makeRateLimitKey("payments-init", user.id);
  const limitResult = await rateLimit({ key: rateKey, limit: 5, windowMs: 60 * 60 * 1000 });
  if (!limitResult.allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  try {
    const url = await initiatePayment(
      user.email,
      29.00, // Amount in GHS
      user.id
    );

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Paystack Init Error:", error);
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
