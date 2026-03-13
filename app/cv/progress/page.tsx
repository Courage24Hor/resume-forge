"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";

export default function CvProgressPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 6;
      setProgress(Math.min(100, value));
      if (value >= 100) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#e8edf8]">
      <header className="border-b border-white/10 bg-[#0a0f1c]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <span className="text-white">Elevate</span>
            <span className="text-[#fb923c]">CV</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-20 lg:px-8">
        <div className="mb-6">
          <Link href="/cv/start" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/5 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Applying Template</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Setting up your CV workspace</h1>
          <p className="mt-2 text-sm text-white/70">We&apos;re preparing your template and readying your builder.</p>

          <div className="mt-8">
            <div className="h-3 w-full rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-[#f97316] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-white/50">{progress}% complete</p>
          </div>

          <div className="mt-8">
            <Link href="/cv/builder">
              <Button className="h-11 bg-[#f97316] px-6 text-white hover:bg-[#ea580c]">
                Continue to Builder
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
