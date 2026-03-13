"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, ChevronDown, ShieldCheck, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { templates as allTemplates, type TemplateVariant } from "@/lib/templates";
import { useAuthUser } from "@/hooks/use-auth-user";
import { AuthActions } from "@/components/auth-actions";

const PLATFORM_NAME = "ElevateCV";
const currentYear = new Date().getFullYear();
const templatesPerPage = 4;
const pricing = [
  {
    tier: "Free Plan",
    price: "Free",
    description: "Access our basic features. Start building your professional resume and cover letter today.",
    features: [
      "Resume & Cover Letter Builder",
      "Expert-Written Content Suggestions",
      "Unlimited Downloads in TXT Format",
      "ElevateCV Pro professional tools",
    ],
    cta: "Get Started",
  },
  {
    tier: "14-Day Premium Access",
    badge: "Most Popular",
    price: "GHS 35",
    note: "After 14 days, auto-renews at GHS 360 billed every 4 weeks. Cancel anytime.",
    features: [
      "Resume & Cover Letter Builder",
      "Expert-Written Content Suggestions",
      "Unlimited Downloads in TXT Format",
      "Professionally Designed Templates",
      "Unlimited PDF & Word Downloads",
      "ResumeCheck™ Feedback",
      "ElevateCV Pro Online Professional Profile",
      "Interview Preparation Tools",
      "Career Development Webinars",
    ],
    cta: "Upgrade Now",
  },
  {
    tier: "1-Year Premium Access",
    badge: "Best Value (69% Savings)",
    price: "GHS 120/month",
    note: "Pay GHS 1,440 up front and save 69%. Automatically renews each year. Cancel anytime.",
    features: [
      "Resume & Cover Letter Builder",
      "Expert-Written Content Suggestions",
      "Unlimited Downloads in TXT Format",
      "Professionally Designed Templates",
      "Unlimited PDF & Word Downloads",
      "ResumeCheck™ Feedback",
      "ElevateCV Pro Online Professional Profile",
      "Interview Preparation Tools",
      "Career Development Webinars",
    ],
    cta: "Get Annual Access",
  },
];

const features = [
  "ATS-safe document structure",
  "Guided content prompts that improve weak sections",
  "High-clarity templates for recruiter scanning",
  "Live preview before final export",
];

const testimonials = [
  {
    name: "Ama Boateng",
    role: "Operations Analyst",
    quote: "I moved from no interviews to multiple calls in two weeks after restructuring my resume here.",
  },
  {
    name: "Kojo Mensah",
    role: "Graduate Engineer",
    quote: "The writing prompts made my experience sound sharp and credible without fluff.",
  },
  {
    name: "Esi Addo",
    role: "Admin Professional",
    quote: "I liked how fast I could produce something that looked genuinely professional.",
  },
];

const faqs = [
  {
    q: "Will this still work for ATS systems?",
    a: "Yes. The builder uses a clean hierarchy and structure designed for common ATS parsing behavior.",
  },
  {
    q: "Can I use it even if I do not have strong experience yet?",
    a: "Yes. The guided prompts help you position projects, internships, and transferable outcomes clearly.",
  },
  {
    q: "How long does it take to create a strong first draft?",
    a: "Most users produce a first usable draft in around five minutes, then refine from there.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const variantLabels: Record<TemplateVariant, string> = {
  legacy: "Legacy Pro",
  classic: "Classic",
  sidebar: "Sidebar",
  minimal: "Minimal",
  executive: "Executive",
};

function getTemplateSections(variant: TemplateVariant) {
  if (variant === "legacy") {
    return ["Professional Summary", "Experience", "Skills", "Education"];
  }
  if (variant === "minimal") {
    return ["Summary", "Skills", "Education", "Experience"];
  }
  if (variant === "sidebar") {
    return ["Summary", "Experience", "Skills", "Education"];
  }
  if (variant === "executive") {
    return ["Executive Profile", "Experience", "Core Skills", "Education"];
  }
  return ["Name", "Professional Summary", "Work Experience", "Education"];
}

function LandingTemplatePreview({
  variant,
  columns,
  headshot,
  accent,
}: {
  variant: TemplateVariant;
  columns: 1 | 2;
  headshot: boolean;
  accent: string;
}) {
  const dot = <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />;
  const line = "h-1.5 rounded bg-[#111827]/12";
  const tiny = "text-[8px] font-medium leading-none text-[#111827]/65";
  const name = "Akua Mensah";
  const role = "Marketing Associate";

  return (
    <div className="relative h-48 overflow-hidden rounded-xl border border-[#111827]/10 bg-white p-3 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      {variant === "sidebar" && (
        <div className="relative grid h-full grid-cols-[0.36fr_0.64fr] gap-2 text-[9px]">
          <div className="rounded-md bg-[#f3f4f6] p-2">
            <div className="mb-2 h-7 w-7 rounded-full border border-[#111827]/15 bg-white" />
            <p className={`${tiny} mb-1`}>{name}</p>
            <p className={`${tiny} mb-2`}>{role}</p>
            <div className={`${line} mb-1 w-10/12`} />
            <div className={`${line} mb-2 w-8/12`} />
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">{dot}<div className={`${line} w-8/12`} /></div>
              <div className="flex items-center gap-1">{dot}<div className={`${line} w-7/12`} /></div>
              <div className="flex items-center gap-1">{dot}<div className={`${line} w-9/12`} /></div>
            </div>
          </div>
          <div className="space-y-2 p-1">
            <p className={`${tiny} font-semibold uppercase`} style={{ color: accent }}>Professional Summary</p>
            <div className="h-1.5 w-6/12 rounded" style={{ backgroundColor: `${accent}66` }} />
            <div className={`${line} w-full`} />
            <div className={`${line} w-10/12`} />
            <div className="pt-1">
              <p className={`${tiny} mb-1 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
              <div className="mb-1 h-1.5 w-7/12 rounded" style={{ backgroundColor: `${accent}66` }} />
              <div className={`${line} mb-1 w-full`} />
              <div className={`${line} mb-1 w-11/12`} />
              <div className={`${line} w-10/12`} />
            </div>
          </div>
        </div>
      )}

      {variant === "minimal" && (
        <div className="relative h-full space-y-3 p-1 text-[9px]">
          <p className={`${tiny} font-semibold`}>{name}</p>
          <p className={tiny}>{role}</p>
          <div className="h-2.5 w-7/12 rounded bg-[#111827]/18" />
          <div className={`${line} w-11/12`} />
          <div className={`${line} w-10/12`} />
          <div className="pt-1">
            <p className={`${tiny} mb-1 font-semibold uppercase`} style={{ color: accent }}>Summary</p>
            <div className="mb-1 h-1.5 w-4/12 rounded" style={{ backgroundColor: `${accent}66` }} />
            <div className={`${line} mb-1 w-full`} />
            <div className={`${line} w-9/12`} />
          </div>
          <div className="pt-1">
            <p className={`${tiny} mb-1 font-semibold uppercase`} style={{ color: accent }}>Skills</p>
            <div className="mb-1 h-1.5 w-5/12 rounded" style={{ backgroundColor: `${accent}66` }} />
            <div className="flex flex-wrap gap-1">
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">SEO</span>
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Canva</span>
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Excel</span>
            </div>
          </div>
        </div>
      )}

      {variant === "executive" && (
        <div className="relative h-full space-y-2 text-[9px]">
          <div className="h-2 rounded" style={{ backgroundColor: `${accent}88` }} />
          <div className="flex items-start justify-between pt-1">
            <div className="space-y-1">
              <p className={`${tiny} font-semibold`}>{name}</p>
              <p className={tiny}>Head of Operations</p>
              <div className="h-2.5 w-28 rounded bg-[#111827]/18" />
              <div className={`${line} w-20`} />
            </div>
            {headshot && <div className="h-8 w-8 rounded-full border border-[#111827]/15 bg-[#f3f4f6]" />}
          </div>
          <div className="rounded border border-[#111827]/10 bg-[#f9fafb] p-2">
            <p className={`${tiny} mb-1 font-semibold uppercase`} style={{ color: accent }}>Executive Profile</p>
            <div className="mb-1 h-1.5 w-4/12 rounded" style={{ backgroundColor: `${accent}66` }} />
            <div className={`${line} mb-1 w-full`} />
            <div className={`${line} w-10/12`} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <p className={`${tiny} font-semibold uppercase`} style={{ color: accent }}>Experience</p>
              <div className="h-1.5 w-6/12 rounded" style={{ backgroundColor: `${accent}66` }} />
              <div className={`${line} w-full`} />
            </div>
            <div className="space-y-1">
              <p className={`${tiny} font-semibold uppercase`} style={{ color: accent }}>Core Skills</p>
              <div className="h-1.5 w-6/12 rounded" style={{ backgroundColor: `${accent}66` }} />
              <div className={`${line} w-10/12`} />
            </div>
          </div>
        </div>
      )}

      {variant === "classic" && (
        <div className="relative h-full space-y-2 text-[9px]">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className={`${tiny} font-semibold`}>{name}</p>
              <p className={tiny}>{role}</p>
              <div className="h-2.5 w-28 rounded bg-[#111827]/18" />
              <div className={`${line} w-20`} />
            </div>
            {headshot && <div className="h-8 w-8 rounded-full border border-[#111827]/15 bg-[#f3f4f6]" />}
          </div>
          <div className="h-[1px] w-full" style={{ backgroundColor: `${accent}99` }} />
          <div className={columns === 2 ? "grid grid-cols-[0.62fr_0.38fr] gap-2" : "space-y-2"}>
            <div className="space-y-2">
              <div>
                <p className={`${tiny} mb-1 font-semibold uppercase`} style={{ color: accent }}>Professional Summary</p>
                <div className="mb-1 h-1.5 w-5/12 rounded" style={{ backgroundColor: `${accent}66` }} />
                <div className={`${line} mb-1 w-full`} />
                <div className={`${line} w-10/12`} />
              </div>
              <div>
                <p className={`${tiny} mb-1 font-semibold uppercase`} style={{ color: accent }}>Work Experience</p>
                <div className="mb-1 h-1.5 w-5/12 rounded" style={{ backgroundColor: `${accent}66` }} />
                <div className={`${line} mb-1 w-full`} />
                <div className={`${line} w-11/12`} />
              </div>
            </div>
            {columns === 2 && (
              <div className="space-y-2">
                <p className={`${tiny} font-semibold uppercase`} style={{ color: accent }}>Skills</p>
                <div className="h-1.5 w-7/12 rounded" style={{ backgroundColor: `${accent}66` }} />
                <div className="flex flex-wrap gap-1">
                  <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Leadership</span>
                  <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Planning</span>
                  <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Excel</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {variant === "legacy" && (
        <div className="relative h-full space-y-2 text-[9px]">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className={`${tiny} font-semibold`}>{name}</p>
              <p className={tiny}>Business Operations Specialist</p>
            </div>
            {headshot && <div className="h-8 w-8 rounded-full border border-[#111827]/15 bg-[#f3f4f6]" />}
          </div>
          <div className="h-[1px] w-full" style={{ backgroundColor: `${accent}99` }} />
          <div className="grid grid-cols-[0.62fr_0.38fr] gap-2">
            <div className="space-y-1">
              <p className={`${tiny} font-semibold uppercase`} style={{ color: accent }}>Professional Summary</p>
              <div className={`${line} w-full`} />
              <div className={`${line} w-10/12`} />
              <p className={`${tiny} pt-1 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
              <div className={`${line} w-full`} />
              <div className={`${line} w-11/12`} />
            </div>
            <div className="space-y-1">
              <p className={`${tiny} font-semibold uppercase`} style={{ color: accent }}>Skills</p>
              <div className="flex flex-wrap gap-1">
                <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Ops</span>
                <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Planning</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openMenu, setOpenMenu] = useState<"cv" | "cover" | null>(null);
  const [templatePage, setTemplatePage] = useState(0);
  const reduced = useReducedMotion();
  const navRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroGlowY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const gridGlowY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const { user, loading: authLoading } = useAuthUser();
  const tier = (user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const totalTemplatePages = Math.max(1, Math.ceil(allTemplates.length / templatesPerPage));
  const visibleTemplates = allTemplates.slice(
    templatePage * templatesPerPage,
    templatePage * templatesPerPage + templatesPerPage
  );


  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.scrollBehavior;
    const prevBody = body.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    body.style.scrollBehavior = "smooth";

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    const onClickOutside = (event: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", onEscape);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      html.style.scrollBehavior = prevHtml;
      body.style.scrollBehavior = prevBody;
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#e8edf8]">
      <motion.div
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#f59e0b]"
        style={{ scaleX: scrollYProgress }}
      />
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.35),rgba(15,23,42,0)_70%)] blur-3xl"
          style={{ y: heroGlowY }}
        />
        <motion.div
          className="absolute bottom-[-120px] right-[-120px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.25),rgba(15,23,42,0)_70%)] blur-3xl"
          style={{ y: gridGlowY }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.08),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(249,115,22,0.08),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.08),transparent_45%)]" />
      </div>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0f1c]/80 backdrop-blur-xl">
        <div ref={navRef} className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1c]">
            <span className="text-white">Elevate</span>
            <span className="text-[#fb923c]">CV</span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((prev) => (prev === "cv" ? null : "cv"))}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                aria-expanded={openMenu === "cv"}
                aria-haspopup="true"
              >
                CV
                <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === "cv" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {openMenu === "cv" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-[320px] rounded-2xl border border-white/15 bg-[#0c1324] p-4 text-sm text-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <Link
                          href="/cv-templates"
                          onClick={() => setOpenMenu(null)}
                          className="block text-left text-sm font-medium text-white/85 hover:text-white"
                        >
                          CV Templates
                        </Link>
                        <Link
                          href="/cv-examples"
                          onClick={() => setOpenMenu(null)}
                          className="block text-left text-sm font-medium text-white/85 hover:text-white"
                        >
                          CV Examples
                        </Link>
                      </div>
                      <Link href="/cv/start">
                        <Button className="h-10 bg-[#f97316] px-4 text-white hover:bg-[#ea580c]">
                          Build My CV
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((prev) => (prev === "cover" ? null : "cover"))}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                aria-expanded={openMenu === "cover"}
                aria-haspopup="true"
              >
                Cover Letter
                <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === "cover" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {openMenu === "cover" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-[360px] rounded-2xl border border-white/15 bg-[#0c1324] p-4 text-sm text-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <Link
                          href="/cover-letter-examples"
                          onClick={() => setOpenMenu(null)}
                          className="block text-left text-sm font-medium text-white/85 hover:text-white"
                        >
                          Cover Letter Examples
                        </Link>
                        <Link
                          href="/cover-letter-format"
                          onClick={() => setOpenMenu(null)}
                          className="block text-left text-sm font-medium text-white/85 hover:text-white"
                        >
                          Cover Letter Format
                        </Link>
                      </div>
                      <Link href="/cover-letter/builder">
                        <Button className="h-10 bg-[#f97316] px-4 text-white hover:bg-[#ea580c]">
                          Build My Cover Letter
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AuthActions userEmail={user?.email} loading={authLoading} tier={tier} />
          </div>
        </div>
      </nav>

      <motion.main
        className="relative z-10 pt-16"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(249,115,22,0.28),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.22),transparent_42%)]" />
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
            <Reveal reduced={reduced}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                <Zap className="h-3.5 w-3.5 text-[#fb923c]" />
                Career documents, done right
              </span>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-white lg:text-7xl">
                Build your next resume with clarity and confidence.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/78">
                ElevateCV helps Ghanaian professionals create polished, recruiter-ready resumes without the usual formatting stress.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/start">
                  <Button size="lg" className="h-12 bg-[#f97316] px-8 text-white hover:bg-[#ea580c]">
                    Start New Resume
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/start">
                  <Button size="lg" variant="outline" className="h-12 border-white/30 bg-white/10 px-8 text-white hover:bg-white/15">
                    Import Existing Resume
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-white/80">
                {["Fast first draft", "ATS-ready structure", "Premium document quality"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#fb923c]" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-10 rounded-2xl border border-white/15 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Build in 4 easy steps</p>
                <div className="mt-4 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
                  {[
                    "Pick a clean template",
                    "Fill guided prompts",
                    "Review and refine",
                    "Export and apply",
                  ].map((step) => (
                    <div key={step} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      <Check className="h-4 w-4 text-[#fb923c]" />
                      {step}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/start">
                    <Button className="h-11 bg-[#f97316] px-6 text-white hover:bg-[#ea580c]">Start Building</Button>
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal reduced={reduced} delay={0.1}>
              <div className="rounded-3xl border border-white/15 bg-white/95 p-7 text-[#111827] shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#111827]/60">Primary product</p>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">Live</span>
                </div>
                <div className="mt-4 space-y-3">
                  {features.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-xl border border-[#111827]/10 bg-white p-3">
                      <Check className="mt-0.5 h-4 w-4 text-[#ea580c]" />
                      <p className="text-sm text-[#111827]/85">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-[#111827]/10 bg-[#fff7ed] p-4">
                  <p className="text-sm font-semibold text-[#9a3412]">Resume Builder is live now</p>
                  <p className="mt-1 text-sm text-[#111827]/80">
                    You can start immediately, complete your resume step by step, and export when ready.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <SectionReveal reduced={reduced} className="border-b border-white/10 bg-[#0d1426] py-14" id="product">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              <StatusCard title="Resume Builder" status="Live" desc="Production-ready workflow available now at /builder." />
              <StatusCard title="CV Builder" status="Planned Expansion" desc="Part of the next platform phase for broader career-document support." />
              <StatusCard title="Cover Letters" status="Planned Expansion" desc="Designed to align with the same structured writing experience." />
            </div>
          </div>
        </SectionReveal>

        <section id="templates" className="border-b border-white/10 py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Templates for Ghana</p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight text-white lg:text-5xl">
                  Templates tailored to Ghanaian hiring expectations.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/72">
                  Choose a layout that fits your industry, role level, and recruiter preference.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTemplatePage((prev) => Math.max(0, prev - 1))}
                  disabled={templatePage === 0}
                  className="h-10 w-10 rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous templates"
                >
                  <ChevronDown className="mx-auto h-4 w-4 rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => setTemplatePage((prev) => (prev + 1) % totalTemplatePages)}
                  className="h-10 w-10 rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white"
                  aria-label="Next templates"
                >
                  <ChevronDown className="mx-auto h-4 w-4 -rotate-90" />
                </button>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {visibleTemplates.map((template, index) => {
                const accent = ["#f97316", "#1e3a8a", "#059669", "#7c3aed", "#0f766e", "#b45309"][index % 6];
                const sections = getTemplateSections(template.variant);
                return (
                  <div key={template.id} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                    <LandingTemplatePreview
                      variant={template.variant}
                      columns={template.columns}
                      headshot={template.headshot}
                      accent={accent}
                    />
                    <div className="mt-4">
                      <div className="mb-2">
                        <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                          {variantLabels[template.variant]} style
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-white">{template.name}</p>
                      <p className="mt-1 text-sm text-white/70">{template.focus}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {sections.map((section) => (
                          <span key={section} className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/55">
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-b border-white/10 py-20 bg-[#0d1426]">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <Reveal reduced={reduced} className="mb-12 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Pricing</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-white lg:text-5xl">
                Need to level up your career even faster?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/72">
                Upgrade to access ElevateCV’s premium features and supercharge your job search.
              </p>
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-3">
              {pricing.map((plan) => (
                <div
                  key={plan.tier}
                  className={`relative rounded-3xl border ${plan.badge ? "border-[#fb923c]/60 bg-[#111827]" : "border-white/15 bg-white/5"} p-6`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-6 rounded-full bg-[#fb923c] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#111827]">
                      {plan.badge}
                    </span>
                  )}
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">{plan.tier}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{plan.price}</p>
                  <p className="mt-3 text-sm text-white/70">{plan.description}</p>
                  {plan.note && <p className="mt-3 text-xs text-white/50">{plan.note}</p>}
                  <ul className="mt-6 space-y-2 text-sm text-white/75">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-[#fb923c]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button className={`h-11 w-full ${plan.badge ? "bg-[#f97316] text-white hover:bg-[#ea580c]" : "bg-white/10 text-white hover:bg-white/15"}`}>
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="vision" className="border-b border-white/10 py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <Reveal reduced={reduced} className="mb-12 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Platform vision</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-white lg:text-5xl">
                ElevateCV is growing into a complete career document system.
              </h2>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-2">
              <OfferCard title="Resume Builder (Live)" desc="Today, you can build and refine a high-quality resume with guided prompts and live preview." />
              <OfferCard title="CV Builder (Planned Expansion)" desc="Next, we are extending the same quality system to full CV workflows." />
              <OfferCard title="Cover Letter Builder (Planned Expansion)" desc="We are also expanding into structured, role-aligned cover letter creation." />
              <OfferCard title="One Coherent Workflow" desc="The goal is a unified experience for all core career documents, not disconnected tools." />
            </div>
          </div>
        </section>

        <section id="path" className="border-b border-white/10 py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <Reveal reduced={reduced} className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Your build journey</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-white lg:text-5xl">
                From blank page to ready-to-apply in one smooth flow.
              </h2>
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <Reveal reduced={reduced}>
                <div className="rounded-3xl border border-white/20 bg-white/95 p-7 text-[#111827] shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a3412]">What happens next</p>
                  <p className="mt-3 text-4xl font-semibold">Build with clarity, not guesswork.</p>
                  <p className="mt-1 text-sm text-[#111827]/65">Each step helps you shape a stronger resume quickly, so you can focus on applications with confidence.</p>
                  <ul className="mt-6 space-y-3 text-sm text-[#111827]/85">
                    {[
                      "Simple, guided sections from start to finish",
                      "Smart prompts that improve weak wording",
                      "Live preview so you can see progress instantly",
                      "A polished result that feels truly professional",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#ea580c]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href="/start">
                      <Button className="h-12 w-full bg-[#f97316] text-white hover:bg-[#ea580c]">
                        Start Building
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <p className="mt-3 text-xs text-[#111827]/60">Start in minutes and keep refining until your resume feels right.</p>
                </div>
              </Reveal>

              <Reveal reduced={reduced} delay={0.08}>
                <div className="rounded-3xl border border-white/15 bg-[#101a30] p-7">
                  <h3 className="text-2xl font-semibold text-white">Why people stay with it</h3>
                  <div className="mt-5 space-y-4">
                    <ConversionPoint title="Clear direction" desc="You always know what to do next, without feeling overwhelmed." />
                    <ConversionPoint title="Visible progress" desc="You can see your resume improve section by section in real time." />
                    <ConversionPoint title="Confident writing" desc="Prompts help you express your strengths in sharper, cleaner language." />
                    <ConversionPoint title="Professional finish" desc="The final document looks recruiter-ready, modern, and intentional." />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="testimonials" className="border-b border-white/10 py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <Reveal reduced={reduced} className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Testimonials</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-white lg:text-5xl">
                Real users describe the experience as fast, clear, and genuinely professional.
              </h2>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((item, index) => (
                <Reveal key={item.name} reduced={reduced} delay={index * 0.05}>
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                    <div className="mb-3 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-[#fb923c] text-[#fb923c]" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-white/85">{item.quote}</p>
                    <p className="mt-4 text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-white/60">{item.role}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
              <Reveal reduced={reduced}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Objection handling</p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight text-white lg:text-5xl">
                  Questions before you start?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/72">
                  Quick answers to the concerns people usually have before building their first version.
                </p>
                <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-[#fb923c]" />
                    <div>
                      <p className="text-sm font-semibold text-white">Confidence signal</p>
                      <p className="mt-1 text-sm text-white/70">
                        You are guided forward clearly without pressure-heavy tactics.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal reduced={reduced} delay={0.08}>
                <div className="rounded-3xl border border-white/15 bg-white/95 p-6 text-[#111827]">
                  {faqs.map((item, idx) => {
                    const open = openFaq === idx;
                    return (
                      <div key={item.q} className={`border-b border-[#111827]/10 ${idx === faqs.length - 1 ? "border-b-0" : ""}`}>
                        <button
                          type="button"
                          onClick={() => setOpenFaq(open ? null : idx)}
                          className="flex w-full items-center justify-between gap-4 py-4 text-left"
                          aria-expanded={open}
                        >
                          <span className="text-sm font-semibold text-[#111827]">{item.q}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="pb-4 text-sm leading-relaxed text-[#111827]/75">{item.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <SectionReveal reduced={reduced} className="pb-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="rounded-3xl border border-[#fb923c]/40 bg-gradient-to-br from-[#f97316] to-[#c2410c] p-10 text-white shadow-[0_25px_75px_rgba(0,0,0,0.35)] lg:p-14">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">Final call</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight lg:text-5xl">
                Create a polished resume in minutes and apply with confidence.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90">
                Built to feel premium, move fast, and keep users committed from first click to final export.
              </p>
              <div className="mt-8">
                <Link href="/start">
                  <Button className="h-12 bg-[#0a0f1c] px-8 text-white hover:bg-black">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SectionReveal>
      </motion.main>

      <SiteFooter />
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
  id,
}: {
  children: ReactNode;
  className?: string;
  reduced: boolean;
  id?: string;
}) {
  if (reduced) return <section id={id} className={className}>{children}</section>;
  return (
    <motion.section
      id={id}
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

function StatusCard({ title, status, desc }: { title: string; status: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#fb923c]">
        {status}
      </p>
      <p className="mt-3 text-sm text-white/75">{desc}</p>
    </div>
  );
}

function OfferCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/75">{desc}</p>
    </div>
  );
}

function ConversionPoint({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-white/70">{desc}</p>
    </div>
  );
}
