import type { ResumeSection } from "@/lib/templates";
import { templates } from "@/lib/templates";
import type { useResumeStore } from "@/hooks/use-resume-store";

type ResumeState = ReturnType<typeof useResumeStore.getState>;

export type ExportBlock = {
  key: ResumeSection | "summary" | "languages" | "links" | "references";
  title: string;
  lines: string[];
};

function line(parts: Array<string | undefined | null>) {
  return parts.filter(Boolean).join(" - ");
}

export function buildOrderedExportBlocks(state: Pick<ResumeState, "template" | "data">): ExportBlock[] {
  const selectedTemplate = state.template.id
    ? templates.find((template) => template.id === state.template.id)
    : undefined;
  const sections: Array<ResumeSection | "summary"> = ["info", "summary", ...(selectedTemplate?.sections ?? ["experience", "education", "skills"])];
  const unique = Array.from(new Set(sections));

  return unique
    .map((section): ExportBlock | null => {
      if (section === "info") {
        const h = state.data.heading;
        const lines = [
          `${h.firstName} ${h.lastName}`.trim(),
          line([h.email, h.phone]),
          line([h.city, h.country, h.postcode]),
        ].filter((item) => item && item.trim().length > 0) as string[];
        return lines.length ? { key: "info", title: "Contact Information", lines } : null;
      }
      if (section === "summary") {
        return state.data.summary.trim().length
          ? { key: "summary", title: "Professional Summary", lines: [state.data.summary.trim()] }
          : null;
      }
      if (section === "experience") {
        const lines = state.data.experience.flatMap((item) => [
          line([item.role, item.company]),
          line([item.startDate, item.isCurrent ? "Present" : item.endDate]),
          item.description,
        ]).filter(Boolean) as string[];
        return lines.length ? { key: "experience", title: "Experience", lines } : null;
      }
      if (section === "education") {
        const lines = state.data.education.flatMap((item) => [
          line([item.school, item.degree]),
          line([item.startDate, item.isCurrent ? "Present" : item.endDate]),
        ]).filter(Boolean) as string[];
        return lines.length ? { key: "education", title: "Education", lines } : null;
      }
      if (section === "projects") {
        const lines = state.data.projects.flatMap((item) => [
          line([item.name, item.role]),
          line([item.startDate, item.isCurrent ? "Present" : item.endDate]),
          item.description,
        ]).filter(Boolean) as string[];
        return lines.length ? { key: "projects", title: "Projects", lines } : null;
      }
      if (section === "skills") {
        const lines: string[] = [];
        if (state.data.skills.length) {
          lines.push(state.data.skills.join(", "));
        }
        return lines.length ? { key: "skills", title: "Skills", lines } : null;
      }
      if (section === "highlights") {
        return state.data.highlights.length
          ? { key: "highlights", title: "Highlights", lines: state.data.highlights }
          : null;
      }
      if (section === "certifications") {
        const lines = state.data.certifications.map((item) => line([item.name, item.issuer, item.date])).filter(Boolean) as string[];
        return lines.length ? { key: "certifications", title: "Certifications", lines } : null;
      }
      return null;
    })
    .filter(Boolean) as ExportBlock[];
}

export function appendOptionalExportBlocks(
  blocks: ExportBlock[],
  state: Pick<ResumeState, "data">
) {
  const next = [...blocks];
  if (state.data.languages.length) {
    next.push({ key: "languages", title: "Languages", lines: [state.data.languages.join(", ")] });
  }
  if (state.data.links.length) {
    next.push({ key: "links", title: "Links", lines: state.data.links });
  }
  if (state.data.references.length) {
    next.push({ key: "references", title: "References", lines: state.data.references });
  }
  return next;
}
