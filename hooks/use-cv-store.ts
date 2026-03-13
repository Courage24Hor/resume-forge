import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CvTemplateVariant } from "@/lib/cv-templates";

export interface CvExperience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
}

export interface CvEducation {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface CvProject {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
}

export interface CvCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CvPublication {
  id: string;
  title: string;
  venue: string;
  year: string;
  link: string;
}

export interface CvResearch {
  id: string;
  title: string;
  description: string;
  year: string;
}

export interface CvTeaching {
  id: string;
  course: string;
  institution: string;
  term: string;
}

export interface CvAward {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface CvMembership {
  id: string;
  name: string;
  role: string;
  year: string;
}

interface CvState {
  step: number;
  template: {
    id: string | null;
    accent: string;
    columns: 1 | 2;
    headshot: boolean;
    variant: CvTemplateVariant;
  };
  profile: {
    audience: "academic" | "professional";
  };
  data: {
    heading: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      city: string;
      country: string;
      postcode: string;
    };
    summary: string;
    experience: CvExperience[];
    education: CvEducation[];
    projects: CvProject[];
    certifications: CvCertification[];
    publications: CvPublication[];
    research: CvResearch[];
    teaching: CvTeaching[];
    awards: CvAward[];
    memberships: CvMembership[];
    skills: string[];
    languages: string[];
    links: string[];
    references: string[];
  };
  setStep: (step: number) => void;
  setTemplate: (template: CvState["template"]) => void;
  setProfile: (profile: CvState["profile"]) => void;
  updateHeading: (fields: Partial<CvState["data"]["heading"]>) => void;
  updateSummary: (text: string) => void;
  setSkills: (skills: string[]) => void;
  setLanguages: (languages: string[]) => void;
  setLinks: (links: string[]) => void;
  setReferences: (references: string[]) => void;
  addExperience: (exp: CvExperience) => void;
  updateExperience: (id: string, exp: Partial<CvExperience>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (id: string, direction: "up" | "down") => void;
  addEducation: (edu: CvEducation) => void;
  updateEducation: (id: string, edu: Partial<CvEducation>) => void;
  removeEducation: (id: string) => void;
  moveEducation: (id: string, direction: "up" | "down") => void;
  addProject: (project: CvProject) => void;
  updateProject: (id: string, project: Partial<CvProject>) => void;
  removeProject: (id: string) => void;
  moveProject: (id: string, direction: "up" | "down") => void;
  addCertification: (cert: CvCertification) => void;
  updateCertification: (id: string, cert: Partial<CvCertification>) => void;
  removeCertification: (id: string) => void;
  addPublication: (item: CvPublication) => void;
  updatePublication: (id: string, item: Partial<CvPublication>) => void;
  removePublication: (id: string) => void;
  addResearch: (item: CvResearch) => void;
  updateResearch: (id: string, item: Partial<CvResearch>) => void;
  removeResearch: (id: string) => void;
  addTeaching: (item: CvTeaching) => void;
  updateTeaching: (id: string, item: Partial<CvTeaching>) => void;
  removeTeaching: (id: string) => void;
  addAward: (item: CvAward) => void;
  updateAward: (id: string, item: Partial<CvAward>) => void;
  removeAward: (id: string) => void;
  addMembership: (item: CvMembership) => void;
  updateMembership: (id: string, item: Partial<CvMembership>) => void;
  removeMembership: (id: string) => void;
  loadDraft: (draft: {
    data?: CvState["data"];
    template?: CvState["template"];
    profile?: CvState["profile"];
  }) => void;
}

const defaultHeading = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "Accra",
  country: "Ghana",
  postcode: "",
};

const defaultState = {
  step: 1,
  template: {
    id: null as string | null,
    accent: "#0f766e",
    columns: 1 as 1 | 2,
    headshot: false,
    variant: "classic" as CvTemplateVariant,
  },
  profile: {
    audience: "professional" as "academic" | "professional",
  },
  data: {
    heading: defaultHeading,
    summary: "",
    experience: [] as CvExperience[],
    education: [] as CvEducation[],
    projects: [] as CvProject[],
    certifications: [] as CvCertification[],
    publications: [] as CvPublication[],
    research: [] as CvResearch[],
    teaching: [] as CvTeaching[],
    awards: [] as CvAward[],
    memberships: [] as CvMembership[],
    skills: [] as string[],
    languages: [] as string[],
    links: [] as string[],
    references: [] as string[],
  },
};

function moveInArray<T extends { id: string }>(items: T[], id: string, direction: "up" | "down") {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items;
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= items.length) return items;
  const cloned = [...items];
  [cloned[index], cloned[target]] = [cloned[target], cloned[index]];
  return cloned;
}

export const useCvStore = create<CvState>()(
  persist(
    (set) => ({
      ...defaultState,
      setStep: (step) => set({ step }),
      setTemplate: (template) => set(() => ({ template })),
      setProfile: (profile) => set(() => ({ profile })),
      updateHeading: (fields) =>
        set((state) => ({ data: { ...state.data, heading: { ...state.data.heading, ...fields } } })),
      updateSummary: (text) => set((state) => ({ data: { ...state.data, summary: text } })),
      setSkills: (skills) => set((state) => ({ data: { ...state.data, skills } })),
      setLanguages: (languages) => set((state) => ({ data: { ...state.data, languages } })),
      setLinks: (links) => set((state) => ({ data: { ...state.data, links } })),
      setReferences: (references) => set((state) => ({ data: { ...state.data, references } })),
      addExperience: (exp) =>
        set((state) => ({ data: { ...state.data, experience: [...state.data.experience, exp] } })),
      updateExperience: (id, exp) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((item) => (item.id === id ? { ...item, ...exp } : item)),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          data: { ...state.data, experience: state.data.experience.filter((item) => item.id !== id) },
        })),
      moveExperience: (id, direction) =>
        set((state) => ({
          data: { ...state.data, experience: moveInArray(state.data.experience, id, direction) },
        })),
      addEducation: (edu) =>
        set((state) => ({ data: { ...state.data, education: [...state.data.education, edu] } })),
      updateEducation: (id, edu) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((item) => (item.id === id ? { ...item, ...edu } : item)),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          data: { ...state.data, education: state.data.education.filter((item) => item.id !== id) },
        })),
      moveEducation: (id, direction) =>
        set((state) => ({
          data: { ...state.data, education: moveInArray(state.data.education, id, direction) },
        })),
      addProject: (project) =>
        set((state) => ({ data: { ...state.data, projects: [...state.data.projects, project] } })),
      updateProject: (id, project) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((item) => (item.id === id ? { ...item, ...project } : item)),
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          data: { ...state.data, projects: state.data.projects.filter((item) => item.id !== id) },
        })),
      moveProject: (id, direction) =>
        set((state) => ({
          data: { ...state.data, projects: moveInArray(state.data.projects, id, direction) },
        })),
      addCertification: (cert) =>
        set((state) => ({
          data: { ...state.data, certifications: [...state.data.certifications, cert] },
        })),
      updateCertification: (id, cert) =>
        set((state) => ({
          data: {
            ...state.data,
            certifications: state.data.certifications.map((item) => (item.id === id ? { ...item, ...cert } : item)),
          },
        })),
      removeCertification: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            certifications: state.data.certifications.filter((item) => item.id !== id),
          },
        })),
      addPublication: (item) =>
        set((state) => ({
          data: { ...state.data, publications: [...state.data.publications, item] },
        })),
      updatePublication: (id, item) =>
        set((state) => ({
          data: {
            ...state.data,
            publications: state.data.publications.map((entry) => (entry.id === id ? { ...entry, ...item } : entry)),
          },
        })),
      removePublication: (id) =>
        set((state) => ({
          data: { ...state.data, publications: state.data.publications.filter((entry) => entry.id !== id) },
        })),
      addResearch: (item) =>
        set((state) => ({
          data: { ...state.data, research: [...state.data.research, item] },
        })),
      updateResearch: (id, item) =>
        set((state) => ({
          data: {
            ...state.data,
            research: state.data.research.map((entry) => (entry.id === id ? { ...entry, ...item } : entry)),
          },
        })),
      removeResearch: (id) =>
        set((state) => ({
          data: { ...state.data, research: state.data.research.filter((entry) => entry.id !== id) },
        })),
      addTeaching: (item) =>
        set((state) => ({
          data: { ...state.data, teaching: [...state.data.teaching, item] },
        })),
      updateTeaching: (id, item) =>
        set((state) => ({
          data: {
            ...state.data,
            teaching: state.data.teaching.map((entry) => (entry.id === id ? { ...entry, ...item } : entry)),
          },
        })),
      removeTeaching: (id) =>
        set((state) => ({
          data: { ...state.data, teaching: state.data.teaching.filter((entry) => entry.id !== id) },
        })),
      addAward: (item) =>
        set((state) => ({
          data: { ...state.data, awards: [...state.data.awards, item] },
        })),
      updateAward: (id, item) =>
        set((state) => ({
          data: {
            ...state.data,
            awards: state.data.awards.map((entry) => (entry.id === id ? { ...entry, ...item } : entry)),
          },
        })),
      removeAward: (id) =>
        set((state) => ({
          data: { ...state.data, awards: state.data.awards.filter((entry) => entry.id !== id) },
        })),
      addMembership: (item) =>
        set((state) => ({
          data: { ...state.data, memberships: [...state.data.memberships, item] },
        })),
      updateMembership: (id, item) =>
        set((state) => ({
          data: {
            ...state.data,
            memberships: state.data.memberships.map((entry) => (entry.id === id ? { ...entry, ...item } : entry)),
          },
        })),
      removeMembership: (id) =>
        set((state) => ({
          data: { ...state.data, memberships: state.data.memberships.filter((entry) => entry.id !== id) },
        })),
      loadDraft: (draft) =>
        set((state) => ({
          step: 1,
          template: draft.template ? { ...state.template, ...draft.template } : state.template,
          profile: draft.profile ? { ...state.profile, ...draft.profile } : state.profile,
          data: draft.data ? { ...state.data, ...draft.data } : state.data,
        })),
    }),
    {
      name: "cv-storage",
      version: 1,
    }
  )
);
