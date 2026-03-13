"use client";

import React, { forwardRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { templates } from "@/lib/templates";

type ResumeData = ReturnType<typeof useResumeStore.getState>["data"];

function sectionTitle(title: string, accent: string) {
  return (
    <h2
      className="mb-2 border-b border-[#d1d5db] pb-1 text-sm font-black uppercase tracking-widest"
      style={{ color: accent }}
    >
      {title}
    </h2>
  );
}

function period(startDate?: string, endDate?: string, isCurrent?: boolean) {
  return `${startDate || "Start"} - ${isCurrent ? "Present" : endDate || "End"}`;
}

function Header({
  data,
  accent,
  headshot,
}: {
  data: ResumeData;
  accent: string;
  headshot: boolean;
}) {
  const initials =
    (data.heading.firstName?.[0] || "") + (data.heading.lastName?.[0] || "");

  return (
    <header className="mb-6 border-b-2 pb-6" style={{ borderColor: accent }}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tight text-[#111827]">
            {data.heading.firstName || data.heading.lastName
              ? `${data.heading.firstName} ${data.heading.lastName}`.trim()
              : "Your Full Name"}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-[#4b5563]">
            {data.heading.email && (
              <div className="flex items-center gap-1">
                <Mail size={12} /> {data.heading.email}
              </div>
            )}
            {data.heading.phone && (
              <div className="flex items-center gap-1">
                <Phone size={12} /> {data.heading.phone}
              </div>
            )}
            {(data.heading.city || data.heading.country) && (
              <div className="flex items-center gap-1">
                <MapPin size={12} />{" "}
                {[data.heading.city, data.heading.country].filter(Boolean).join(", ")}
              </div>
            )}
            {data.heading.postcode && (
              <div className="flex items-center gap-1">{data.heading.postcode}</div>
            )}
          </div>
        </div>
        {headshot && (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#e5e7eb] bg-[#f3f4f6] text-lg font-bold text-[#9ca3af]">
            {initials || "AA"}
          </div>
        )}
      </div>
    </header>
  );
}

function Summary({ text }: { text: string }) {
  if (!text) return null;
  return <p className="text-sm italic leading-relaxed text-[#374151]">{text}</p>;
}

function ExperienceList({ data, accent }: { data: ResumeData; accent: string }) {
  return (
    <div className="space-y-6">
      {data.experience.length > 0 ? (
        data.experience.map((exp) => (
          <div key={exp.id}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-[#111827]">{exp.role || "Role"}</h3>
              <span className="text-xs font-bold uppercase" style={{ color: accent }}>
                {exp.company || "Company"}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#6b7280]">
              {period(exp.startDate, exp.endDate, exp.isCurrent)}
            </p>
            <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-[#374151]">
              {exp.description || "Add impact-focused bullets here."}
            </p>
          </div>
        ))
      ) : (
        <p className="text-xs text-[#9ca3af]">Add your work experience...</p>
      )}
    </div>
  );
}

function EducationList({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-4">
      {data.education.length > 0 ? (
        data.education.map((edu) => (
          <div key={edu.id}>
            <h3 className="text-sm font-bold text-[#111827]">{edu.school || "School Name"}</h3>
            <p className="text-xs text-[#4b5563]">{edu.degree || "Degree"}</p>
            <p className="mt-1 text-xs text-[#6b7280]">
              {period(edu.startDate, edu.endDate, edu.isCurrent)}
            </p>
          </div>
        ))
      ) : (
        <p className="text-xs text-[#9ca3af]">Add your education...</p>
      )}
    </div>
  );
}

function Skills({ data }: { data: ResumeData }) {
  if (data.skills.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {data.skills.map((skill, index) => (
        <span
          key={`${skill}-${index}`}
          className="rounded bg-[#f3f4f6] px-2 py-1 text-xs font-medium text-[#1f2937]"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function Languages({ data }: { data: ResumeData }) {
  if (data.languages.length === 0) return null;
  return <p className="text-xs text-[#374151]">{data.languages.join(", ")}</p>;
}

function Links({ data }: { data: ResumeData }) {
  if (data.links.length === 0) return null;
  return (
    <div className="space-y-1">
      {data.links.map((link, index) => (
        <p key={`${link}-${index}`} className="text-xs text-[#374151] break-all">{link}</p>
      ))}
    </div>
  );
}

function References({ data }: { data: ResumeData }) {
  if (data.references.length === 0) return null;
  return (
    <div className="space-y-1">
      {data.references.map((ref, index) => (
        <p key={`${ref}-${index}`} className="text-xs text-[#374151]">{ref}</p>
      ))}
    </div>
  );
}

function AdditionalDetails({ data, accent }: { data: ResumeData; accent: string }) {
  const hasAny = data.languages.length > 0 || data.links.length > 0 || data.references.length > 0;
  if (!hasAny) return null;
  return (
    <section>
      {sectionTitle("Additional Details", accent)}
      <div className="space-y-2">
        {data.languages.length > 0 && <Languages data={data} />}
        {data.links.length > 0 && <Links data={data} />}
        {data.references.length > 0 && <References data={data} />}
      </div>
    </section>
  );
}

function Highlights({ data }: { data: ResumeData }) {
  if (data.highlights.length === 0) return null;
  return (
    <ul className="space-y-1">
      {data.highlights.map((item, index) => (
        <li key={`${item}-${index}`} className="text-xs leading-relaxed text-[#374151]">
          - {item}
        </li>
      ))}
    </ul>
  );
}

function Certifications({ data }: { data: ResumeData }) {
  if (data.certifications.length === 0) return <p className="text-xs text-[#9ca3af]">Add certifications...</p>;
  return (
    <div className="space-y-2">
      {data.certifications.map((cert) => (
        <div key={cert.id}>
          <p className="text-xs font-bold text-[#111827]">{cert.name || "Certification"}</p>
          <p className="text-xs text-[#4b5563]">
            {[cert.issuer, cert.date].filter(Boolean).join(" - ")}
          </p>
        </div>
      ))}
    </div>
  );
}

function Projects({ data }: { data: ResumeData }) {
  if (data.projects.length === 0) return <p className="text-xs text-[#9ca3af]">Add projects...</p>;
  return (
    <div className="space-y-3">
      {data.projects.map((project) => (
        <div key={project.id}>
          <p className="text-xs font-bold text-[#111827]">{project.name || "Project"}</p>
          <p className="text-xs text-[#4b5563]">{project.role || "Role"}</p>
          <p className="text-xs text-[#6b7280]">
            {period(project.startDate, project.endDate, project.isCurrent)}
          </p>
          {project.description && <p className="mt-1 text-xs text-[#374151]">{project.description}</p>}
        </div>
      ))}
    </div>
  );
}

function ClassicLayout({
  data,
  accent,
  columns,
  audience,
  show,
}: {
  data: ResumeData;
  accent: string;
  columns: 1 | 2;
  audience: "student" | "professional";
  show: (section: string) => boolean;
}) {
  return (
    <div className={columns === 2 ? "grid grid-cols-[1.1fr_0.9fr] gap-8" : "space-y-8"}>
      <div className="space-y-8">
        {show("summary") && (
          <section>
            {sectionTitle("Professional Summary", accent)}
            <Summary text={data.summary} />
          </section>
        )}

        {audience === "student" && show("education") && (
          <section>
            {sectionTitle("Education", accent)}
            <EducationList data={data} />
          </section>
        )}

        {show("experience") && (
          <section>
            {sectionTitle("Experience", accent)}
            <ExperienceList data={data} accent={accent} />
          </section>
        )}
        {show("projects") && (
          <section>
            {sectionTitle("Projects", accent)}
            <Projects data={data} />
          </section>
        )}
      </div>

      <div className="space-y-8">
        {show("skills") && (
          <section>
            {sectionTitle("Skills", accent)}
            <Skills data={data} />
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            {sectionTitle("Languages", accent)}
            <Languages data={data} />
          </section>
        )}
        {data.links.length > 0 && (
          <section>
            {sectionTitle("Links", accent)}
            <Links data={data} />
          </section>
        )}
        {data.references.length > 0 && (
          <section>
            {sectionTitle("References", accent)}
            <References data={data} />
          </section>
        )}
        {show("highlights") && (
          <section>
            {sectionTitle("Highlights", accent)}
            <Highlights data={data} />
          </section>
        )}
        {show("certifications") && (
          <section>
            {sectionTitle("Certifications", accent)}
            <Certifications data={data} />
          </section>
        )}
        <AdditionalDetails data={data} accent={accent} />
        {audience !== "student" && show("education") && (
          <section>
            {sectionTitle("Education", accent)}
            <EducationList data={data} />
          </section>
        )}
      </div>
    </div>
  );
}

function SidebarLayout({
  data,
  accent,
  audience,
  show,
}: {
  data: ResumeData;
  accent: string;
  audience: "student" | "professional";
  show: (section: string) => boolean;
}) {
  return (
    <div className="grid grid-cols-[0.75fr_1.25fr] gap-8">
      <aside className="rounded-xl bg-[#f8fafc] p-4">
        {show("skills") && (
          <section className="mb-6">
            {sectionTitle("Skills", accent)}
            <Skills data={data} />
          </section>
        )}
        {show("highlights") && (
          <section className="mb-6">
            {sectionTitle("Highlights", accent)}
            <Highlights data={data} />
          </section>
        )}
        {show("education") && (
          <section>
            {sectionTitle("Education", accent)}
            <EducationList data={data} />
          </section>
        )}
      </aside>
      <div className="space-y-8">
        {show("summary") && (
          <section>
            {sectionTitle("Professional Summary", accent)}
            <Summary text={data.summary} />
          </section>
        )}
        {show("projects") && (
          <section>
            {sectionTitle("Projects", accent)}
            <Projects data={data} />
          </section>
        )}
        {show("experience") && (
          <section>
            {sectionTitle(audience === "student" && show("projects") ? "Projects & Experience" : "Experience", accent)}
            <ExperienceList data={data} accent={accent} />
          </section>
        )}
        {show("certifications") && (
          <section>
            {sectionTitle("Certifications", accent)}
            <Certifications data={data} />
          </section>
        )}
        <AdditionalDetails data={data} accent={accent} />
      </div>
    </div>
  );
}

function MinimalLayout({
  data,
  accent,
  audience,
  show,
}: {
  data: ResumeData;
  accent: string;
  audience: "student" | "professional";
  show: (section: string) => boolean;
}) {
  return (
    <div className="space-y-7">
      {show("summary") && (
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
            Summary
          </h2>
          <Summary text={data.summary} />
        </section>
      )}
      {show("education") && (
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
            Education
          </h2>
          <EducationList data={data} />
        </section>
      )}
      {show("experience") && (
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
            Experience
          </h2>
          <ExperienceList data={data} accent={accent} />
        </section>
      )}
      {show("projects") && (
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
            Projects
          </h2>
          <Projects data={data} />
        </section>
      )}
      {show("skills") && (
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
            Skills
          </h2>
          <Skills data={data} />
        </section>
      )}
      {show("highlights") && (
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
            Highlights
          </h2>
          <Highlights data={data} />
        </section>
      )}
      {show("certifications") && (
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
            Certifications
          </h2>
          <Certifications data={data} />
        </section>
      )}
      <AdditionalDetails data={data} accent={accent} />
    </div>
  );
}

function ExecutiveLayout({
  data,
  accent,
  show,
}: {
  data: ResumeData;
  accent: string;
  show: (section: string) => boolean;
}) {
  return (
    <div className="space-y-8">
      {show("summary") && (
        <section className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
            Executive Profile
          </h2>
          <Summary text={data.summary} />
        </section>
      )}
      {show("experience") && (
        <section>
          {sectionTitle("Professional Experience", accent)}
          <ExperienceList data={data} accent={accent} />
        </section>
      )}
      <div className="grid grid-cols-2 gap-8">
        {show("education") && (
          <section>
            {sectionTitle("Education", accent)}
            <EducationList data={data} />
          </section>
        )}
        {show("skills") && (
          <section>
            {sectionTitle("Core Skills", accent)}
            <Skills data={data} />
          </section>
        )}
      </div>
      {show("highlights") && (
        <section>
          {sectionTitle("Highlights", accent)}
          <Highlights data={data} />
        </section>
      )}
      {show("certifications") && (
        <section>
          {sectionTitle("Certifications", accent)}
          <Certifications data={data} />
        </section>
      )}
      <AdditionalDetails data={data} accent={accent} />
    </div>
  );
}

function LegacyLayout({
  data,
  accent,
  audience,
  show,
}: {
  data: ResumeData;
  accent: string;
  audience: "student" | "professional";
  show: (section: string) => boolean;
}) {
  return (
    <div className="grid grid-cols-[1.08fr_0.92fr] gap-8">
      <div className="space-y-8">
        {show("summary") && (
          <section>
            {sectionTitle("Professional Summary", accent)}
            <Summary text={data.summary} />
          </section>
        )}
        {show("experience") && (
          <section>
            {sectionTitle("Experience", accent)}
            <ExperienceList data={data} accent={accent} />
          </section>
        )}
        {show("projects") && (
          <section>
            {sectionTitle("Projects", accent)}
            <Projects data={data} />
          </section>
        )}
      </div>
      <div className="space-y-8">
        {show("skills") && (
          <section>
            {sectionTitle("Skills", accent)}
            <Skills data={data} />
          </section>
        )}
        {show("highlights") && (
          <section>
            {sectionTitle("Highlights", accent)}
            <Highlights data={data} />
          </section>
        )}
        {show("certifications") && (
          <section>
            {sectionTitle("Certifications", accent)}
            <Certifications data={data} />
          </section>
        )}
        {show("education") && (
          <section>
            {sectionTitle(audience === "student" ? "Education (Priority)" : "Education", accent)}
            <EducationList data={data} />
          </section>
        )}
        <AdditionalDetails data={data} accent={accent} />
      </div>
    </div>
  );
}

export const ResumePreview = forwardRef<HTMLDivElement>((props, ref) => {
  const { data, template, profile } = useResumeStore();
  const accent = template?.accent ?? "#0f766e";
  const columns = template?.columns ?? 1;
  const headshot = template?.headshot ?? false;
  const audience = profile?.audience ?? "professional";
  const variant = template?.variant ?? "classic";
  const selectedTemplate = template?.id ? templates.find((item) => item.id === template.id) : undefined;
  const active = new Set(selectedTemplate?.sections ?? ["info", "experience", "education", "skills"]);
  const show = (section: string) => {
    if (section === "summary") return true;
    return active.has(section as any);
  };

  return (
    <div
      ref={ref}
      className="min-h-[29.7cm] w-full bg-white p-12 text-[#1f2937] shadow-2xl"
      style={{
        aspectRatio: "1 / 1.414",
        fontFamily: '"Source Serif 4", "Cambria", "Georgia", serif',
        fontSize: "11pt",
      }}
      {...props}
    >
      <Header data={data} accent={accent} headshot={headshot} />

      {variant === "sidebar" ? (
        <SidebarLayout data={data} accent={accent} audience={audience} show={show} />
      ) : variant === "minimal" ? (
        <MinimalLayout data={data} accent={accent} audience={audience} show={show} />
      ) : variant === "executive" ? (
        <ExecutiveLayout data={data} accent={accent} show={show} />
      ) : variant === "legacy" ? (
        <LegacyLayout data={data} accent={accent} audience={audience} show={show} />
      ) : (
        <ClassicLayout data={data} accent={accent} columns={columns} audience={audience} show={show} />
      )}
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";
