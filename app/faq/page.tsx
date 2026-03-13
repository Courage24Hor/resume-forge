"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";

const faqs = [
  { q: "Will ElevateCV work with ATS systems?", a: "Yes. Templates are structured for common ATS parsing and recruiter scanning." },
  { q: "Can I start for free?", a: "Yes. You can build a resume and explore templates before upgrading." },
  { q: "Do you have Ghana-specific templates?", a: "Yes. Templates are tailored to local hiring expectations and formatting preferences." },
  { q: "Can I change templates later?", a: "Absolutely. You can switch templates at any time." },
];

export default function FaqPage() {
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">FAQ</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white lg:text-5xl">
          Answers to common questions.
        </h1>

        <div className="mt-10 space-y-4">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="text-lg font-semibold text-white">{item.q}</p>
              <p className="mt-2 text-sm text-white/70">{item.a}</p>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
