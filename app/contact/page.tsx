"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";

export default function ContactPage() {
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Contact</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white lg:text-5xl">
          Let’s talk about your resume goals.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/75">
          For support, partnerships, or feedback, reach out and we’ll respond quickly.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Email</h2>
            <p className="mt-2 text-sm text-white/70">support@resumeforge.pro</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Business</h2>
            <p className="mt-2 text-sm text-white/70">partnerships@resumeforge.pro</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
