import type {
  CvCertification,
  CvEducation,
  CvExperience,
  CvProject,
  CvPublication,
  CvResearch,
  CvTeaching,
  CvAward,
  CvMembership,
} from "@/hooks/use-cv-store";

export type ImportedCvData = {
  heading?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  summary?: string;
  skills?: string[];
  experience?: CvExperience[];
  education?: CvEducation[];
  projects?: CvProject[];
  certifications?: CvCertification[];
  publications?: CvPublication[];
  research?: CvResearch[];
  teaching?: CvTeaching[];
  awards?: CvAward[];
  memberships?: CvMembership[];
};

function makeId() {
  return Math.random().toString(36).slice(2, 11);
}

function detectSection(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("education")) return "education";
  if (lower.includes("experience")) return "experience";
  if (lower.includes("skills")) return "skills";
  if (lower.includes("summary") || lower.includes("profile")) return "summary";
  if (lower.includes("project")) return "projects";
  if (lower.includes("certification")) return "certifications";
  if (lower.includes("publication")) return "publications";
  if (lower.includes("research")) return "research";
  if (lower.includes("teaching")) return "teaching";
  if (lower.includes("award") || lower.includes("honor")) return "awards";
  if (lower.includes("membership") || lower.includes("association")) return "memberships";
  return null;
}

export function parseCvText(raw: string): ImportedCvData {
  const text = raw.replace(/\r/g, "");
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const data: ImportedCvData = {};

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
    publications: [],
    research: [],
    teaching: [],
    awards: [],
    memberships: [],
  };

  for (const line of lines.slice(1)) {
    const possible = detectSection(line);
    if (possible && line.length < 40) {
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
      .slice(0, 30);
  }
  if (sections.experience.length) {
    data.experience = sections.experience.slice(0, 5).map((line) => ({
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
    data.education = sections.education.slice(0, 5).map((line) => ({
      id: makeId(),
      school: line,
      degree: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    }));
  }
  if (sections.projects.length) {
    data.projects = sections.projects.slice(0, 4).map((line) => ({
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
    data.certifications = sections.certifications.slice(0, 4).map((line) => ({
      id: makeId(),
      name: line,
      issuer: "",
      date: "",
    }));
  }
  if (sections.publications.length) {
    data.publications = sections.publications.slice(0, 4).map((line) => ({
      id: makeId(),
      title: line,
      venue: "",
      year: "",
      link: "",
    }));
  }
  if (sections.research.length) {
    data.research = sections.research.slice(0, 4).map((line) => ({
      id: makeId(),
      title: line,
      description: "",
      year: "",
    }));
  }
  if (sections.teaching.length) {
    data.teaching = sections.teaching.slice(0, 4).map((line) => ({
      id: makeId(),
      course: line,
      institution: "",
      term: "",
    }));
  }
  if (sections.awards.length) {
    data.awards = sections.awards.slice(0, 4).map((line) => ({
      id: makeId(),
      name: line,
      issuer: "",
      year: "",
    }));
  }
  if (sections.memberships.length) {
    data.memberships = sections.memberships.slice(0, 4).map((line) => ({
      id: makeId(),
      name: line,
      role: "",
      year: "",
    }));
  }

  return data;
}
