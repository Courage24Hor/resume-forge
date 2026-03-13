export type CvAudience = "academic" | "professional";
export type CvTemplateVariant = "classic" | "sidebar" | "minimal" | "executive";
export type CvSection =
  | "info"
  | "summary"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "certifications"
  | "publications"
  | "research"
  | "teaching"
  | "awards"
  | "memberships"
  | "languages"
  | "links"
  | "references";

export type CvTemplateMeta = {
  id: string;
  name: string;
  focus: string;
  headshot: boolean;
  columns: 1 | 2;
  variant: CvTemplateVariant;
  audience: CvAudience;
  sections: CvSection[];
  tags: string[];
  thumb?: string;
};

const academicSections: CvSection[] = [
  "info",
  "summary",
  "education",
  "research",
  "publications",
  "teaching",
  "experience",
  "projects",
  "awards",
  "certifications",
  "skills",
  "memberships",
  "languages",
  "links",
  "references",
];

const professionalSections: CvSection[] = [
  "info",
  "summary",
  "experience",
  "education",
  "projects",
  "certifications",
  "skills",
  "awards",
  "memberships",
  "languages",
  "links",
  "references",
];

export const cvTemplates: CvTemplateMeta[] = [
  {
    id: "academic-classic",
    name: "Academic Classic",
    focus: "Research & publications",
    headshot: false,
    columns: 1,
    variant: "classic",
    audience: "academic",
    sections: academicSections,
    tags: ["Academic", "Research"],
    thumb: "/template-thumbs-two/CVs/CV_Style_1.png",
  },
  {
    id: "academic-sidebar",
    name: "Academic Sidebar",
    focus: "Education-forward layout",
    headshot: false,
    columns: 2,
    variant: "sidebar",
    audience: "academic",
    sections: academicSections,
    tags: ["Academic", "Structured"],
    thumb: "/template-thumbs-two/CVs/CV_Style_6.png",
  },
  {
    id: "academic-minimal",
    name: "Academic Minimal",
    focus: "Clean, text-forward",
    headshot: false,
    columns: 1,
    variant: "minimal",
    audience: "academic",
    sections: academicSections,
    tags: ["Academic", "Minimal"],
    thumb: "/template-thumbs-two/CVs/CV_Style_12.png",
  },
  {
    id: "academic-executive",
    name: "Academic Executive",
    focus: "Senior faculty profiles",
    headshot: false,
    columns: 2,
    variant: "executive",
    audience: "academic",
    sections: academicSections,
    tags: ["Academic", "Senior"],
    thumb: "/template-thumbs-two/CVs/CV_Style_18.png",
  },
  {
    id: "pro-classic",
    name: "Professional Classic",
    focus: "Balanced career history",
    headshot: true,
    columns: 1,
    variant: "classic",
    audience: "professional",
    sections: professionalSections,
    tags: ["Professional", "General"],
    thumb: "/template-thumbs-two/CVs/CV_Style_2.png",
  },
  {
    id: "pro-sidebar",
    name: "Professional Sidebar",
    focus: "Fast scanning layout",
    headshot: true,
    columns: 2,
    variant: "sidebar",
    audience: "professional",
    sections: professionalSections,
    tags: ["Professional", "Two-column"],
    thumb: "/template-thumbs-two/CVs/CV_Style_7.png",
  },
  {
    id: "pro-minimal",
    name: "Professional Minimal",
    focus: "Clean and modern",
    headshot: false,
    columns: 1,
    variant: "minimal",
    audience: "professional",
    sections: professionalSections,
    tags: ["Professional", "Minimal"],
    thumb: "/template-thumbs-two/CVs/CV_Style_14.png",
  },
  {
    id: "pro-executive",
    name: "Professional Executive",
    focus: "Leadership profiles",
    headshot: true,
    columns: 2,
    variant: "executive",
    audience: "professional",
    sections: professionalSections,
    tags: ["Professional", "Leadership"],
    thumb: "/template-thumbs-two/CVs/CV_Style_20.png",
  },
];
