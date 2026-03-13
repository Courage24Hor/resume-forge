"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, FileText, Mail, GraduationCap, Sparkles, Clock, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLATFORM_NAME = "ElevateCV";
const currentYear = new Date().getFullYear();

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#e8edf8]">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0f1c]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {PLATFORM_NAME}
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/builder">
              <Button className="h-10 bg-[#f97316] px-5 text-white hover:bg-[#ea580c]">Start Building</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(249,115,22,0.28),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.22),transparent_42%)]" />
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <Reveal reduced={reduced}>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white lg:text-7xl">
                  Build Every Career Document in One Structured System.
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-white/78 max-w-3xl mx-auto">
                  Create resumes with guided workflows and prepare for upcoming tools like cover letters and CVs — all designed to move you from draft to interview faster.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
                  <Link href="/builder">
                    <Button size="lg" className="h-12 bg-[#f97316] px-8 text-white hover:bg-[#ea580c]">
                      Start Building
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button size="lg" variant="outline" className="h-12 border-white/30 bg-white/10 px-8 text-white hover:bg-white/15">
                      See How It Works
                    </Button>
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/80">
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#10b981]" />
                    Resume Builder (Live)
                  </span>
                  <span className="inline-flex items-center gap-2 text-white/50">
                    <Clock className="h-4 w-4" />
                    Cover Letters (Coming Soon)
                  </span>
                  <span className="inline-flex items-center gap-2 text-white/50">
                    <Clock className="h-4 w-4" />
                    CV Builder (Coming Soon)
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PLATFORM OVERVIEW */}
        <section className="border-b border-white/10 py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Reveal reduced={reduced}>
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 relative overflow-hidden">
                  <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                    LIVE
                  </div>
                  <FileText className="h-10 w-10 text-emerald-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Resume Builder</h3>
                  <p className="text-sm text-white/75 leading-relaxed mb-6">
                    Structured multi-step builder with AI assistance and real-time preview.
                  </p>
                  <Link href="/builder">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      Start Resume
                    </Button>
                  </Link>
                </div>
              </Reveal>

              <Reveal reduced={reduced} delay={0.1}>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 relative">
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/10 text-white/60 text-xs font-semibold rounded-full">
                    SOON
                  </div>
                  <Mail className="h-10 w-10 text-white/40 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Cover Letter Builder</h3>
                  <p className="text-sm text-white/75 leading-relaxed mb-6">
                    Professionally structured letters tailored to roles and industries.
                  </p>
                  <Link href="/coming-soon">
                    <Button className="w-full bg-white/10 text-white/50 cursor-not-allowed" disabled>
                      Coming Soon
                    </Button>
                  </Link>
                </div>
              </Reveal>

              <Reveal reduced={reduced} delay={0.2}>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 relative">
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/10 text-white/60 text-xs font-semibold rounded-full">
                    SOON
                  </div>
                  <GraduationCap className="h-10 w-10 text-white/40 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">CV Builder</h3>
                  <p className="text-sm text-white/75 leading-relaxed mb-6">
                    Multi-page academic and international CV formats.
                  </p>
                  <Link href="/coming-soon">
                    <Button className="w-full bg-white/10 text-white/50 cursor-not-allowed" disabled>
                      Coming Soon
                    </Button>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* WHY ElevateCV WORKS */}
        <section className="border-b border-white/10 py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <Reveal reduced={reduced} className="mb-12 max-w-2xl">
              <h2 className="text-4xl font-semibold leading-tight text-white lg:text-5xl">
                Why ElevateCV Works
              </h2>
              <p className="mt-4 text-lg text-white/75">
                Everything here is built to help you get noticed faster.
              </p>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-2">
              <FeatureCard 
                icon={<Sparkles className="h-6 w-6" />}
                title="ATS-safe document structure" 
                desc="Every template passes Applicant Tracking Systems used by top companies."
              />
              <FeatureCard 
                icon={<Zap className="h-6 w-6" />}
                title="Guided content prompts" 
                desc="AI-powered suggestions that improve weak sections and highlight achievements."
              />
              <FeatureCard 
                icon={<FileText className="h-6 w-6" />}
                title="High-clarity templates" 
                desc="Polished layouts optimized for recruiter scanning and readability."
              />
              <FeatureCard 
                icon={<Check className="h-6 w-6" />}
                title="Live preview before export" 
                desc="See exactly how your document looks as you build it in real-time."
              />
            </div>
          </div>
        </section>

        {/* BUILT FOR GROWTH */}
        <section className="border-b border-white/10 py-20 bg-[#0d1426]">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <Reveal reduced={reduced} className="mb-12 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-semibold leading-tight text-white lg:text-5xl">
                Designed to Scale With Your Career
              </h2>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              <GrowthCard 
                icon={<Check className="h-5 w-5 text-emerald-400" />}
                text="Resume builder live and production-ready"
              />
              <GrowthCard 
                icon={<Shield className="h-5 w-5 text-blue-400" />}
                text="Subscription-backed document access"
              />
              <GrowthCard 
                icon={<Sparkles className="h-5 w-5 text-purple-400" />}
                text="AI-assisted content improvement"
              />
              <GrowthCard 
                icon={<Clock className="h-5 w-5 text-orange-400" />}
                text="Upcoming document types expanding soon"
              />
            </div>
          </div>
        </section>

        {/* TRUST METRICS */}
        <SectionReveal reduced={reduced} className="border-b border-white/10 bg-[#0d1426] py-14">
          <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 md:grid-cols-3 lg:px-8">
            <StatCard value="10,000+" label="Resumes built" />
            <StatCard value="95%" label="ATS readability success" />
            <StatCard value="4.8/5" label="Average user rating" />
          </div>
        </SectionReveal>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="border-b border-white/10 py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <Reveal reduced={reduced} className="mb-10 max-w-2xl">
              <h2 className="text-4xl font-semibold leading-tight text-white lg:text-5xl">
                From blank page to ready-to-apply in one smooth flow.
              </h2>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-3">
              <StepCard 
                number="01"
                title="Choose Your Path"
                desc="Start with our live Resume Builder. More document types launching soon."
              />
              <StepCard 
                number="02"
                title="Build With Guidance"
                desc="Follow structured prompts that help you write stronger, clearer content."
              />
              <StepCard 
                number="03"
                title="Export & Apply"
                desc="Download your polished document and start applying with confidence."
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <SectionReveal reduced={reduced} className="pb-20 pt-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="rounded-3xl border border-[#fb923c]/40 bg-gradient-to-br from-[#f97316] to-[#c2410c] p-10 text-white shadow-[0_25px_75px_rgba(0,0,0,0.35)] lg:p-14 text-center">
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">
                Start With Your Resume. Grow With The Platform.
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-white/90">
                More career tools launching soon.
              </p>
              <div className="mt-8">
                <Link href="/builder">
                  <Button className="h-12 bg-[#0a0f1c] px-8 text-white hover:bg-black">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SectionReveal>
      </main>

      <footer className="border-t border-white/10 bg-[#0a0f1c]">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-4 px-6 py-10 text-sm text-white/60 md:flex-row md:items-center lg:px-8">
          <p className="font-medium text-white/85">{PLATFORM_NAME}</p>
          <p>&copy; {currentYear} {PLATFORM_NAME}, C-Tech Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
  reduced,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  reduced: boolean;
}) {
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.52, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionReveal({
  children,
  className,
  reduced,
}: {
  children: ReactNode;
  className?: string;
  reduced: boolean;
}) {
  if (reduced) return <section className={className}>{children}</section>;
  return (
    <motion.section
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
      <p className="text-4xl font-semibold text-[#fb923c]">{value}</p>
      <p className="mt-1 text-sm text-white/75">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-[#f97316]/20 rounded-lg flex items-center justify-center text-[#fb923c]">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm leading-relaxed text-white/75">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function GrowthCard({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4">
      <div className="flex items-start gap-3">
        {icon}
        <p className="text-sm text-white/85">{text}</p>
      </div>
    </div>
  );
}

function StepCard({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
      <div className="text-5xl font-bold text-[#fb923c]/30 mb-4">{number}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-sm text-white/75 leading-relaxed">{desc}</p>
    </div>
  );
}
