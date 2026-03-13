"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { cvTemplates, type CvAudience, type CvTemplateMeta } from "@/lib/cv-templates";
import { templateColorOptions } from "@/lib/templates";
import { useAuthUser } from "@/hooks/use-auth-user";
import { AuthActions } from "@/components/auth-actions";

function CvTemplateMiniPreview({
  variant,
  columns,
  headshot,
  accent,
}: {
  variant: CvTemplateMeta["variant"];
  columns: 1 | 2;
  headshot: boolean;
  accent: string;
}) {
  const textCls = "text-[8px] leading-none text-[#111827]/70";

  if (variant === "sidebar") {
    return (
      <div className="h-64 rounded-xl border border-[#111827]/10 bg-white p-3">
        <div className="grid h-full grid-cols-[0.38fr_0.62fr] gap-3">
          <div className="rounded-md bg-[#f3f4f6] p-2">
            {headshot && <div className="h-7 w-7 rounded-full border border-[#111827]/15 bg-white" />}
            <p className={`${textCls} mt-2 font-semibold`}>Ama Boateng</p>
            <p className={textCls}>Research Fellow</p>
            <div className="mt-2 h-1.5 w-10/12 rounded" style={{ backgroundColor: `${accent}66` }} />
            <div className="mt-1 h-1.5 w-8/12 rounded bg-[#111827]/12" />
          </div>
          <div className="space-y-2">
            <p className={`${textCls} font-semibold uppercase`} style={{ color: accent }}>Summary</p>
            <p className={textCls}>Academic CV focused on research and publications.</p>
            <p className={`${textCls} pt-1 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
            <p className={textCls}>Lecturer · University of Ghana</p>
            <p className={`${textCls} pt-1 font-semibold uppercase`} style={{ color: accent }}>Publications</p>
            <div className="h-1.5 w-11/12 rounded bg-[#111827]/12" />
            <div className="h-1.5 w-10/12 rounded bg-[#111827]/12" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 rounded-xl border border-[#111827]/10 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#111827]">Kwame Owusu</p>
          <p className="text-[8px] text-[#111827]/70">Professional CV</p>
        </div>
        {headshot && <div className="h-8 w-8 rounded-full border border-[#111827]/15 bg-[#f3f4f6]" />}
      </div>
      <div className="mt-3 h-[1px] w-full" style={{ backgroundColor: `${accent}99` }} />
      <div className={columns === 2 ? "mt-3 grid grid-cols-[0.62fr_0.38fr] gap-3" : "mt-3 space-y-3"}>
        <div className="space-y-2">
          <p className={`${textCls} font-semibold uppercase`} style={{ color: accent }}>Summary</p>
          <p className={textCls}>Structured CV with career highlights and skills.</p>
          <p className={`${textCls} pt-1 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
          <p className={textCls}>Operations Lead · MetroServe</p>
          <p className={`${textCls} pt-1 font-semibold uppercase`} style={{ color: accent }}>Education</p>
          <div className="h-1.5 w-10/12 rounded bg-[#111827]/12" />
        </div>
        {columns === 2 && (
          <div className="space-y-2">
            <p className={`${textCls} font-semibold uppercase`} style={{ color: accent }}>Skills</p>
            <div className="flex flex-wrap gap-1">
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Research</span>
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px] text-[#111827]/70">Strategy</span>
            </div>
            <p className={`${textCls} pt-1 font-semibold uppercase`} style={{ color: accent }}>Awards</p>
            <div className="h-1.5 w-9/12 rounded bg-[#111827]/12" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CvStartPage() {
  const router = useRouter();
  const { user, loading } = useAuthUser();
  const tier = (user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const [audience, setAudience] = useState<CvAudience>("professional");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [colorSelections, setColorSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries(cvTemplates.map((template) => [template.id, templateColorOptions[0].value]))
  );

  const filtered = useMemo(
    () => cvTemplates.filter((template) => template.audience === audience),
    [audience]
  );

  const handleSelectTemplate = (template: CvTemplateMeta) => {
    setSelectedTemplate(template.id);
    const payload = {
      id: template.id,
      color: colorSelections[template.id],
      columns: template.columns,
      headshot: template.headshot,
      variant: template.variant,
    };
    localStorage.setItem("elevateCvCvTemplate", JSON.stringify(payload));
    localStorage.setItem("elevateCvCvProfile", JSON.stringify({ audience }));
    router.push("/cv/builder");
  };

  const handleUpload = () => {
    localStorage.setItem("elevateCvCvProfile", JSON.stringify({ audience }));
    router.push("/cv/upload");
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

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">CV Builder</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white lg:text-5xl">
              Choose a CV track and a layout style.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/72">
              Academic CVs highlight research and publications. Professional CVs focus on career progression.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setAudience("professional")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              audience === "professional"
                ? "border-[#fb923c]/70 bg-white/10 text-white"
                : "border-white/15 bg-white/5 text-white/70 hover:border-[#fb923c]/60"
            }`}
          >
            Professional CV
          </button>
          <button
            type="button"
            onClick={() => setAudience("academic")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              audience === "academic"
                ? "border-[#fb923c]/70 bg-white/10 text-white"
                : "border-white/15 bg-white/5 text-white/70 hover:border-[#fb923c]/60"
            }`}
          >
            Academic CV
          </button>
          <Button
            variant="outline"
            className="h-9 border-white/20 bg-white/5 text-white hover:bg-white/10"
            onClick={handleUpload}
          >
            Upload Existing CV
          </Button>
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((template, index) => {
            const selected = selectedTemplate === template.id;
            const accent = colorSelections[template.id];
            return (
              <div
                key={template.id}
                className={`rounded-2xl border ${selected ? "border-[#fb923c]/70" : "border-white/15"} bg-white/5 p-4`}
              >
                <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                  <CvTemplateMiniPreview
                    variant={template.variant}
                    columns={template.columns}
                    headshot={template.headshot}
                    accent={accent}
                  />
                </div>
                <div className="mt-4">
                  <p className="text-base font-semibold text-white">{template.name}</p>
                  <p className="text-sm text-white/70">{template.focus}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
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
                      className={`h-5 w-5 rounded-full border ${accent === option.value ? "border-white" : "border-white/40"}`}
                      style={{ backgroundColor: option.value }}
                      onClick={() =>
                        setColorSelections((prev) => ({ ...prev, [template.id]: option.value }))
                      }
                    />
                  ))}
                </div>
                <div className="mt-4">
                  <Button
                    className={`${selected ? "bg-[#f97316] text-white" : "bg-white/10 text-white hover:bg-white/15"} h-10 w-full`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    Use This Template
                  </Button>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
