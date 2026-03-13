import type { Certification, Education, Experience, Project } from "@/hooks/use-resume-store";

export type ImportedResumeData = {
  heading?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  summary?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  certifications?: Certification[];
};

function makeId() {
  return Math.random().toString(36).slice(2, 11);
}

function detectSection(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("experience")) return "experience";
  if (lower.includes("education")) return "education";
  if (lower.includes("skill")) return "skills";
  if (lower.includes("summary") || lower.includes("profile")) return "summary";
  if (lower.includes("project")) return "projects";
  if (lower.includes("certification")) return "certifications";
  return null;
}

export function parseResumeText(raw: string): ImportedResumeData {
  const text = raw.replace(/\r/g, "");
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const data: ImportedResumeData = {};

  if (lines.length > 0) {
    const nameParts = lines[0].split(/\s+/).filter(Boolean);
    if (nameParts.length > 0) {
      data.heading = {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
      };
    }
  }

  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const phone = text.match(/(\+?\d[\d\s-]{7,}\d)/)?.[0];
  if (!data.heading) data.heading = {};
  if (email) data.heading.email = email;
  if (phone) data.heading.phone = phone;

  let current: ReturnType<typeof detectSection> = null;
  const sections: Record<string, string[]> = {
    summary: [],
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };

  for (const line of lines.slice(1)) {
    const possible = detectSection(line);
    if (possible && line.length < 35) {
      current = possible;
      continue;
    }
    if (current) sections[current].push(line);
  }

  if (sections.summary.length) {
    data.summary = sections.summary.join(" ");
  }
  if (sections.skills.length) {
    data.skills = sections.skills
      .join(", ")
      .split(/,|·|\|/)
      .map((item) => item.trim())
      .filter((item) => item.length > 1)
      .slice(0, 20);
  }
  if (sections.experience.length) {
    data.experience = sections.experience.slice(0, 3).map((line) => ({
      id: makeId(),
      role: line,
      company: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    }));
  }
  if (sections.education.length) {
    data.education = sections.education.slice(0, 3).map((line) => ({
      id: makeId(),
      school: line,
      degree: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    }));
  }
  if (sections.projects.length) {
    data.projects = sections.projects.slice(0, 3).map((line) => ({
      id: makeId(),
      name: line,
      role: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    }));
  }
  if (sections.certifications.length) {
    data.certifications = sections.certifications.slice(0, 3).map((line) => ({
      id: makeId(),
      name: line,
      issuer: "",
      date: "",
    }));
  }

  return data;
}

