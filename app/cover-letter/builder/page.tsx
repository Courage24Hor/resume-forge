"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/hooks/use-auth-user";
import { AuthActions } from "@/components/auth-actions";
import { useReactToPrint } from "react-to-print";
import { ChevronLeft, ChevronRight, FileText, Mail, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DownloadGate } from "@/components/download-gate";
import { CoverLetterPreview } from "@/components/cover-letter-preview";
import { AiUsageMeter } from "@/components/ai-usage-meter";
import { useCoverLetterStore } from "@/hooks/use-cover-letter-store";
import { templateColorOptions } from "@/lib/templates";
import { downloadCoverLetterDoc, downloadCoverLetterTxt } from "@/lib/cover-letter-export";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, key: "sender", label: "Your Info", icon: User },
  { id: 2, key: "recipient", label: "Recipient", icon: Building2 },
  { id: 3, key: "content", label: "Content", icon: FileText },
  { id: 4, key: "finish", label: "Finish", icon: Mail },
] as const;

const tonePresets = [
  {
    id: "professional",
    label: "Professional",
    body:
      "I am excited to apply for this role. With a strong background in [your field], I have delivered measurable results and collaborated across teams to drive impact. In my recent role, I improved [metric] by [value]% through [action], and I am eager to bring the same focus to your team.",
  },
  {
    id: "confident",
    label: "Bold",
    body:
      "I am applying for this role because I consistently deliver outcomes. I have led projects that increased [metric] by [value]% and improved [process] through [tool/approach]. I thrive in fast-moving teams and I am ready to contribute from day one.",
  },
  {
    id: "warm",
    label: "Warm",
    body:
      "I am excited to apply for this role. I care about doing meaningful work and I bring a steady mix of collaboration, ownership, and results. In my recent role, I supported [team/project] and improved [metric] by [value]%, and I would love to do the same at your organization.",
  },
  {
    id: "creative",
    label: "Creative",
    body:
      "I'm drawn to roles where ideas become real outcomes. I've taken concepts from draft to delivery, improving [metric] by [value]% and creating clear, user-centered solutions. I'd love to bring that same energy and craft to your team.",
  },
  {
    id: "minimal",
    label: "Minimal",
    body:
      "I'm applying for this role because my experience matches what you need. I've improved [metric] by [value]% through [action] and I can contribute immediately with clear, reliable execution.",
  },
  {
    id: "academic",
    label: "Academic",
    body:
      "My background combines rigorous research with practical impact. I have led studies on [topic], contributed to [publication/venue], and delivered [result], which aligns closely with the goals of this role.",
  },
];

export default function CoverLetterBuilderPage() {
  const { data, step, setStep, accent, setAccent, updateSender, updateRecipient, updateField, reset, loadDraft } =
    useCoverLetterStore();
  const { user, loading } = useAuthUser();
  const tier = (user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const previewRef = useRef<HTMLDivElement>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeMessage, setOptimizeMessage] = useState<string>("");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [draftsLoading, setDraftsLoading] = useState(false);
  const [draftsError, setDraftsError] = useState<string>("");
  const [drafts, setDrafts] = useState<
    { id: string; title: string | null; updated_at: string | null; created_at: string | null; type: string }[]
  >([]);

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
      const items = (payload?.documents ?? []).filter((doc: any) => doc.type === "cover_letter");
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
        accent: doc.template?.accent ?? doc.accent ?? undefined,
      });
      setDraftsOpen(false);
    } catch {
      setDraftsError("Unable to load draft.");
    }
  };

  useEffect(() => {
    if (step < 1) setStep(1);
    if (step > steps.length) setStep(steps.length);
  }, [step, setStep]);

  const current = steps[Math.max(0, Math.min(step - 1, steps.length - 1))];
  const isSubscribed =
    (user?.user_metadata as { tier?: string } | undefined)?.tier === "PREMIUM_14_DAY" ||
    (user?.user_metadata as { tier?: string } | undefined)?.tier === "ANNUAL";

  const handlePrint = useReactToPrint({
    content: () => previewRef.current,
    documentTitle: `CoverLetter_${Date.now()}`,
  });

  const senderComplete = useMemo(
    () => data.sender.fullName.trim().length > 0 && data.sender.email.trim().length > 0,
    [data.sender.email, data.sender.fullName]
  );

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[#0a0f1c] text-[#e8edf8]">
      <header className="fixed top-0 left-0 right-0 bg-[#0a0f1c]/90 border-b border-white/10 z-50 h-16 flex items-center px-6 backdrop-blur-xl">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/cover-letter-templates" className="text-xs font-semibold text-white/70 hover:text-white">
              Go Back
            </Link>
            <span className="text-xl font-black text-white">
              Elevate<span className="text-[#fb923c]">CV</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-white/60 hover:text-white"
            >
              Reset Draft
            </button>
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
                {item.label}
              </div>
            ))}
            </nav>
          </div>
          <AuthActions userEmail={user?.email} loading={loading} tier={tier} />
        </div>
      </header>

      <main className="flex-1 container mx-auto grid grid-cols-1 gap-8 p-6 lg:grid-cols-[0.82fr_1.18fr] lg:p-10">
        <div className="px-1 md:px-2">
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Saved drafts</p>
                <p className="mt-1 text-sm text-white/70">Load a previous cover letter draft.</p>
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
                        Cover
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
                <span className="text-[10px] font-bold">{item.label}</span>
              </button>
            ))}
          </div>

          {current.key === "sender" && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-white">Your details</p>
                <p className="mt-1 text-sm text-white/70">We suggest including your email and phone number.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-white/80">Full Name</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.sender.fullName}
                    onChange={(e) => updateSender({ fullName: e.target.value })}
                    placeholder="Akua Mensah"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Email</Label>
                  <Input
                    type="email"
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.sender.email}
                    onChange={(e) => updateSender({ email: e.target.value })}
                    placeholder="akua@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Phone</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.sender.phone}
                    onChange={(e) => updateSender({ phone: e.target.value })}
                    placeholder="32 202 3456"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-white/80">Location</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.sender.location}
                    onChange={(e) => updateSender({ location: e.target.value })}
                    placeholder="Accra, Ghana"
                  />
                </div>
              </div>
              {!senderComplete && (
                <div className="rounded-xl border border-[#fb923c]/40 bg-[#1f2937] px-4 py-3 text-xs text-white/80">
                  Add your name and email to unlock the strongest preview and export.
                </div>
              )}
            </div>
          )}

          {current.key === "recipient" && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-white">Recipient details</p>
                <p className="mt-1 text-sm text-white/70">Optional but recommended when you have them.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Recipient Name</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.recipient.name}
                    onChange={(e) => updateRecipient({ name: e.target.value })}
                    placeholder="Mr. Kofi Mensah"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Recipient Title</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.recipient.title}
                    onChange={(e) => updateRecipient({ title: e.target.value })}
                    placeholder="Hiring Manager"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-white/80">Company</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.recipient.company}
                    onChange={(e) => updateRecipient({ company: e.target.value })}
                    placeholder="Example Company"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-white/80">Address</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.recipient.address}
                    onChange={(e) => updateRecipient({ address: e.target.value })}
                    placeholder="Company address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Date</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.date}
                    onChange={(e) => updateField({ date: e.target.value })}
                    placeholder="March 11, 2026"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Subject</Label>
                  <Input
                    className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                    value={data.subject}
                    onChange={(e) => updateField({ subject: e.target.value })}
                    placeholder="Application for Marketing Manager"
                  />
                </div>
              </div>
            </div>
          )}

          {current.key === "content" && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-white">Main content</p>
                <p className="mt-1 text-sm text-white/70">Keep it concise, tailored, and impact-focused.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Tone Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {tonePresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => updateField({ body: preset.body })}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Opening</Label>
                <Input
                  className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                  value={data.opening}
                  onChange={(e) => updateField({ opening: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Label className="text-white/80">Body</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                    disabled={optimizing}
                    onClick={async () => {
                      setOptimizeMessage("");
                      setOptimizing(true);
                      try {
                        const res = await fetch("/api/cover-letter-optimize", {
                          method: "POST",
                          body: JSON.stringify({
                            body: data.body,
                            role: data.subject,
                            company: data.recipient.company,
                          }),
                        });
                        const payload = await res.json();
                        if (!res.ok) {
                          setOptimizeMessage(payload?.error ?? "Optimization unavailable right now.");
                        } else if (payload?.optimized) {
                          updateField({ body: payload.optimized });
                        }
                      } catch {
                        setOptimizeMessage("Optimization unavailable right now.");
                      } finally {
                        setOptimizing(false);
                      }
                    }}
                  >
                    {optimizing ? "Optimizing..." : "Optimize with AI"}
                  </Button>
                </div>
                <AiUsageMeter />
                <Textarea
                  className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                  rows={8}
                  value={data.body}
                  onChange={(e) => updateField({ body: e.target.value })}
                />
                {optimizeMessage && (
                  <p className="text-xs text-white/60">{optimizeMessage}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Closing</Label>
                <Textarea
                  className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                  rows={3}
                  value={data.closing}
                  onChange={(e) => updateField({ closing: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Signature</Label>
                <Input
                  className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                  value={data.signature}
                  onChange={(e) => updateField({ signature: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Accent Color</Label>
                <div className="flex flex-wrap gap-2">
                  {templateColorOptions.map((option) => (
                    <button
                      key={option.name}
                      type="button"
                      aria-label={`Use ${option.name}`}
                      className={`h-6 w-6 rounded-full border ${accent === option.value ? "border-white" : "border-white/40"}`}
                      style={{ backgroundColor: option.value }}
                      onClick={() => setAccent(option.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {current.key === "finish" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
              <DownloadGate
                isSubscribed={isSubscribed}
                onDownload={handlePrint || (() => {})}
                onDownloadTxt={() => downloadCoverLetterTxt({ data })}
                onDownloadDoc={() => downloadCoverLetterDoc({ data })}
              />
              <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Save Draft</p>
                <p className="mt-2 text-sm text-white/70">
                  Save this cover letter to your account so you can continue later.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                    onClick={async () => {
                      setSaveMessage("");
                      const title = data.subject || "Cover Letter Draft";
                      const res = await fetch("/api/documents/save", {
                        method: "POST",
                        body: JSON.stringify({
                          type: "cover_letter",
                          title,
                          data,
                          template: { accent },
                        }),
                      });
                      const payload = await res.json();
                      if (!res.ok) {
                        setSaveMessage(payload?.error ?? "Unable to save draft.");
                        return;
                      }
                      setSaveMessage("Draft saved to your account.");
                    }}
                  >
                    Save Draft
                  </Button>
                  {saveMessage && <span className="text-xs text-white/60">{saveMessage}</span>}
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
              Next: {steps[Math.min(step, steps.length - 1)].label} <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="hidden lg:block sticky top-24 max-h-[84vh] overflow-y-auto rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.12)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[#111827]/60 font-semibold">Preview</p>
          <div className="mt-5 flex justify-center">
            <CoverLetterPreview ref={previewRef} />
          </div>
        </div>
      </main>
    </div>
  );
}
