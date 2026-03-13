"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#e8edf8]">
      <header className="border-b border-white/10 bg-[#0a0f1c]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <span className="text-white">Elevate</span>
            <span className="text-[#fb923c]">CV</span>
          </Link>
          <Link href="/start">
            <Button className="h-10 bg-[#f97316] px-5 text-white hover:bg-[#ea580c]">Start Building</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Terms</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white lg:text-5xl">
          Terms of Use
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/75">
          These terms will outline how ElevateCV can be used and what users can expect.
          This page will be expanded with full legal language before launch.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
