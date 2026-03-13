import { cvTemplates, type CvSection } from "@/lib/cv-templates";
import type { useCvStore } from "@/hooks/use-cv-store";

type CvState = ReturnType<typeof useCvStore.getState>;

export type CvExportBlock = {
  key: CvSection | "summary";
  title: string;
  lines: string[];
};

function line(parts: Array<string | undefined | null>) {
  return parts.filter(Boolean).join(" - ");
}

export function buildOrderedCvBlocks(state: Pick<CvState, "template" | "data">): CvExportBlock[] {
  const selected = state.template.id
    ? cvTemplates.find((template) => template.id === state.template.id)
    : undefined;
  const sections: Array<CvSection | "summary"> = [
    "info",
    "summary",
    ...(selected?.sections ?? ["experience", "education", "skills"]),
  ];
  const unique = Array.from(new Set(sections));

  return unique
    .map((section): CvExportBlock | null => {
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
      if (section === "certifications") {
        const lines = state.data.certifications
          .map((item) => line([item.name, item.issuer, item.date]))
          .filter(Boolean) as string[];
        return lines.length ? { key: "certifications", title: "Certifications", lines } : null;
      }
      if (section === "publications") {
        const lines = state.data.publications
          .map((item) => line([item.title, item.venue, item.year, item.link]))
          .filter(Boolean) as string[];
        return lines.length ? { key: "publications", title: "Publications", lines } : null;
      }
      if (section === "research") {
        const lines = state.data.research
          .map((item) => line([item.title, item.description, item.year]))
          .filter(Boolean) as string[];
        return lines.length ? { key: "research", title: "Research", lines } : null;
      }
      if (section === "teaching") {
        const lines = state.data.teaching
          .map((item) => line([item.course, item.institution, item.term]))
          .filter(Boolean) as string[];
        return lines.length ? { key: "teaching", title: "Teaching", lines } : null;
      }
      if (section === "awards") {
        const lines = state.data.awards
          .map((item) => line([item.name, item.issuer, item.year]))
          .filter(Boolean) as string[];
        return lines.length ? { key: "awards", title: "Awards", lines } : null;
      }
      if (section === "memberships") {
        const lines = state.data.memberships
          .map((item) => line([item.name, item.role, item.year]))
          .filter(Boolean) as string[];
        return lines.length ? { key: "memberships", title: "Memberships", lines } : null;
      }
      if (section === "languages") {
        return state.data.languages.length
          ? { key: "languages", title: "Languages", lines: [state.data.languages.join(", ")] }
          : null;
      }
      if (section === "links") {
        return state.data.links.length
          ? { key: "links", title: "Links", lines: state.data.links }
          : null;
      }
      if (section === "references") {
        return state.data.references.length
          ? { key: "references", title: "References", lines: state.data.references }
          : null;
      }
      return null;
    })
    .filter(Boolean) as CvExportBlock[];
}
