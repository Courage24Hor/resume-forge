"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type AuthActionsProps = {
  userEmail?: string | null;
  loading?: boolean;
  tier?: string | null;
  loginLabel?: string;
  className?: string;
};

export function AuthActions({
  userEmail,
  loading = false,
  tier,
  loginLabel = "Login / Free Account",
  className,
}: AuthActionsProps) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return <span className="text-xs font-medium text-white/60">Checking session…</span>;
  }

  const isPremium = tier === "PREMIUM_14_DAY" || tier === "ANNUAL";

  if (userEmail) {
    return (
      <div className={`flex items-center gap-3 ${className ?? ""}`}>
        {isPremium && (
          <span className="hidden rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300 sm:inline">
            Premium
          </span>
        )}
        <Link href="/account" className="hidden text-xs font-medium text-white/70 hover:text-white sm:inline">
          {userEmail}
        </Link>
        <Button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="h-10 border border-white/15 bg-white/5 px-5 text-white hover:bg-white/10"
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login" className={className}>
      <Button className="h-10 bg-[#f97316] px-5 text-white hover:bg-[#ea580c]">
        {loginLabel}
      </Button>
    </Link>
  );
}
