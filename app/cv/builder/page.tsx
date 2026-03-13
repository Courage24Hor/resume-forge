
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/hooks/use-auth-user";
import { AuthActions } from "@/components/auth-actions";
import { useReactToPrint } from "react-to-print";
import {
  Award,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Medal,
  Plus,
  Sparkles,
  Users,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useCvStore } from "@/hooks/use-cv-store";
import { CvPreview } from "@/components/cv-preview";
import { Button } from "@/components/ui/button";
import { DownloadGate } from "@/components/download-gate";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cvTemplates, type CvSection, type CvTemplateVariant } from "@/lib/cv-templates";
import { downloadCvDoc, downloadCvTxt } from "@/lib/cv-export-download";
import { buildOrderedCvBlocks } from "@/lib/cv-export";

type BuilderSection = CvSection | "finish";

const sectionIcons: Record<BuilderSection, any> = {
  info: FileText,
  summary: Sparkles,
  education: GraduationCap,
  experience: Briefcase,
  projects: LayoutDashboard,
  skills: Sparkles,
  certifications: Award,
  publications: BookOpen,
  research: BookOpen,
  teaching: Users,
  awards: Medal,
  memberships: Users,
  languages: Sparkles,
  links: FileText,
  references: FileText,
  finish: LayoutDashboard,
};

const makeId = () => Math.random().toString(36).slice(2, 11);

function sectionLabel(section: BuilderSection) {
  const labels: Record<BuilderSection, string> = {
    info: "Info",
    summary: "Summary",
    education: "Education",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    certifications: "Certifications",
    publications: "Publications",
    research: "Research",
    teaching: "Teaching",
    awards: "Awards",
    memberships: "Memberships",
    languages: "Languages",
    links: "Links",
    references: "References",
    finish: "Finish",
  };
  return labels[section] ?? "Step";
}

export default function CvBuilderPage() {
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
    setLanguages,
    setLinks,
    setReferences,
    addExperience,
    updateExperience,
    removeExperience,
    moveExperience,
    addPublication,
    updatePublication,
    removePublication,
    addResearch,
    updateResearch,
    removeResearch,
    addTeaching,
    updateTeaching,
    removeTeaching,
    addAward,
    updateAward,
    removeAward,
    addMembership,
    updateMembership,
    removeMembership,
    loadDraft,
  } = useCvStore();
  const { user, loading } = useAuthUser();
  const tier = (user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const resumeRef = useRef<HTMLDivElement>(null);
  const [skillsDraft, setSkillsDraft] = useState(() => data.skills.join(", "));
  const [languagesDraft, setLanguagesDraft] = useState(() => data.languages.join(", "));
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
    const saved = localStorage.getItem("elevateCvCvTemplate");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        id?: string;
        color?: string;
        columns?: 1 | 2;
        headshot?: boolean;
        variant?: CvTemplateVariant;
      };
      const meta = parsed?.id ? cvTemplates.find((t) => t.id === parsed.id) : undefined;
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
      const items = (payload?.documents ?? []).filter((doc: any) => doc.type === "cv");
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
    const saved = localStorage.getItem("elevateCvCvProfile");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { audience?: "academic" | "professional" };
      if (parsed?.audience) {
        setProfile({ audience: parsed.audience });
      }
    } catch {
      // ignore
    }
  }, [setProfile]);

  useEffect(() => {
    const saved = localStorage.getItem("elevateCvCvUploadParsed");
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
        publications?: any[];
        research?: any[];
        teaching?: any[];
        awards?: any[];
        memberships?: any[];
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
      if (parsed.publications?.length && data.publications.length === 0) {
        parsed.publications.forEach((item) => addPublication(item));
      }
      if (parsed.research?.length && data.research.length === 0) {
        parsed.research.forEach((item) => addResearch(item));
      }
      if (parsed.teaching?.length && data.teaching.length === 0) {
        parsed.teaching.forEach((item) => addTeaching(item));
      }
      if (parsed.awards?.length && data.awards.length === 0) {
        parsed.awards.forEach((item) => addAward(item));
      }
      if (parsed.memberships?.length && data.memberships.length === 0) {
        parsed.memberships.forEach((item) => addMembership(item));
      }
      localStorage.removeItem("elevateCvCvUploadParsed");
    } catch {
      // ignore malformed import data
    }
  }, [
    addAward,
    addCertification,
    addEducation,
    addExperience,
    addMembership,
    addProject,
    addPublication,
    addResearch,
    addTeaching,
    data.awards.length,
    data.certifications.length,
    data.education.length,
    data.experience.length,
    data.heading.firstName,
    data.heading.lastName,
    data.memberships.length,
    data.projects.length,
    data.publications.length,
    data.research.length,
    data.skills.length,
    data.summary,
    data.teaching.length,
    setSkills,
    updateHeading,
    updateSummary,
  ]);

  const templateMeta = useMemo(
    () => (template?.id ? cvTemplates.find((item) => item.id === template.id) : undefined),
    [template?.id]
  );

  const steps = useMemo(() => {
    const source = templateMeta?.sections ?? [
      "info",
      "summary",
      "experience",
      "education",
      "skills",
      "certifications",
    ];
    const order: BuilderSection[] = ["info"];
    for (const section of source) {
      if (section === "info") continue;
      if (!order.includes(section as BuilderSection)) {
        order.push(section as BuilderSection);
      }
    }
    if (!order.includes("summary")) order.splice(1, 0, "summary");
    order.push("finish");
    return order.map((section, index) => ({
      id: index + 1,
      section,
      name: sectionLabel(section),
      icon: sectionIcons[section],
    }));
  }, [templateMeta?.sections]);

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
      setLinksDraft(data.links.join("\n"));
      setReferencesDraft(data.references.join("\n"));
    }
  }, [currentSection, data.skills, data.languages, data.links, data.references]);

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: `CV_${Date.now()}`,
  });

  const isSubscribed =
    (user?.user_metadata as { tier?: string } | undefined)?.tier === "PREMIUM_14_DAY" ||
    (user?.user_metadata as { tier?: string } | undefined)?.tier === "ANNUAL";
  const nextStep = step < steps.length ? steps[step] : undefined;
  const nextLabel = nextStep ? nextStep.name : "Next";
  const exportBlocks = useMemo(
    () => buildOrderedCvBlocks({ template, data }),
    [template, data]
  );

  const handleSaveDraft = async () => {
    setSaveMessage("");
    const title = `${data.heading.firstName} ${data.heading.lastName}`.trim() || "CV Draft";
    const res = await fetch("/api/documents/save", {
      method: "POST",
      body: JSON.stringify({
        type: "cv",
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
            <Link href="/cv/start" className="text-xs font-semibold text-white/70 hover:text-white">
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
        <div className="px-1 md:px-2">
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Saved drafts</p>
                <p className="mt-1 text-sm text-white/70">Load a previous CV draft.</p>
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
                        CV
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
              <div>
                <p className="text-sm font-semibold text-white">Your contact details</p>
                <p className="mt-1 text-sm text-white/70">We suggest including an email and phone number.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">First Name</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.heading.firstName}
                    onChange={(e) => updateHeading({ firstName: e.target.value })}
                    placeholder="Akua"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Last Name</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.heading.lastName}
                    onChange={(e) => updateHeading({ lastName: e.target.value })}
                    placeholder="Mensah"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">City</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.heading.city}
                    onChange={(e) => updateHeading({ city: e.target.value })}
                    placeholder="Kumasi"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Country</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.heading.country}
                    onChange={(e) => updateHeading({ country: e.target.value })}
                    placeholder="Ghana"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Postcode</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.heading.postcode}
                    onChange={(e) => updateHeading({ postcode: e.target.value })}
                    placeholder="AK-039-5021"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Phone</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.heading.phone}
                    onChange={(e) => updateHeading({ phone: e.target.value })}
                    placeholder="32 202 3456"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-white/80">Email Address</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    type="email"
                    value={data.heading.email}
                    onChange={(e) => updateHeading({ email: e.target.value })}
                    placeholder="akua.mensah@email.com"
                  />
                </div>
              </div>
            </div>
          )}

          {currentSection === "summary" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Professional Summary</h2>
              <Textarea
                className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                rows={6}
                value={data.summary}
                onChange={(e) => updateSummary(e.target.value)}
                placeholder="Write a short summary highlighting your strengths and goals..."
              />
            </div>
          )}
          {currentSection === "education" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Education</h2>
              <div className="flex justify-between items-center">
                <p className="text-white/70">Add your degrees and institutions.</p>
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
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Experience</h2>
                <Button
                  onClick={() =>
                    addExperience({
                      id: makeId(),
                      role: "",
                      company: "",
                      startDate: "",
                      endDate: "",
                      isCurrent: false,
                      description: "",
                    })
                  }
                  size="sm"
                  className="bg-[#f97316] text-white hover:bg-[#ea580c]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Experience
                </Button>
              </div>
              {data.experience.length === 0 && (
                <div className="py-8 border-y border-dashed border-white/20 text-center">
                  <p className="text-white/60">No experience added yet.</p>
                </div>
              )}
              {data.experience.map((exp) => (
                <div key={exp.id} className="space-y-4 border-b border-white/15 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Role</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                        placeholder="e.g. Lecturer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Organization</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        placeholder="e.g. University of Ghana"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Start Date</Label>
                      <Input
                        type="month"
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={exp.startDate ?? ""}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">End Date</Label>
                      <Input
                        type="month"
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={exp.endDate ?? ""}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        disabled={!!exp.isCurrent}
                      />
                    </div>
                    <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-white/75">
                      <input
                        type="checkbox"
                        checked={!!exp.isCurrent}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            isCurrent: e.target.checked,
                            endDate: e.target.checked ? "" : exp.endDate ?? "",
                          })
                        }
                      />
                      This is my current role
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">Description & Achievements</Label>
                    <Textarea
                      className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                      rows={4}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                      placeholder="Describe your impact..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white hover:bg-white/10 mr-1"
                      onClick={() => moveExperience(exp.id, "up")}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white hover:bg-white/10 mr-1"
                      onClick={() => moveExperience(exp.id, "down")}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection === "projects" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Projects</h2>
              <div className="flex justify-between items-center">
                <p className="text-white/70">Show practical work, research projects, or portfolio items.</p>
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
                        placeholder="e.g. Thesis on Healthcare Delivery"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Your Role</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={project.role}
                        onChange={(e) => updateProject(project.id, { role: e.target.value })}
                        placeholder="e.g. Lead Researcher"
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
              <h2 className="text-2xl font-bold text-white">Skills</h2>
              <p className="text-sm text-white/70">Use commas to separate items.</p>
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
                placeholder="Communication, Research, Data Analysis"
              />
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

          {currentSection === "publications" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Publications</h2>
              <div className="flex justify-between items-center">
                <p className="text-white/70">Add journal articles, conference papers, or theses.</p>
                <Button
                  onClick={() => addPublication({ id: makeId(), title: "", venue: "", year: "", link: "" })}
                  size="sm"
                  className="bg-[#f97316] text-white hover:bg-[#ea580c]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Publication
                </Button>
              </div>
              {data.publications.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-white/15 rounded-lg bg-white/[0.03]">
                  <p className="text-white/60">No publications added yet.</p>
                </div>
              )}
              {data.publications.map((item) => (
                <div key={item.id} className="space-y-4 border-b border-white/15 pb-6">
                  <div className="space-y-2">
                    <Label className="text-white/80">Title</Label>
                    <Input
                      className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                      value={item.title}
                      onChange={(e) => updatePublication(item.id, { title: e.target.value })}
                      placeholder="e.g. Climate Resilience in West Africa"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-white/80">Venue</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={item.venue}
                        onChange={(e) => updatePublication(item.id, { venue: e.target.value })}
                        placeholder="e.g. Journal of Public Health"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Year</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={item.year}
                        onChange={(e) => updatePublication(item.id, { year: e.target.value })}
                        placeholder="2024"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Link (Optional)</Label>
                    <Input
                      className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                      value={item.link}
                      onChange={(e) => updatePublication(item.id, { link: e.target.value })}
                      placeholder="https://doi.org/..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                      onClick={() => removePublication(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection === "research" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Research</h2>
              <div className="flex justify-between items-center">
                <p className="text-white/70">Add research projects or focus areas.</p>
                <Button
                  onClick={() => addResearch({ id: makeId(), title: "", description: "", year: "" })}
                  size="sm"
                  className="bg-[#f97316] text-white hover:bg-[#ea580c]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Research
                </Button>
              </div>
              {data.research.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-white/15 rounded-lg bg-white/[0.03]">
                  <p className="text-white/60">No research added yet.</p>
                </div>
              )}
              {data.research.map((item) => (
                <div key={item.id} className="space-y-4 border-b border-white/15 pb-6">
                  <div className="space-y-2">
                    <Label className="text-white/80">Title</Label>
                    <Input
                      className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                      value={item.title}
                      onChange={(e) => updateResearch(item.id, { title: e.target.value })}
                      placeholder="e.g. Public Health Systems"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Description</Label>
                    <Textarea
                      className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                      rows={3}
                      value={item.description}
                      onChange={(e) => updateResearch(item.id, { description: e.target.value })}
                      placeholder="Summarize the research focus..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Year</Label>
                    <Input
                      className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                      value={item.year}
                      onChange={(e) => updateResearch(item.id, { year: e.target.value })}
                      placeholder="2023"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                      onClick={() => removeResearch(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection === "teaching" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Teaching</h2>
              <div className="flex justify-between items-center">
                <p className="text-white/70">Add courses and teaching assignments.</p>
                <Button
                  onClick={() => addTeaching({ id: makeId(), course: "", institution: "", term: "" })}
                  size="sm"
                  className="bg-[#f97316] text-white hover:bg-[#ea580c]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Teaching
                </Button>
              </div>
              {data.teaching.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-white/15 rounded-lg bg-white/[0.03]">
                  <p className="text-white/60">No teaching added yet.</p>
                </div>
              )}
              {data.teaching.map((item) => (
                <div key={item.id} className="space-y-4 border-b border-white/15 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Course</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={item.course}
                        onChange={(e) => updateTeaching(item.id, { course: e.target.value })}
                        placeholder="e.g. Health Policy 401"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Institution</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={item.institution}
                        onChange={(e) => updateTeaching(item.id, { institution: e.target.value })}
                        placeholder="e.g. University of Ghana"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Term</Label>
                    <Input
                      className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                      value={item.term}
                      onChange={(e) => updateTeaching(item.id, { term: e.target.value })}
                      placeholder="e.g. Fall 2024"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                      onClick={() => removeTeaching(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection === "awards" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Awards</h2>
              <div className="flex justify-between items-center">
                <p className="text-white/70">Add honors, awards, or grants.</p>
                <Button
                  onClick={() => addAward({ id: makeId(), name: "", issuer: "", year: "" })}
                  size="sm"
                  className="bg-[#f97316] text-white hover:bg-[#ea580c]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Award
                </Button>
              </div>
              {data.awards.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-white/15 rounded-lg bg-white/[0.03]">
                  <p className="text-white/60">No awards added yet.</p>
                </div>
              )}
              {data.awards.map((item) => (
                <div key={item.id} className="space-y-4 border-b border-white/15 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Award Name</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={item.name}
                        onChange={(e) => updateAward(item.id, { name: e.target.value })}
                        placeholder="e.g. Best Researcher"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Issuer</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={item.issuer}
                        onChange={(e) => updateAward(item.id, { issuer: e.target.value })}
                        placeholder="e.g. Ghana Research Council"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Year</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={item.year}
                        onChange={(e) => updateAward(item.id, { year: e.target.value })}
                        placeholder="2022"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                      onClick={() => removeAward(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection === "memberships" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Memberships</h2>
              <div className="flex justify-between items-center">
                <p className="text-white/70">Add professional associations or memberships.</p>
                <Button
                  onClick={() => addMembership({ id: makeId(), name: "", role: "", year: "" })}
                  size="sm"
                  className="bg-[#f97316] text-white hover:bg-[#ea580c]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Membership
                </Button>
              </div>
              {data.memberships.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-white/15 rounded-lg bg-white/[0.03]">
                  <p className="text-white/60">No memberships added yet.</p>
                </div>
              )}
              {data.memberships.map((item) => (
                <div key={item.id} className="space-y-4 border-b border-white/15 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Organization</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={item.name}
                        onChange={(e) => updateMembership(item.id, { name: e.target.value })}
                        placeholder="e.g. Ghana Medical Association"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Role</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={item.role}
                        onChange={(e) => updateMembership(item.id, { role: e.target.value })}
                        placeholder="e.g. Member"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Year</Label>
                      <Input
                        className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={item.year}
                        onChange={(e) => updateMembership(item.id, { year: e.target.value })}
                        placeholder="2021"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                      onClick={() => removeMembership(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {currentSection === "languages" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Languages</h2>
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
          )}

          {currentSection === "links" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Links</h2>
              <Textarea
                className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                rows={4}
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
                placeholder={"https://linkedin.com/in/yourname\nhttps://scholar.google.com/..."}
              />
            </div>
          )}

          {currentSection === "references" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">References</h2>
              <Textarea
                className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                rows={4}
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
          )}

          {currentSection === "finish" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
              <DownloadGate
                isSubscribed={isSubscribed}
                onDownload={handlePrint || (() => {})}
                onDownloadTxt={() => downloadCvTxt({ template, data })}
                onDownloadDoc={() => downloadCvDoc({ template, data })}
              />
              <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Save Draft</p>
                <p className="mt-2 text-sm text-white/70">
                  Save this CV to your account so you can continue later.
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
            <CvPreview ref={resumeRef} />
          </div>
          {!data.summary && data.experience.length === 0 && data.education.length === 0 && (
            <div className="mt-4 rounded-lg border border-[#111827]/10 bg-white px-4 py-3 text-xs text-[#111827]/70">
              Start filling your details on the left. This preview is already using your selected template.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
