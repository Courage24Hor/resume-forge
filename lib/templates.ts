export type ExperienceLevel = "none" | "lt3" | "3-5" | "5-10" | "10+";
export type AudienceType = "student" | "professional";
export type TemplateVariant = "classic" | "sidebar" | "minimal" | "executive" | "legacy";
export type ResumeSection =
  | "info"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "highlights"
  | "certifications";

export type TemplateMeta = {
  id: string;
  name: string;
  focus: string;
  headshot: boolean;
  columns: 1 | 2;
  variant: TemplateVariant;
  audience: AudienceType;
  exp: ExperienceLevel[];
  tags: string[];
  sections: ResumeSection[];
  thumb?: string;
};

export const templateColorOptions = [
  { name: "Coral", value: "#f97316" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Emerald", value: "#059669" },
  { name: "Plum", value: "#7c3aed" },
  { name: "Teal", value: "#0f766e" },
  { name: "Gold", value: "#b45309" },
];

const pdfThumbs = [
  "/template-thumbs/Resume_Accountant.png",
  "/template-thumbs/Resume_Administrative_Assistant.png",
  "/template-thumbs/Resume_Agronomist.png",
  "/template-thumbs/Resume_Audit_Associate.png",
  "/template-thumbs/Resume_Banker.png",
  "/template-thumbs/Resume_Chef.png",
  "/template-thumbs/Resume_Civil_Engineer.png",
  "/template-thumbs/Resume_Construction_Supervisor.png",
  "/template-thumbs/Resume_Content_Creator.png",
  "/template-thumbs/Resume_Customer_Service.png",
  "/template-thumbs/Resume_Data_Analyst.png",
  "/template-thumbs/Resume_Electrician.png",
  "/template-thumbs/Resume_Executive_Driver.png",
  "/template-thumbs/Resume_Fashion_Designer.png",
  "/template-thumbs/Resume_Financial_Analyst.png",
  "/template-thumbs/Resume_Front_Desk_Officer.png",
  "/template-thumbs/Resume_Geologist.png",
  "/template-thumbs/Resume_Graphic_Designer.png",
  "/template-thumbs/Resume_HR_Specialist.png",
  "/template-thumbs/Resume_Journalist.png",
  "/template-thumbs/Resume_Laboratory_Technician.png",
  "/template-thumbs/Resume_Lawyer.png",
  "/template-thumbs/Resume_Logistics_Officer.png",
  "/template-thumbs/Resume_Marketing_Manager.png",
  "/template-thumbs/Resume_Medical_Doctor.png",
  "/template-thumbs/Resume_NGO_Program_Officer.png",
  "/template-thumbs/Resume_Nurse.png",
  "/template-thumbs/Resume_Operations_Manager.png",
  "/template-thumbs/Resume_Pharmacist.png",
  "/template-thumbs/Resume_Procurement_Officer.png",
  "/template-thumbs/Resume_Project_Manager.png",
  "/template-thumbs/Resume_Receptionist.png",
  "/template-thumbs/Resume_Relationship_Manager.png",
  "/template-thumbs/Resume_Research_Assistant.png",
  "/template-thumbs/Resume_Sales_Executive.png",
  "/template-thumbs/Resume_Security_Officer.png",
  "/template-thumbs/Resume_Social_Media_Manager.png",
  "/template-thumbs/Resume_Software_Engineer.png",
  "/template-thumbs/Resume_Teacher.png",
  "/template-thumbs/Resume_Warehouse_Manager.png",
];

const baseTemplates: Omit<TemplateMeta, "variant" | "sections" | "thumb">[] = [
  { id: "accra-elite", name: "Accra Elite", focus: "Executive leadership", headshot: true, columns: 2, audience: "professional", exp: ["5-10", "10+"], tags: ["Executive", "Leadership"] },
  { id: "kumasi-grad", name: "Kumasi Grad", focus: "New graduate", headshot: false, columns: 1, audience: "student", exp: ["none", "lt3"], tags: ["Graduate", "Entry"] },
  { id: "takoradi-tech", name: "Takoradi Tech", focus: "Engineering & IT", headshot: false, columns: 2, audience: "professional", exp: ["3-5", "5-10", "10+"], tags: ["Tech", "Engineering"] },
  { id: "cape-creative", name: "Cape Coast Creative", focus: "Design & marketing", headshot: true, columns: 2, audience: "professional", exp: ["3-5", "5-10"], tags: ["Creative", "Marketing"] },
  { id: "tema-ops", name: "Tema Operations", focus: "Operations & logistics", headshot: false, columns: 1, audience: "professional", exp: ["3-5", "5-10", "10+"], tags: ["Operations"] },
  { id: "tamale-educator", name: "Tamale Educator", focus: "Teaching roles", headshot: true, columns: 1, audience: "professional", exp: ["3-5", "5-10"], tags: ["Education"] },
  { id: "ho-health", name: "Ho Health", focus: "Healthcare roles", headshot: true, columns: 2, audience: "professional", exp: ["3-5", "5-10", "10+"], tags: ["Healthcare"] },
  { id: "sunyani-finance", name: "Sunyani Finance", focus: "Banking & finance", headshot: false, columns: 2, audience: "professional", exp: ["5-10", "10+"], tags: ["Finance"] },
  { id: "bolga-admin", name: "Bolgatanga Admin", focus: "Admin & support", headshot: false, columns: 1, audience: "professional", exp: ["lt3", "3-5"], tags: ["Admin"] },
  { id: "sekondi-sales", name: "Sekondi Sales", focus: "Sales & account", headshot: true, columns: 1, audience: "professional", exp: ["3-5", "5-10"], tags: ["Sales"] },
  { id: "wa-trades", name: "Wa Trades", focus: "Construction & trades", headshot: false, columns: 1, audience: "professional", exp: ["lt3", "3-5"], tags: ["Trades"] },
  { id: "koforidua-analyst", name: "Koforidua Analyst", focus: "Analyst roles", headshot: false, columns: 2, audience: "professional", exp: ["3-5", "5-10"], tags: ["Analytics"] },
  { id: "accra-intern", name: "Accra Intern", focus: "Internship focused", headshot: false, columns: 1, audience: "student", exp: ["none", "lt3"], tags: ["Internship"] },
  { id: "legon-scholar", name: "Legon Scholar", focus: "Academia & research", headshot: true, columns: 2, audience: "student", exp: ["none", "lt3"], tags: ["Academia"] },
  { id: "knust-engineer", name: "KNUST Engineer", focus: "Student engineer", headshot: false, columns: 2, audience: "student", exp: ["lt3", "3-5"], tags: ["Engineering"] },
  { id: "ucg-educator", name: "UCG Educator", focus: "Student teacher", headshot: true, columns: 1, audience: "student", exp: ["none", "lt3"], tags: ["Education"] },
  { id: "upsa-business", name: "UPSA Business", focus: "Business student", headshot: false, columns: 1, audience: "student", exp: ["none", "lt3"], tags: ["Business"] },
  { id: "ghp-starter", name: "GHP Starter", focus: "Entry-level professional", headshot: false, columns: 1, audience: "professional", exp: ["lt3", "3-5"], tags: ["Entry"] },
  { id: "coastal-hospitality", name: "Coastal Hospitality", focus: "Hospitality & tourism", headshot: true, columns: 2, audience: "professional", exp: ["lt3", "3-5", "5-10"], tags: ["Hospitality"] },
  { id: "northern-projects", name: "Northern Projects", focus: "Project management", headshot: false, columns: 2, audience: "professional", exp: ["5-10", "10+"], tags: ["Project"] },
  { id: "eastern-data", name: "Eastern Data", focus: "Data & analytics", headshot: false, columns: 2, audience: "professional", exp: ["3-5", "5-10"], tags: ["Data"] },
  { id: "ashanti-med", name: "Ashanti Medical", focus: "Medical staff", headshot: true, columns: 1, audience: "professional", exp: ["3-5", "5-10", "10+"], tags: ["Medical"] },
  { id: "volta-creative", name: "Volta Creative", focus: "Creative services", headshot: true, columns: 2, audience: "professional", exp: ["3-5", "5-10"], tags: ["Creative"] },
  { id: "central-legal", name: "Central Legal", focus: "Legal support", headshot: false, columns: 1, audience: "professional", exp: ["3-5", "5-10"], tags: ["Legal"] },
  { id: "sahel-nurse", name: "Sahel Nurse", focus: "Nursing profiles", headshot: true, columns: 2, audience: "professional", exp: ["3-5", "5-10", "10+"], tags: ["Nursing"] },
  { id: "metro-product", name: "Metro Product", focus: "Product & strategy", headshot: false, columns: 2, audience: "professional", exp: ["5-10", "10+"], tags: ["Product"] },
  { id: "ridge-consulting", name: "Ridge Consulting", focus: "Consulting", headshot: false, columns: 1, audience: "professional", exp: ["5-10", "10+"], tags: ["Consulting"] },
  { id: "coastal-media", name: "Coastal Media", focus: "Media & comms", headshot: true, columns: 2, audience: "professional", exp: ["3-5", "5-10"], tags: ["Media"] },
  { id: "eastern-hr", name: "Eastern HR", focus: "HR & people ops", headshot: false, columns: 1, audience: "professional", exp: ["3-5", "5-10"], tags: ["HR"] },
  { id: "riverbank-fintech", name: "Riverbank Fintech", focus: "Fintech roles", headshot: false, columns: 2, audience: "professional", exp: ["3-5", "5-10"], tags: ["Fintech"] },
  { id: "goldfields-mining", name: "Goldfields Mining", focus: "Mining & energy", headshot: false, columns: 1, audience: "professional", exp: ["5-10", "10+"], tags: ["Mining"] },
  { id: "capital-security", name: "Capital Security", focus: "Security services", headshot: true, columns: 1, audience: "professional", exp: ["3-5", "5-10"], tags: ["Security"] },
  { id: "lagoon-service", name: "Lagoon Service", focus: "Customer success", headshot: true, columns: 2, audience: "professional", exp: ["lt3", "3-5"], tags: ["Service"] },
  { id: "oceanic-legal", name: "Oceanic Legal", focus: "Legal assistant", headshot: false, columns: 1, audience: "professional", exp: ["3-5", "5-10"], tags: ["Legal"] },
  { id: "savannah-analytics", name: "Savannah Analytics", focus: "Business intelligence", headshot: false, columns: 2, audience: "professional", exp: ["3-5", "5-10"], tags: ["Analytics"] },
  { id: "ga-creative", name: "Ga Creative", focus: "Creative direction", headshot: true, columns: 2, audience: "professional", exp: ["5-10", "10+"], tags: ["Creative"] },
  { id: "forest-hr", name: "Forest HR", focus: "People operations", headshot: false, columns: 1, audience: "professional", exp: ["3-5", "5-10"], tags: ["HR"] },
  { id: "afram-health", name: "Afram Health", focus: "Public health", headshot: true, columns: 2, audience: "professional", exp: ["3-5", "5-10", "10+"], tags: ["Public Health"] },
  { id: "goldcoast-edu", name: "Gold Coast Edu", focus: "Student highlight", headshot: true, columns: 1, audience: "student", exp: ["none", "lt3"], tags: ["Student"] },
];

const studentVariantCycle: TemplateVariant[] = ["minimal", "classic", "sidebar", "legacy"];
const professionalVariantCycle: TemplateVariant[] = ["legacy", "classic", "sidebar", "executive", "minimal"];

function sectionsForTemplate(variant: TemplateVariant, audience: AudienceType): ResumeSection[] {
  const base: ResumeSection[] = ["info"];
  if (variant === "sidebar") {
    return [...base, "education", "projects", "experience", "skills", "certifications", "highlights"];
  }
  if (variant === "minimal") {
    return [...base, "education", "experience", "skills", "certifications"];
  }
  if (variant === "executive") {
    return [...base, "experience", "skills", "highlights", "certifications", "education"];
  }
  if (variant === "legacy") {
    return [...base, "experience", "skills", "highlights", "certifications", "education"];
  }
  return audience === "student"
    ? [...base, "education", "projects", "experience", "skills", "certifications"]
    : [...base, "experience", "education", "skills", "highlights", "certifications"];
}

export const templates: TemplateMeta[] = baseTemplates.map((template, index) => {
  const cycle =
    template.audience === "student" ? studentVariantCycle : professionalVariantCycle;
  const variant = cycle[index % cycle.length];
  return {
    ...template,
    variant,
    sections: sectionsForTemplate(variant, template.audience),
    thumb: pdfThumbs[index] ?? undefined,
  };
});
