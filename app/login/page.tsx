"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const disposableDomains = new Set([
    "mailinator.com",
    "tempmail.com",
    "guerrillamail.com",
    "10minutemail.com",
    "yopmail.com",
    "trashmail.com",
    "getnada.com",
    "dispostable.com",
  ]);
  const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/i;

  const handleSubmit = async () => {
    setMessage("");
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const domain = normalizedEmail.split("@")[1] ?? "";
      if (!normalizedEmail || normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail)) {
        setMessage("Please enter a valid email address (example: name@domain.com).");
        return;
      }
      if (disposableDomains.has(domain)) {
        setMessage("Disposable email addresses are not allowed.");
        return;
      }

      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({ email: normalizedEmail, password }),
        });
        const payload = await res.json();
        if (!res.ok) {
          setMessage(payload?.error ?? "Unable to create account.");
          return;
        }
        setMessage("Check your email to confirm your account.");
        return;
      }

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setMessage(payload?.error ?? "Unable to sign in.");
        return;
      }
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#e8edf8]">
      <header className="border-b border-white/10 bg-[#0a0f1c]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold text-white/70 hover:text-white"
          >
            Back
          </button>
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <span className="text-white">Elevate</span>
            <span className="text-[#fb923c]">CV</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-6 py-20">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            {mode === "signin" ? "Welcome back." : "Start your account."}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            {mode === "signin"
              ? "Access your saved resumes and cover letters."
              : "Create an account to save and download your documents."}
          </p>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Email</Label>
              <Input
                type="email"
                className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="border-white/15 bg-[#0f172a] pr-20 text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/60 hover:text-white"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          {message && <p className="mt-4 text-sm text-[#fb923c]">{message}</p>}

          <div className="mt-6 space-y-3">
            <Button
              className="h-11 w-full bg-[#f97316] text-white hover:bg-[#ea580c]"
              onClick={handleSubmit}
              disabled={loading || !email || !password}
            >
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
            <button
              type="button"
              className="w-full text-sm text-white/70 hover:text-white"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
