"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/hooks/use-auth-user";
import { AuthActions } from "@/components/auth-actions";
import { useReactToPrint } from "react-to-print";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  ArrowUp,
  ArrowDown,
  User,
  Plus,
  Trash2,
} from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { HeadingForm } from "@/components/resume-wizard/HeadingForm";
import { ExperienceForm } from "@/components/resume-wizard/ExperienceForm";
import { ResumePreview } from "@/components/resume-preview";
import { Button } from "@/components/ui/button";
import { DownloadGate } from "@/components/download-gate";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { templates, type ResumeSection, type TemplateVariant } from "@/lib/templates";
import { appendOptionalExportBlocks, buildOrderedExportBlocks } from "@/lib/resume-export";
import { downloadResumeDoc, downloadResumeTxt } from "@/lib/export-download";

type BuilderSection = Exclude<ResumeSection, "highlights"> | "finish";

const sectionIcons: Record<BuilderSection, any> = {
  info: User,
  education: GraduationCap,
  experience: Briefcase,
  projects: FolderKanban,
  skills: Sparkles,
  certifications: Award,
  finish: LayoutDashboard,
};

const makeId = () => Math.random().toString(36).slice(2, 11);

function sectionName(section: BuilderSection, hasProjects: boolean, hasHighlights: boolean) {
  if (section === "info") return "Info";
  if (section === "education") return "Education";
  if (section === "experience") return hasProjects ? "Projects & Experience" : "Experience";
  if (section === "projects") return "Projects";
  if (section === "skills") return hasHighlights ? "Skills & Highlights" : "Skills";
  if (section === "certifications") return "Certifications";
  return "Finish";
}

function BuilderPageContent() {
  const {
    step,
    setStep,
    data,
    template,
    profile,
    setTemplate,
    setProfile,
    updateHeading,
    updateSummary,
    addEducation,
    updateEducation,
    removeEducation,
    moveEducation,
    addProject,
    updateProject,
    removeProject,
    moveProject,
    addCertification,
    updateCertification,
    removeCertification,
    setSkills,
    setHighlights,
    setLanguages,
    setLinks,
    setReferences,
    addExperience,
    loadDraft,
  } = useResumeStore();
  const searchParams = useSearchParams();
  const { user, loading } = useAuthUser();
  const tier = (user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const resumeRef = useRef<HTMLDivElement>(null);
  const [skillsDraft, setSkillsDraft] = useState(() => data.skills.join(", "));
  const [languagesDraft, setLanguagesDraft] = useState(() => data.languages.join(", "));
  const [highlightsDraft, setHighlightsDraft] = useState(() => data.highlights.join("\n"));
  const [linksDraft, setLinksDraft] = useState(() => data.links.join("\n"));
  const [referencesDraft, setReferencesDraft] = useState(() => data.references.join("\n"));
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [draftsLoading, setDraftsLoading] = useState(false);
  const [draftsError, setDraftsError] = useState<string>("");
  const [drafts, setDrafts] = useState<
    { id: string; title: string | null; updated_at: string | null; created_at: string | null; type: string }[]
  >([]);

  useEffect(() => {
    const saved = localStorage.getItem("elevateCvResumeTemplate");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        id?: string;
        color?: string;
        columns?: 1 | 2;
        headshot?: boolean;
        variant?: TemplateVariant;
      };
      const meta = parsed?.id ? templates.find((t) => t.id === parsed.id) : undefined;
      if (parsed?.id || parsed?.color || parsed?.columns || typeof parsed?.headshot === "boolean") {
        setTemplate({
          id: parsed?.id ?? meta?.id ?? null,
          accent: parsed?.color ?? "#0f766e",
          columns: parsed?.columns ?? meta?.columns ?? 1,
          headshot: parsed?.headshot ?? meta?.headshot ?? false,
          variant: parsed?.variant ?? meta?.variant ?? "classic",
        });
      }
    } catch {
      // ignore
    }
  }, [setTemplate]);

  const fetchDrafts = async () => {
    if (!user) {
      setDraftsError("Sign in to access saved drafts.");
      return;
    }
    setDraftsLoading(true);
    setDraftsError("");
    try {
      const res = await fetch("/api/documents/list");
      const payload = await res.json();
      if (!res.ok) {
        setDraftsError(payload?.error ?? "Unable to load drafts.");
        return;
      }
      const items = (payload?.documents ?? []).filter((doc: any) => doc.type === "resume");
      setDrafts(items);
    } catch {
      setDraftsError("Unable to load drafts.");
    } finally {
      setDraftsLoading(false);
    }
  };

  const handleLoadDraft = async (id: string) => {
    setDraftsError("");
    try {
      const res = await fetch(`/api/documents/${id}`);
      const payload = await res.json();
      if (!res.ok || !payload?.document) {
        setDraftsError(payload?.error ?? "Unable to load draft.");
        return;
      }
      const doc = payload.document;
      loadDraft({
        data: doc.data ?? undefined,
        template: doc.template ?? undefined,
        profile: doc.profile ?? doc.data?.profile ?? undefined,
      });
      setDraftsOpen(false);
    } catch {
      setDraftsError("Unable to load draft.");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("elevateCvResumeProfile");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        audience?: "student" | "professional";
        experience?: "none" | "lt3" | "3-5" | "5-10" | "10+";
      };
      if (parsed?.audience || parsed?.experience) {
        setProfile({
          audience: parsed?.audience ?? "professional",
          experience: parsed?.experience ?? null,
        });
      }
    } catch {
      // ignore
    }
  }, [setProfile]);

  useEffect(() => {
    const saved = localStorage.getItem("elevateCvResumeUploadParsed");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        heading?: { firstName?: string; lastName?: string; email?: string; phone?: string };
        summary?: string;
        skills?: string[];
        experience?: any[];
        education?: any[];
        projects?: any[];
        certifications?: any[];
      };
      if (parsed.heading && !data.heading.firstName && !data.heading.lastName) {
        updateHeading({
          firstName: parsed.heading.firstName ?? "",
          lastName: parsed.heading.lastName ?? "",
          email: parsed.heading.email ?? "",
          phone: parsed.heading.phone ?? "",
        });
      }
      if (parsed.summary && !data.summary) {
        updateSummary(parsed.summary);
      }
      if (parsed.skills?.length && data.skills.length === 0) {
        setSkills(parsed.skills);
      }
      if (parsed.experience?.length && data.experience.length === 0) {
        parsed.experience.forEach((item) => addExperience(item));
      }
      if (parsed.education?.length && data.education.length === 0) {
        parsed.education.forEach((item) => addEducation(item));
      }
      if (parsed.projects?.length && data.projects.length === 0) {
        parsed.projects.forEach((item) => addProject(item));
      }
      if (parsed.certifications?.length && data.certifications.length === 0) {
        parsed.certifications.forEach((item) => addCertification(item));
      }
      localStorage.removeItem("elevateCvResumeUploadParsed");
    } catch {
      // ignore malformed import data
    }
  }, [
    addCertification,
    addEducation,
    addExperience,
    addProject,
    data.certifications.length,
    data.education.length,
    data.experience.length,
    data.heading.firstName,
    data.heading.lastName,
    data.skills.length,
    data.summary,
    updateHeading,
    updateSummary,
    setSkills,
    data.projects.length,
  ]);

  const templateMeta = useMemo(
    () => (template?.id ? templates.find((item) => item.id === template.id) : undefined),
    [template?.id]
  );
  const hasProjects = !!templateMeta?.sections.includes("projects");
  const hasHighlights = !!templateMeta?.sections.includes("highlights");

  const steps = useMemo(() => {
    const source = templateMeta?.sections ?? ["info", "experience", "education", "skills"];
    const order: BuilderSection[] = ["info"];
    for (const section of source) {
      if (section === "info" || section === "highlights") continue;
      if (!order.includes(section as BuilderSection)) {
        order.push(section as BuilderSection);
      }
    }
    if (hasHighlights && !order.includes("skills")) {
      order.push("skills");
    }
    order.push("finish");
    return order.map((section, index) => ({
      id: index + 1,
      section,
      name: sectionName(section, hasProjects, hasHighlights),
      icon: sectionIcons[section],
    }));
  }, [templateMeta?.sections, hasProjects, hasHighlights]);

  useEffect(() => {
    if (step < 1) {
      setStep(1);
      return;
    }
    if (step > steps.length) {
      setStep(steps.length);
    }
  }, [step, steps.length, setStep]);

  const current = steps[Math.max(0, Math.min(step - 1, steps.length - 1))];
  const currentSection = current?.section ?? "info";

  useEffect(() => {
    if (currentSection === "skills") {
      setSkillsDraft(data.skills.join(", "));
      setLanguagesDraft(data.languages.join(", "));
      setHighlightsDraft(data.highlights.join("\n"));
      setLinksDraft(data.links.join("\n"));
      setReferencesDraft(data.references.join("\n"));
    }
  }, [
    currentSection,
    data.skills,
    data.languages,
    data.highlights,
    data.links,
    data.references,
  ]);

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: `Resume_${Date.now()}`,
  });

  const isSubscribed =
    (user?.user_metadata as { tier?: string } | undefined)?.tier === "PREMIUM_14_DAY" ||
    (user?.user_metadata as { tier?: string } | undefined)?.tier === "ANNUAL";
  const heading = {
    firstName: data?.heading?.firstName ?? "",
    lastName: data?.heading?.lastName ?? "",
    email: data?.heading?.email ?? "",
    phone: data?.heading?.phone ?? "",
  };
  const filledHeadingFields = [heading.firstName, heading.lastName, heading.email, heading.phone].filter(
    (field) => field.trim().length > 0
  ).length;
  const hasPreviewData =
    filledHeadingFields >= 2 ||
    data.experience.length > 0 ||
    data.education.length > 0 ||
    data.projects.length > 0 ||
    data.certifications.length > 0 ||
    data.skills.length > 0 ||
    data.highlights.length > 0 ||
    (data.summary ?? "").trim().length > 0;
  const isContactReady =
    heading.firstName.trim().length > 0 &&
    heading.lastName.trim().length > 0 &&
    heading.email.trim().length > 0;

  const nextStep = step < steps.length ? steps[step] : undefined;
  const nextLabel = nextStep ? nextStep.name : "Next";
  const exportBlocks = useMemo(
    () => appendOptionalExportBlocks(buildOrderedExportBlocks({ template, data }), { data }),
    [template, data]
  );

  const handleSaveDraft = async () => {
    setSaveMessage("");
    const title = `${heading.firstName} ${heading.lastName}`.trim() || "Resume Draft";
    const res = await fetch("/api/documents/save", {
      method: "POST",
      body: JSON.stringify({
        type: "resume",
        title,
        data: { ...data, profile },
        template,
      }),
    });
    const payload = await res.json();
    if (!res.ok) {
      setSaveMessage(payload?.error ?? "Unable to save draft.");
      return;
    }
    setSaveMessage("Draft saved to your account.");
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[#0a0f1c] text-[#e8edf8]">
      <header className="fixed top-0 left-0 right-0 bg-[#0a0f1c]/90 border-b border-white/10 z-50 h-16 flex items-center px-6 backdrop-blur-xl">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/start/progress" className="text-xs font-semibold text-white/70 hover:text-white">
              Go Back
            </Link>
            <span className="text-xl font-black text-white">
              Elevate<span className="text-[#fb923c]">CV</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-1">
            {steps.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all border",
                  step === item.id
                    ? "bg-[#f97316] text-white border-[#f97316]"
                    : "text-white/70 border-white/10 bg-white/5"
                )}
              >
                <item.icon className="w-3 h-3" />
                {item.name}
              </div>
            ))}
          </nav>
          <AuthActions userEmail={user?.email} loading={loading} tier={tier} />
        </div>
      </header>

      <main className="flex-1 container mx-auto grid grid-cols-1 gap-8 p-6 lg:grid-cols-[0.82fr_1.18fr] lg:p-10">
        {searchParams.get("success") === "payment_complete" && (
          <div className="lg:col-span-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Payment successful. Your account is now Premium.
          </div>
        )}
        {searchParams.get("error") === "payment_failed" && (
          <div className="lg:col-span-2 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            Payment failed. Please try again.
          </div>
        )}
        <div className="px-1 md:px-2">
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Saved drafts</p>
                <p className="mt-1 text-sm text-white/70">Load a previous resume draft.</p>
              </div>
              <Button
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={() => {
                  const next = !draftsOpen;
                  setDraftsOpen(next);
                  if (next && drafts.length === 0) {
                    fetchDrafts();
                  }
                }}
              >
                {draftsOpen ? "Hide Drafts" : "Load Draft"}
              </Button>
            </div>
            {draftsOpen && (
              <div className="mt-4 space-y-3 text-sm text-white/70">
                {draftsLoading && <p>Loading drafts...</p>}
                {draftsError && <p className="text-rose-300">{draftsError}</p>}
                {!draftsLoading && drafts.length === 0 && !draftsError && (
                  <p>No saved drafts yet.</p>
                )}
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b1224] px-4 py-3 text-left"
                  >
                    <button
                      type="button"
                      onClick={() => handleLoadDraft(draft.id)}
                      className="flex-1 text-left transition hover:text-white"
                    >
                      <p className="text-sm font-semibold text-white">
                        {draft.title || "Untitled Draft"}
                      </p>
                      <p className="mt-1 text-xs text-white/60">
                        Updated{" "}
                        {new Date(draft.updated_at ?? draft.created_at ?? Date.now()).toLocaleDateString()}
                      </p>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                        Resume
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 border-rose-400/30 bg-transparent px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-200 hover:bg-rose-500/10"
                        onClick={async () => {
                          setDraftsError("");
                          const res = await fetch(`/api/documents/${draft.id}`, { method: "DELETE" });
                          if (!res.ok) {
                            const payload = await res.json().catch(() => ({}));
                            setDraftsError(payload?.error ?? "Unable to delete draft.");
                            return;
                          }
                          setDrafts((prev) => prev.filter((item) => item.id !== draft.id));
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-8 overflow-x-auto whitespace-nowrap lg:hidden sticky top-0 z-10 bg-[#0a0f1c] py-3">
            {steps.map((item) => (
              <button
                key={item.id}
                onClick={() => setStep(item.id)}
                className={cn(
                  "inline-flex flex-col items-center gap-1 mx-3",
                  step === item.id ? "text-[#fb923c]" : "text-white/40"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-bold">{item.name}</span>
              </button>
            ))}
          </div>

          {currentSection === "info" && (
            <div className="space-y-6">
              <HeadingForm />
              {!isContactReady && (
                <div className="rounded-xl border border-[#fb923c]/40 bg-[#1f2937] px-4 py-3 text-xs text-white/80">
                  Add your name and email to unlock the strongest preview and ATS-ready layout.
                </div>
              )}
            </div>
          )}

          {currentSection === "education" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Education</h2>
              <div className="flex justify-between items-center">
                <p className="text-white/70">Add your degrees and institutions...</p>
                <Button
                  onClick={() =>
                    addEducation({
                      id: makeId(),
                      school: "",
                      degree: "",
                      startDate: "",
                      endDate: "",
                      isCurrent: false,
                    })
                  }
                  size="sm"
                  className="bg-[#f97316] text-white hover:bg-[#ea580c]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
              </div>
              {data.education.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-white/15 rounded-lg bg-white/[0.03]">
                  <p className="text-white/60">No education added yet.</p>
                </div>
              )}
              {data.education.map((edu) => (
                <div key={edu.id} className="space-y-4 border-b border-white/15 pb-6">
                  <div className="space-y-2">
                    <Label className="text-white/80">School</Label>
                    <Input
                      className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                      placeholder="e.g. University of Ghana"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Degree</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder="e.g. BSc Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Start Date</Label>
                      <Input
                        type="month"
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={edu.startDate ?? ""}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">End Date</Label>
                      <Input
                        type="month"
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={edu.endDate ?? ""}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        disabled={!!edu.isCurrent}
                      />
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-white/75">
                    <input
                      type="checkbox"
                      checked={!!edu.isCurrent}
                      onChange={(e) =>
                        updateEducation(edu.id, {
                          isCurrent: e.target.checked,
                          endDate: e.target.checked ? "" : edu.endDate ?? "",
                        })
                      }
                    />
                    I am currently studying here
                  </label>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                      onClick={() => moveEducation(edu.id, "up")}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                      onClick={() => moveEducation(edu.id, "down")}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection === "experience" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                Tip: Focus on outcomes. Start each bullet with an action verb and quantify impact where possible.
              </div>
              <ExperienceForm />
            </div>
          )}

          {currentSection === "projects" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Projects</h2>
              <div className="flex justify-between items-center">
                <p className="text-white/70">Show practical work, school projects, or portfolio items.</p>
                <Button
                  onClick={() =>
                    addProject({
                      id: makeId(),
                      name: "",
                      role: "",
                      startDate: "",
                      endDate: "",
                      isCurrent: false,
                      description: "",
                    })
                  }
                  size="sm"
                  className="bg-[#f97316] text-white hover:bg-[#ea580c]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
              </div>
              {data.projects.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-white/15 rounded-lg bg-white/[0.03]">
                  <p className="text-white/60">No projects added yet.</p>
                </div>
              )}
              {data.projects.map((project) => (
                <div key={project.id} className="space-y-4 border-b border-white/15 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Project Name</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={project.name}
                        onChange={(e) => updateProject(project.id, { name: e.target.value })}
                        placeholder="e.g. Student Attendance App"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Your Role</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={project.role}
                        onChange={(e) => updateProject(project.id, { role: e.target.value })}
                        placeholder="e.g. Lead Developer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Start Date</Label>
                      <Input
                        type="month"
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={project.startDate}
                        onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">End Date</Label>
                      <Input
                        type="month"
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={project.endDate}
                        onChange={(e) => updateProject(project.id, { endDate: e.target.value })}
                        disabled={!!project.isCurrent}
                      />
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-white/75">
                    <input
                      type="checkbox"
                      checked={!!project.isCurrent}
                      onChange={(e) =>
                        updateProject(project.id, {
                          isCurrent: e.target.checked,
                          endDate: e.target.checked ? "" : project.endDate,
                        })
                      }
                    />
                    Ongoing project
                  </label>
                  <div className="space-y-2">
                    <Label className="text-white/80">Project Description</Label>
                    <Textarea
                      className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                      rows={3}
                      value={project.description}
                      onChange={(e) => updateProject(project.id, { description: e.target.value })}
                      placeholder="Describe your project outcome and tools used..."
                    />
                  </div>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                      onClick={() => moveProject(project.id, "up")}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                      onClick={() => moveProject(project.id, "down")}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                      onClick={() => removeProject(project.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection === "skills" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">{sectionName("skills", hasProjects, hasHighlights)}</h2>
              <p className="text-sm text-white/70">Use commas to separate items. Example: Excel, SQL, Customer Support.</p>
              <div className="space-y-2">
                <Label className="text-white/80">Skills</Label>
                <Textarea
                  className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                  rows={4}
                  value={skillsDraft}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSkillsDraft(value);
                    setSkills(
                      value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    );
                  }}
                  placeholder="Communication, Sales, Project Management"
                />
              </div>
              {hasHighlights && (
                <div className="space-y-2">
                  <Label className="text-white/80">Highlights</Label>
                  <Textarea
                    className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    rows={4}
                    value={highlightsDraft}
                    onChange={(e) => {
                      const value = e.target.value;
                      setHighlightsDraft(value);
                      setHighlights(
                        value
                          .split("\n")
                          .map((item) => item.trim())
                          .filter(Boolean)
                      );
                    }}
                    placeholder={"Increased sales by 22%\nTrained 8 new team members"}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-white/80">Languages (Optional)</Label>
                <Input
                  className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                  value={languagesDraft}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLanguagesDraft(value);
                    setLanguages(
                      value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    );
                  }}
                  placeholder="English, Twi, French"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Links (Optional, one per line)</Label>
                <Textarea
                  className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                  rows={3}
                  value={linksDraft}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLinksDraft(value);
                    setLinks(
                      value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    );
                  }}
                  placeholder={"https://linkedin.com/in/yourname\nhttps://github.com/yourname"}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">References (Optional, one per line)</Label>
                <Textarea
                  className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                  rows={3}
                  value={referencesDraft}
                  onChange={(e) => {
                    const value = e.target.value;
                    setReferencesDraft(value);
                    setReferences(
                      value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    );
                  }}
                  placeholder={"Referee Name - Role - Contact\nAnother Referee - Role - Contact"}
                />
              </div>
            </div>
          )}

          {currentSection === "certifications" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Certifications</h2>
              <div className="flex justify-between items-center">
                <p className="text-white/70">Add licenses or certifications that strengthen your profile.</p>
                <Button
                  onClick={() => addCertification({ id: makeId(), name: "", issuer: "", date: "" })}
                  size="sm"
                  className="bg-[#f97316] text-white hover:bg-[#ea580c]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Certification
                </Button>
              </div>
              {data.certifications.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-white/15 rounded-lg bg-white/[0.03]">
                  <p className="text-white/60">No certifications added yet.</p>
                </div>
              )}
              {data.certifications.map((cert) => (
                <div key={cert.id} className="space-y-4 border-b border-white/15 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Certification Name</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                        placeholder="e.g. Google Data Analytics"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Issuer</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                        placeholder="e.g. Coursera"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Date</Label>
                      <Input
                        type="month"
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={cert.date}
                        onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                      onClick={() => removeCertification(cert.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection === "finish" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
              <DownloadGate
                isSubscribed={isSubscribed}
                onDownload={handlePrint || (() => {})}
                onDownloadTxt={() => downloadResumeTxt({ template, data })}
                onDownloadDoc={() => downloadResumeDoc({ template, data })}
              />
              <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Save Draft</p>
                <p className="mt-2 text-sm text-white/70">
                  Save this resume to your account so you can continue later.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                    onClick={handleSaveDraft}
                  >
                    Save Draft
                  </Button>
                  {saveMessage && <span className="text-xs text-white/60">{saveMessage}</span>}
                </div>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Export Order</p>
                <div className="mt-3 space-y-2">
                  {exportBlocks.length > 0 ? (
                    exportBlocks.map((block, index) => (
                      <div key={`${block.key}-${index}`} className="flex items-center justify-between text-sm">
                        <span className="text-white/85">{index + 1}. {block.title}</span>
                        <span className="text-white/55">{block.lines.length} lines</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/65">No exportable content yet.</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-white/50">Save and continue later. Your progress is stored automatically.</p>
            </div>
          )}

          <div className="mt-12 flex justify-between border-t border-white/10 pt-6">
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            <Button
              className="bg-[#f97316] text-white hover:bg-[#ea580c]"
              onClick={() => setStep(Math.min(steps.length, step + 1))}
              disabled={step === steps.length}
            >
              Next: {nextLabel} <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="hidden lg:block sticky top-24 max-h-[84vh] overflow-y-auto rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.12)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[#111827]/60 font-semibold">Preview</p>
          <div className="mt-5 flex justify-center">
            <ResumePreview ref={resumeRef} />
          </div>
          {!hasPreviewData && (
            <div className="mt-4 rounded-lg border border-[#111827]/10 bg-white px-4 py-3 text-xs text-[#111827]/70">
              Start filling your details on the left. This preview is already using your selected template.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1c]" />}>
      <BuilderPageContent />
    </Suspense>
  );
}
