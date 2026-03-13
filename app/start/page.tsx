"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { useAuthUser } from "@/hooks/use-auth-user";
import { AuthActions } from "@/components/auth-actions";
import {
  templates,
  templateColorOptions,
  type ExperienceLevel,
  type TemplateMeta,
  type TemplateVariant,
} from "@/lib/templates";

type StudentStatus = "student" | "not_student" | null;
type EducationLevel =
  | "hs"
  | "technical"
  | "courses"
  | "certs"
  | "associate"
  | "bachelors"
  | "masters"
  | "doctoral"
  | "prefer_not";

const currentYear = new Date().getFullYear();

const experienceOptions: { id: ExperienceLevel; label: string }[] = [
  { id: "none", label: "No Experience" },
  { id: "lt3", label: "Less than 3 years" },
  { id: "3-5", label: "3-5 Years" },
  { id: "5-10", label: "5-10 Years" },
  { id: "10+", label: "10+ Years" },
];

const educationOptions: { id: EducationLevel; label: string }[] = [
  { id: "hs", label: "Post-Secondary Certificate or High School diploma" },
  { id: "technical", label: "Technical or Vocational" },
  { id: "courses", label: "Related Courses" },
  { id: "certs", label: "Certificates or diplomas" },
  { id: "associate", label: "Associates" },
  { id: "bachelors", label: "Bachelors" },
  { id: "masters", label: "Masters or Specialized" },
  { id: "doctoral", label: "Doctoral or J.D." },
  { id: "prefer_not", label: "Prefer not to answer." },
];

const variantPreferenceByExperience: Record<ExperienceLevel, TemplateVariant[]> = {
  none: ["minimal", "classic", "sidebar", "executive"],
  lt3: ["minimal", "classic", "sidebar", "executive"],
  "3-5": ["classic", "sidebar", "minimal", "executive"],
  "5-10": ["executive", "sidebar", "classic", "minimal"],
  "10+": ["executive", "sidebar", "classic", "minimal"],
};

const studentPreference: TemplateVariant[] = ["minimal", "classic", "sidebar", "executive"];

const variantLabels: Record<TemplateVariant, string> = {
  legacy: "Legacy Pro",
  classic: "Classic",
  sidebar: "Sidebar",
  minimal: "Minimal",
  executive: "Executive",
};

function TemplateMiniPreview({
  variant,
  columns,
  headshot,
  accent,
  richText = false,
  heightClass = "h-40",
}: {
  variant: TemplateVariant;
  columns: 1 | 2;
  headshot: boolean;
  accent: string;
  richText?: boolean;
  heightClass?: string;
}) {
  const textCls = "text-[8px] leading-none text-[#111827]/70";

  if (variant === "sidebar") {
    return (
      <div className={`${heightClass} rounded-xl border border-[#111827]/10 bg-white p-2.5`}>
        <div className="grid h-full grid-cols-[0.37fr_0.63fr] gap-2">
          <div className="rounded-md bg-[#f3f4f6] p-2">
            <div className="h-6 w-6 rounded-full border border-[#111827]/15 bg-white" />
            {richText && (
              <>
                <p className={`${textCls} mt-1 font-semibold`}>Akua Mensah</p>
                <p className={textCls}>Student Nurse</p>
              </>
            )}
            <div className="mt-2 h-1.5 w-10/12 rounded bg-[#111827]/15" />
            <div className="mt-1 h-1.5 w-8/12 rounded bg-[#111827]/15" />
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-9/12 rounded" style={{ backgroundColor: `${accent}66` }} />
              <div className="h-1.5 w-8/12 rounded bg-[#111827]/12" />
            </div>
          </div>
          <div className="space-y-2 p-1">
            {richText && <p className={`${textCls} font-semibold uppercase`} style={{ color: accent }}>Professional Summary</p>}
            <div className="h-1.5 w-7/12 rounded" style={{ backgroundColor: `${accent}66` }} />
            {richText ? (
              <>
                <p className={textCls}>Organized student with strong patient care exposure and clinical rotation discipline.</p>
                <p className={`${textCls} pt-1 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
                <p className={textCls}>Care Assistant - Sunrise Clinic (2024-Present)</p>
                <p className={textCls}>Volunteer - Regional Health Outreach (2023-2024)</p>
              </>
            ) : (
              <>
                <div className="h-1.5 w-full rounded bg-[#111827]/12" />
                <div className="h-1.5 w-11/12 rounded bg-[#111827]/12" />
                <div className="h-1.5 w-10/12 rounded bg-[#111827]/12" />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`${heightClass} rounded-xl border border-[#111827]/10 bg-white p-3`}>
        <p className="text-[9px] font-semibold text-[#111827]">Kojo Asante</p>
        <p className="text-[8px] text-[#111827]/70">Junior Data Analyst</p>
        <div className="mt-2 h-1.5 w-8/12 rounded" style={{ backgroundColor: `${accent}66` }} />
        {richText ? (
          <>
            <p className={`${textCls} mt-1 font-semibold uppercase`} style={{ color: accent }}>Summary</p>
            <p className={textCls}>Detail-oriented analyst using Excel and SQL to improve reporting speed and data quality.</p>
            <p className={`${textCls} mt-2 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
            <p className={textCls}>Data Intern - Accra Finance Hub (2024-2025)</p>
            <p className={textCls}>Research Assistant - KNUST Lab (2023-2024)</p>
          </>
        ) : (
          <>
            <div className="mt-2 h-1.5 w-11/12 rounded bg-[#111827]/12" />
            <div className="mt-1 h-1.5 w-10/12 rounded bg-[#111827]/12" />
            <div className="mt-2 flex gap-1">
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px]">Excel</span>
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px]">SQL</span>
            </div>
          </>
        )}
      </div>
    );
  }

  if (variant === "executive") {
    return (
      <div className={`${heightClass} rounded-xl border border-[#111827]/10 bg-white p-3`}>
        <div className="h-1.5 w-full rounded" style={{ backgroundColor: `${accent}88` }} />
        <div className="mt-2 flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold text-[#111827]">Esi Owusu</p>
            <p className="text-[8px] text-[#111827]/70">Operations Lead</p>
          </div>
          {headshot && <div className="h-7 w-7 rounded-full border border-[#111827]/15 bg-[#f3f4f6]" />}
        </div>
        {richText ? (
          <>
            <p className={`${textCls} mt-2 font-semibold uppercase`} style={{ color: accent }}>Executive Profile</p>
            <p className={textCls}>Scaled service operations across 3 regions and cut turnaround time by 28%.</p>
            <p className={`${textCls} mt-2 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
            <p className={textCls}>Operations Manager - MetroServe (2021-Present)</p>
          </>
        ) : (
          <>
            <div className="mt-2 h-1.5 w-11/12 rounded bg-[#111827]/12" />
            <div className="mt-1 h-1.5 w-10/12 rounded bg-[#111827]/12" />
            <div className="mt-2 h-1.5 w-8/12 rounded bg-[#111827]/12" />
          </>
        )}
      </div>
    );
  }

  if (variant === "legacy") {
    return (
      <div className={`${heightClass} rounded-xl border border-[#111827]/10 bg-white p-3`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold text-[#111827]">Yaw Dapaah</p>
            <p className="text-[8px] text-[#111827]/70">Business Operations Specialist</p>
          </div>
          {headshot && <div className="h-7 w-7 rounded-full border border-[#111827]/15 bg-[#f3f4f6]" />}
        </div>
        <div className="mt-2 h-[1px] w-full" style={{ backgroundColor: `${accent}99` }} />
        <div className="mt-2 grid grid-cols-[0.62fr_0.38fr] gap-2">
          <div>
            <p className={`${textCls} font-semibold uppercase`} style={{ color: accent }}>Professional Summary</p>
            <p className={textCls}>Process-focused operator improving service speed and consistency.</p>
            <p className={`${textCls} pt-1 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
            <p className={textCls}>Operations Officer - Coastline Hub (2022-Present)</p>
          </div>
          <div>
            <p className={`${textCls} font-semibold uppercase`} style={{ color: accent }}>Skills</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Ops</span>
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">SOP</span>
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Excel</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${heightClass} rounded-xl border border-[#111827]/10 bg-white p-3`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-semibold text-[#111827]">Ama Boateng</p>
          <p className="text-[8px] text-[#111827]/70">Customer Success Associate</p>
        </div>
        {headshot && <div className="h-7 w-7 rounded-full border border-[#111827]/15 bg-[#f3f4f6]" />}
      </div>
      <div className="mt-2 h-[1px] w-full" style={{ backgroundColor: `${accent}99` }} />
      <div className={columns === 2 ? "mt-2 grid grid-cols-[0.62fr_0.38fr] gap-2" : "mt-2 space-y-2"}>
        <div className="space-y-1">
          {richText && <p className={`${textCls} font-semibold uppercase`} style={{ color: accent }}>Professional Summary</p>}
          {richText ? (
            <p className={textCls}>Support specialist improving retention through faster issue resolution and empathy-led communication.</p>
          ) : (
            <div className="h-1.5 w-full rounded bg-[#111827]/12" />
          )}
          {richText && <p className={`${textCls} pt-1 font-semibold uppercase`} style={{ color: accent }}>Experience</p>}
          {richText ? (
            <>
              <p className={textCls}>Customer Associate - UniTel (2023-Present)</p>
              <p className={textCls}>Support Intern - Softline Ghana (2022-2023)</p>
            </>
          ) : (
            <>
              <div className="h-1.5 w-11/12 rounded bg-[#111827]/12" />
              <div className="h-1.5 w-10/12 rounded bg-[#111827]/12" />
            </>
          )}
        </div>
        {columns === 2 && (
          <div>
            <p className={`${textCls} font-semibold uppercase`} style={{ color: accent }}>Skills</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">CRM</span>
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Excel</span>
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Reports</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getRecommendedTemplates(experience: ExperienceLevel | null, studentStatus: StudentStatus) {
  const audience = studentStatus === "student" ? "student" : "professional";
  const pool = templates.filter((template) => template.audience === audience);
  const filtered = experience ? pool.filter((template) => template.exp.includes(experience)) : pool;
  const preference =
    audience === "student"
      ? studentPreference
      : variantPreferenceByExperience[experience ?? "3-5"];
  const rank = (variant: TemplateVariant) => {
    const idx = preference.indexOf(variant);
    return idx === -1 ? 999 : idx;
  };
  return filtered
    .slice()
    .sort((a, b) => rank(a.variant) - rank(b.variant))
    .slice(0, 5);
}

function getRecommendationReason(template: TemplateMeta, experience: ExperienceLevel | null, studentStatus: StudentStatus) {
  if (studentStatus === "student") {
    return `Student-focused ${variantLabels[template.variant].toLowerCase()} layout with education-forward sections.`;
  }
  if (experience === "10+" || experience === "5-10") {
    return "Built for experienced professionals with leadership detail.";
  }
  if (experience === "none" || experience === "lt3") {
    return "Entry-level friendly layout with clean structure.";
  }
  if (template.columns === 2) {
    return "Two-column layout for quick recruiter scanning.";
  }
  return "Balanced layout for mid-level roles.";
}

function trackEvent(event: string, payload?: Record<string, string>) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(`[track] ${event}`, payload ?? {});
  }
}

export default function StartPage() {
  const router = useRouter();
  const { user, loading } = useAuthUser();
  const tier = (user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const [stage, setStage] = useState<"intro" | "quiz" | "results">("intro");
  const [quizStep, setQuizStep] = useState<"experience" | "student" | "education">("experience");
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [studentStatus, setStudentStatus] = useState<StudentStatus>(null);
  const [education, setEducation] = useState<EducationLevel | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const randomPreviewIndex = useMemo(
    () => Math.floor(Math.random() * Math.max(templates.length, 1)),
    []
  );
  const [colorSelections, setColorSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries(templates.map((template) => [template.id, templateColorOptions[0].value]))
  );
  const [filterHeadshotWith, setFilterHeadshotWith] = useState(false);
  const [filterHeadshotWithout, setFilterHeadshotWithout] = useState(false);
  const [filterOneColumn, setFilterOneColumn] = useState(false);
  const [filterTwoColumn, setFilterTwoColumn] = useState(false);

  const recommendedTemplates = useMemo(
    () => getRecommendedTemplates(experience, studentStatus),
    [experience, studentStatus]
  );

  const filteredTemplateGroups = useMemo(() => {
    const applyHeadshot =
      (filterHeadshotWith && filterHeadshotWithout) || (!filterHeadshotWith && !filterHeadshotWithout);
    const applyColumns =
      (filterOneColumn && filterTwoColumn) || (!filterOneColumn && !filterTwoColumn);
    const matchesFilter = (template: TemplateMeta) => {
      const headshotMatch = applyHeadshot
        ? true
        : (filterHeadshotWith && template.headshot) || (filterHeadshotWithout && !template.headshot);
      const columnMatch = applyColumns
        ? true
        : (filterOneColumn && template.columns === 1) || (filterTwoColumn && template.columns === 2);
      return headshotMatch && columnMatch;
    };

    const recommended = recommendedTemplates.filter(matchesFilter);
    const recommendedIds = new Set(recommended.map((template) => template.id));
    const all = templates.filter((template) => !recommendedIds.has(template.id) && matchesFilter(template));

    return { recommended, all };
  }, [
    recommendedTemplates,
    filterHeadshotWith,
    filterHeadshotWithout,
    filterOneColumn,
    filterTwoColumn,
  ]);

  const handleColorSelect = (templateId: string, color: string) => {
    setColorSelections((prev) => ({ ...prev, [templateId]: color }));
  };

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const selected = templates.find((template) => template.id === templateId);
    const payload = {
      id: templateId,
      color: colorSelections[templateId],
      columns: selected?.columns ?? 1,
      headshot: selected?.headshot ?? false,
      variant: selected?.variant ?? "classic",
    };
    localStorage.setItem("elevateCvResumeTemplate", JSON.stringify(payload));
    trackEvent("template_selected", { id: templateId });
    router.push("/start/mode");
  };

  const handleExperienceSelect = (value: ExperienceLevel) => {
    setExperience(value);
    setQuizStep("student");
    trackEvent("experience_selected", { value });
    const saved = localStorage.getItem("elevateCvResumeProfile");
    const parsed = saved ? JSON.parse(saved) as { audience?: string } : {};
    localStorage.setItem("elevateCvResumeProfile", JSON.stringify({ ...parsed, experience: value }));
  };

  const handleStudentSelect = (value: StudentStatus) => {
    setStudentStatus(value);
    trackEvent("student_selected", { value: value ?? "unknown" });
    const audience = value === "student" ? "student" : "professional";
    const saved = localStorage.getItem("elevateCvResumeProfile");
    const parsed = saved ? JSON.parse(saved) as { experience?: ExperienceLevel } : {};
    localStorage.setItem("elevateCvResumeProfile", JSON.stringify({ ...parsed, audience }));
    if (value === "student") {
      setQuizStep("education");
      return;
    }
    setStage("results");
  };

  const handleEducationSelect = (value: EducationLevel) => {
    setEducation(value);
    trackEvent("education_selected", { value });
    setStage("results");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#e8edf8]">
      <header className="border-b border-white/10 bg-[#0a0f1c]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <span className="text-white">Elevate</span>
            <span className="text-[#fb923c]">CV</span>
          </Link>
          <AuthActions userEmail={user?.email} loading={loading} tier={tier} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        {stage === "intro" && (
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Start building</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white lg:text-5xl">
                It takes just 3 easy steps to create a resume you can trust.
              </h1>
              <ol className="mt-6 space-y-4 text-base text-white/80">
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-white">1</span>
                  <span>Choose the right template for your experience level.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-white">2</span>
                  <span>Fill in guided prompts to build your content.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-white">3</span>
                  <span>Preview, fine-tune, and export your final resume.</span>
                </li>
              </ol>
              <div className="mt-8">
                <Button
                  className="h-11 bg-[#f97316] px-6 text-white hover:bg-[#ea580c]"
                  onClick={() => {
                    setStage("quiz");
                    setQuizStep("experience");
                  }}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

          <div className="rounded-3xl border border-white/15 bg-white/95 p-6 text-[#111827] shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#111827]/60">Template preview</p>
              <div className="mt-6">
                <TemplateMiniPreview
                  variant={templates[randomPreviewIndex]?.variant ?? "classic"}
                  columns={templates[randomPreviewIndex]?.columns ?? 1}
                  headshot={templates[randomPreviewIndex]?.headshot ?? false}
                  accent={templateColorOptions[randomPreviewIndex % templateColorOptions.length].value}
                  richText
                  heightClass="h-56"
                />
              </div>
              <p className="mt-4 text-sm text-[#111827]/70">We will suggest templates that fit your experience.</p>
            </div>
          </div>
        )}

        {stage === "quiz" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
            <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0f172a] p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
              {quizStep === "experience" && (
                <>
                  <h2 className="text-2xl font-semibold">How long have you been working?</h2>
                  <p className="mt-2 text-sm text-white/70">
                    We&apos;ll find the best templates for your experience level.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {experienceOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleExperienceSelect(option.id)}
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-5 text-left text-sm font-semibold text-white/85 transition hover:border-[#fb923c]/70 hover:bg-white/10"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {quizStep === "student" && (
                <>
                  <h2 className="text-2xl font-semibold">Are you currently a student?</h2>
                  <p className="mt-2 text-sm text-white/70">
                    Your answer helps us match student-focused templates.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleStudentSelect("student")}
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-5 text-left text-sm font-semibold text-white/85 transition hover:border-[#fb923c]/70 hover:bg-white/10"
                    >
                      Yes, I am a student
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStudentSelect("not_student")}
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-5 text-left text-sm font-semibold text-white/85 transition hover:border-[#fb923c]/70 hover:bg-white/10"
                    >
                      No, I am not
                    </button>
                  </div>
                </>
              )}

              {quizStep === "education" && (
                <>
                  <h2 className="text-2xl font-semibold">What education level are you currently pursuing?</h2>
                  <p className="mt-2 text-sm text-white/70">
                    Select the highest level you are working toward so we can organize your resume correctly.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {educationOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleEducationSelect(option.id)}
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-left text-sm font-semibold text-white/85 transition hover:border-[#fb923c]/70 hover:bg-white/10"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {stage === "results" && (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  {studentStatus === "student" ? "Best templates for students" : "Best templates for professionals"}
                </p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight text-white lg:text-5xl">
                  You can always change your template later.
                </h2>
              </div>
              <Link href="/start/mode">
                <Button className="h-11 bg-white/10 px-6 text-white hover:bg-white/15">Choose Later</Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[260px_1fr]">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Filters</p>
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/50 hover:text-white"
                  onClick={() => {
                    setFilterHeadshotWith(false);
                    setFilterHeadshotWithout(false);
                    setFilterOneColumn(false);
                    setFilterTwoColumn(false);
                  }}
                >
                  Clear filters
                </button>

                <div className="mt-6 space-y-4 text-sm text-white/80">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Headshot</p>
                    <label className="mt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/40 bg-white/10"
                        checked={filterHeadshotWith}
                        onChange={(event) => setFilterHeadshotWith(event.target.checked)}
                      />
                      With photo
                    </label>
                    <label className="mt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/40 bg-white/10"
                        checked={filterHeadshotWithout}
                        onChange={(event) => setFilterHeadshotWithout(event.target.checked)}
                      />
                      Without photo
                    </label>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Columns</p>
                    <label className="mt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/40 bg-white/10"
                        checked={filterOneColumn}
                        onChange={(event) => setFilterOneColumn(event.target.checked)}
                      />
                      1 column
                    </label>
                    <label className="mt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/40 bg-white/10"
                        checked={filterTwoColumn}
                        onChange={(event) => setFilterTwoColumn(event.target.checked)}
                      />
                      2 columns
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <TemplateGrid
                  title="Recommended for you"
                  templates={filteredTemplateGroups.recommended}
                  selectedTemplate={selectedTemplate}
                  onUseTemplate={handleUseTemplate}
                  colorSelections={colorSelections}
                  onColorSelect={handleColorSelect}
                  showReason
                  getReason={(template) => getRecommendationReason(template, experience, studentStatus)}
                />
                <TemplateGrid
                  title="All templates"
                  templates={filteredTemplateGroups.all}
                  selectedTemplate={selectedTemplate}
                  onUseTemplate={handleUseTemplate}
                  colorSelections={colorSelections}
                  onColorSelect={handleColorSelect}
                />
                {filteredTemplateGroups.recommended.length === 0 && filteredTemplateGroups.all.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/25 bg-white/5 p-8 text-center">
                    <p className="text-lg font-semibold text-white">No templates match these filters.</p>
                    <p className="mt-2 text-sm text-white/65">Try clearing one or more filters to see available templates.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function TemplateGrid({
  title,
  templates,
  selectedTemplate,
  onUseTemplate,
  colorSelections,
  onColorSelect,
  showReason = false,
  getReason,
}: {
  title: string;
  templates: TemplateMeta[];
  selectedTemplate: string | null;
  onUseTemplate: (id: string) => void;
  colorSelections: Record<string, string>;
  onColorSelect: (id: string, color: string) => void;
  showReason?: boolean;
  getReason?: (template: TemplateMeta) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">{templates.length} templates</p>
      </div>
      {templates.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center">
          <p className="text-sm font-semibold text-white">No templates in this section.</p>
          <p className="mt-1 text-xs text-white/60">Adjust filters to repopulate this list.</p>
        </div>
      )}
      <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template, index) => {
          const selected = selectedTemplate === template.id;
          const headingColor = colorSelections[template.id];
          const accent = templateColorOptions[index % templateColorOptions.length].value;
          const templateSections =
            template.variant === "minimal"
              ? { primary: ["Summary", "Skills"], secondary: ["Education", "Experience", "Certifications"] }
              : template.variant === "sidebar"
                ? { primary: ["Summary", "Experience"], secondary: ["Skills", "Education", "Certifications"] }
                : template.variant === "executive"
                  ? { primary: ["Executive Profile", "Professional Experience"], secondary: ["Core Skills", "Education", "Certifications"] }
                  : { primary: ["Name", "Professional Summary"], secondary: ["Work Experience", "Education", "Certifications"] };
          return (
            <div
              key={template.id}
              className={`rounded-2xl border ${selected ? "border-[#fb923c]/70" : "border-white/15"} bg-white/5 p-4`}
            >
              <div
                className="relative overflow-hidden rounded-xl border bg-white text-[#111827] shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                style={{ borderColor: `${accent}55` }}
              >
                <div className="p-3">
                  <TemplateMiniPreview
                    variant={template.variant}
                    columns={template.columns}
                    headshot={template.headshot}
                    accent={headingColor}
                    richText
                  />
                </div>
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-[#111827]/45">
                    <span>{template.columns} column</span>
                    <span>{template.headshot ? "Headshot" : "No photo"}</span>
                  </div>
                  <div className="mt-2">
                    <span className="rounded-full border border-[#111827]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111827]/70">
                      {variantLabels[template.variant]} style
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        {templateSections.primary.map((label) => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: headingColor }} />
                            <span className="text-xs font-semibold" style={{ color: headingColor }}>
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                      {template.headshot && (
                        <div className="h-10 w-10 rounded-full border border-[#111827]/15 bg-[#f3f4f6]" />
                      )}
                    </div>
                    <div className={template.columns === 2 ? "grid grid-cols-[1.2fr_0.8fr] gap-3" : "space-y-2"}>
                      <div className="space-y-2">
                        {templateSections.secondary.map((label) => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: headingColor }} />
                            <span className="text-xs font-semibold" style={{ color: headingColor }}>
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                      {template.columns === 2 && (
                        <div className="space-y-2">
                          {["Skills", "Highlights", "Certifications"].map((label) => (
                            <div key={label} className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: headingColor }} />
                              <span className="text-xs font-semibold" style={{ color: headingColor }}>
                                {label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-base font-semibold text-white">{template.name}</p>
                <p className="text-sm text-white/70">{template.focus}</p>
                {showReason && getReason && (
                  <p className="mt-2 text-xs text-white/55">Why this template: {getReason(template)}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {templateColorOptions.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    aria-label={`Use ${option.name}`}
                    className={`h-5 w-5 rounded-full border ${headingColor === option.value ? "border-white" : "border-white/40"}`}
                    style={{ backgroundColor: option.value }}
                    onClick={() => onColorSelect(template.id, option.value)}
                  />
                ))}
              </div>
              <div className="mt-4">
                <Button
                  className={`${selected ? "bg-[#f97316] text-white" : "bg-white/10 text-white hover:bg-white/15"} h-10 w-full`}
                  onClick={() => onUseTemplate(template.id)}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
