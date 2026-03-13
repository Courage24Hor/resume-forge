"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  templates,
  templateColorOptions,
  type TemplateMeta,
  type TemplateVariant,
} from "@/lib/templates";
import { SiteFooter } from "@/components/site-footer";
import { useAuthUser } from "@/hooks/use-auth-user";
import { AuthActions } from "@/components/auth-actions";

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
}: {
  variant: TemplateVariant;
  columns: 1 | 2;
  headshot: boolean;
  accent: string;
}) {
  const textCls = "text-[8px] leading-none text-[#111827]/70";

  if (variant === "sidebar") {
    return (
      <div className="h-40 rounded-xl border border-[#111827]/10 bg-white p-2.5">
        <div className="grid h-full grid-cols-[0.37fr_0.63fr] gap-2">
          <div className="rounded-md bg-[#f3f4f6] p-2">
            <div className="h-6 w-6 rounded-full border border-[#111827]/15 bg-white" />
            <p className={`${textCls} mt-1 font-semibold`}>Akua Mensah</p>
            <p className={textCls}>Student Nurse</p>
            <div className="mt-2 h-1.5 w-10/12 rounded bg-[#111827]/15" />
            <div className="mt-1 h-1.5 w-8/12 rounded bg-[#111827]/15" />
          </div>
          <div className="space-y-2 p-1">
            <p className={`${textCls} font-semibold uppercase`} style={{ color: accent }}>Professional Summary</p>
            <p className={textCls}>Patient-focused student with strong clinical rotation experience.</p>
            <p className={`${textCls} pt-1 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
            <p className={textCls}>Care Assistant - Sunrise Clinic (2024-Present)</p>
            <p className={textCls}>Volunteer - Regional Outreach (2023-2024)</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="h-40 rounded-xl border border-[#111827]/10 bg-white p-3">
        <p className="text-[9px] font-semibold text-[#111827]">Kojo Asante</p>
        <p className="text-[8px] text-[#111827]/70">Junior Data Analyst</p>
        <p className={`${textCls} mt-2 font-semibold uppercase`} style={{ color: accent }}>Summary</p>
        <p className={textCls}>Detail-oriented analyst improving report quality with Excel and SQL.</p>
        <p className={`${textCls} mt-2 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
        <p className={textCls}>Data Intern - Accra Finance Hub (2024-2025)</p>
        <div className="mt-2 flex gap-1">
          <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px]">Excel</span>
          <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px]">SQL</span>
          <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px]">Power BI</span>
        </div>
      </div>
    );
  }

  if (variant === "executive") {
    return (
      <div className="h-40 rounded-xl border border-[#111827]/10 bg-white p-3">
        <div className="h-1.5 w-full rounded" style={{ backgroundColor: `${accent}88` }} />
        <div className="mt-2 flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold text-[#111827]">Esi Owusu</p>
            <p className="text-[8px] text-[#111827]/70">Operations Lead</p>
          </div>
          {headshot && <div className="h-7 w-7 rounded-full border border-[#111827]/15 bg-[#f3f4f6]" />}
        </div>
        <p className={`${textCls} mt-2 font-semibold uppercase`} style={{ color: accent }}>Executive Profile</p>
        <p className={textCls}>Scaled service operations across 3 regions and reduced turnaround by 28%.</p>
        <p className={`${textCls} mt-2 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
        <p className={textCls}>Operations Manager - MetroServe (2021-Present)</p>
      </div>
    );
  }

  if (variant === "legacy") {
    return (
      <div className="h-40 rounded-xl border border-[#111827]/10 bg-white p-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold text-[#111827]">Yaw Dapaah</p>
            <p className="text-[8px] text-[#111827]/70">Business Operations Specialist</p>
          </div>
          {headshot && <div className="h-7 w-7 rounded-full border border-[#111827]/15 bg-[#f3f4f6]" />}
        </div>
        <div className="mt-2 h-[1px] w-full" style={{ backgroundColor: `${accent}99` }} />
        <p className={`${textCls} mt-2 font-semibold uppercase`} style={{ color: accent }}>Professional Summary</p>
        <p className={textCls}>Process-focused operator improving service speed and consistency.</p>
        <p className={`${textCls} mt-2 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
        <p className={textCls}>Operations Officer - Coastline Hub (2022-Present)</p>
      </div>
    );
  }

  return (
    <div className="h-40 rounded-xl border border-[#111827]/10 bg-white p-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-semibold text-[#111827]">Ama Boateng</p>
          <p className="text-[8px] text-[#111827]/70">Customer Success Associate</p>
        </div>
        {headshot && <div className="h-7 w-7 rounded-full border border-[#111827]/15 bg-[#f3f4f6]" />}
      </div>
      <div className="mt-2 h-[1px] w-full" style={{ backgroundColor: `${accent}99` }} />
      <div className={columns === 2 ? "mt-2 grid grid-cols-[0.62fr_0.38fr] gap-2" : "mt-2 space-y-2"}>
        <div>
          <p className={`${textCls} font-semibold uppercase`} style={{ color: accent }}>Professional Summary</p>
          <p className={textCls}>Support specialist improving retention through fast issue resolution.</p>
          <p className={`${textCls} pt-1 font-semibold uppercase`} style={{ color: accent }}>Experience</p>
          <p className={textCls}>Customer Associate - UniTel (2023-Present)</p>
        </div>
        {columns === 2 && (
          <div>
            <p className={`${textCls} font-semibold uppercase`} style={{ color: accent }}>Skills</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px]">CRM</span>
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px]">Excel</span>
              <span className="rounded bg-[#111827]/12 px-1.5 py-0.5 text-[7px]">Reports</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const { user, loading } = useAuthUser();
  const tier = (user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [colorSelections, setColorSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries(templates.map((template) => [template.id, templateColorOptions[0].value]))
  );
  const [filterHeadshotWith, setFilterHeadshotWith] = useState(false);
  const [filterHeadshotWithout, setFilterHeadshotWithout] = useState(false);
  const [filterOneColumn, setFilterOneColumn] = useState(false);
  const [filterTwoColumn, setFilterTwoColumn] = useState(false);

  const filteredTemplates = useMemo(() => {
    const applyHeadshot =
      (filterHeadshotWith && filterHeadshotWithout) || (!filterHeadshotWith && !filterHeadshotWithout);
    const applyColumns =
      (filterOneColumn && filterTwoColumn) || (!filterOneColumn && !filterTwoColumn);
    return templates.filter((template) => {
      const headshotMatch = applyHeadshot
        ? true
        : (filterHeadshotWith && template.headshot) || (filterHeadshotWithout && !template.headshot);
      const columnMatch = applyColumns
        ? true
        : (filterOneColumn && template.columns === 1) || (filterTwoColumn && template.columns === 2);
      return headshotMatch && columnMatch;
    });
  }, [filterHeadshotWith, filterHeadshotWithout, filterOneColumn, filterTwoColumn]);

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
    localStorage.setItem("ElevateCVTemplate", JSON.stringify(payload));
    window.location.href = "/start/mode";
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Templates</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white lg:text-5xl">
              Explore every ElevateCV template.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/72">
              Filter by layout or headshot and pick a style that fits your story.
            </p>
          </div>
          <Link href="/start">
            <Button className="h-11 bg-white/10 px-6 text-white hover:bg-white/15">Take the quiz</Button>
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

          <TemplateGrid
            title="All templates"
            templates={filteredTemplates}
            selectedTemplate={selectedTemplate}
            onUseTemplate={handleUseTemplate}
            colorSelections={colorSelections}
            onColorSelect={handleColorSelect}
          />
        </div>
        {filteredTemplates.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-white/25 bg-white/5 p-8 text-center">
            <p className="text-lg font-semibold text-white">No templates match these filters.</p>
            <p className="mt-2 text-sm text-white/65">Clear one or more filters to continue browsing templates.</p>
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
}: {
  title: string;
  templates: TemplateMeta[];
  selectedTemplate: string | null;
  onUseTemplate: (id: string) => void;
  colorSelections: Record<string, string>;
  onColorSelect: (id: string, color: string) => void;
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
                </div>
              </div>
              <div className="mt-4">
                <p className="text-base font-semibold text-white">{template.name}</p>
                <p className="text-sm text-white/70">{template.focus}</p>
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
