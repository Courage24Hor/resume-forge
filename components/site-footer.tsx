"use client";

import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-[#0a0f1c]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 text-sm text-white/60 md:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">Elevate<span className="text-[#fb923c]">CV</span></p>
          <p className="mt-3 text-sm text-white/70">
            A guided resume platform built for Ghanaian professionals.
          </p>
          <p className="mt-3 text-xs text-white/50">A C-Tech Systems product.</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Product</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/start" className="hover:text-white">Resume Builder</Link></li>
            <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Company</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Legal</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Use</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-2 px-6 py-6 text-xs text-white/50 md:flex-row md:items-center lg:px-8">
          <p>© {currentYear} ElevateCV, C-Tech Systems. All rights reserved.</p>
          <p>Built in Ghana. Designed for results.</p>
        </div>
      </div>
    </footer>
  );
}
