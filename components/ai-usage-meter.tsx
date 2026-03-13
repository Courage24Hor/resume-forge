"use client";

import { useEffect, useState } from "react";

type UsageState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "free"; remaining: number; resetAt?: string }
  | { status: "premium" };

export function AiUsageMeter() {
  const [state, setState] = useState<UsageState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/ai-usage");
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          if (!cancelled) {
            setState({ status: "error", message: payload?.error ?? "Unable to load usage." });
          }
          return;
        }
        const payload = await res.json();
        if (payload?.unlimited) {
          if (!cancelled) setState({ status: "premium" });
          return;
        }
        if (!cancelled) {
          setState({
            status: "free",
            remaining: Number(payload?.remaining ?? 0),
            resetAt: payload?.resetAt,
          });
        }
      } catch {
        if (!cancelled) setState({ status: "error", message: "Unable to load usage." });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return <p className="text-xs text-white/50">Loading AI usage...</p>;
  }

  if (state.status === "error") {
    return <p className="text-xs text-white/50">{state.message}</p>;
  }

  if (state.status === "premium") {
    return <p className="text-xs text-emerald-300/80">Unlimited AI usage (Premium)</p>;
  }

  return (
    <p className="text-xs text-white/60">
      AI usage today: {state.remaining} / 2 remaining
      {state.resetAt ? ` · resets ${new Date(state.resetAt).toLocaleTimeString()}` : ""}
    </p>
  );
}
