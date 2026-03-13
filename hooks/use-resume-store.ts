import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TemplateVariant } from "@/lib/templates";

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

interface ResumeState {
  step: number;
  template: {
    id: string | null;
    accent: string;
    columns: 1 | 2;
    headshot: boolean;
    variant: TemplateVariant;
  };
  profile: {
    audience: "student" | "professional";
    experience: "none" | "lt3" | "3-5" | "5-10" | "10+" | null;
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
    experience: Experience[];
    education: Education[];
    projects: Project[];
    certifications: Certification[];
    skills: string[];
    highlights: string[];
    languages: string[];
    links: string[];
    references: string[];
    summary: string;
  };
  setStep: (step: number) => void;
  updateHeading: (fields: Partial<ResumeState['data']['heading']>) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  moveProject: (id: string, direction: "up" | "down") => void;
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  updateSummary: (text: string) => void;
  setSkills: (skills: string[]) => void;
  setHighlights: (highlights: string[]) => void;
  setLanguages: (languages: string[]) => void;
  setLinks: (links: string[]) => void;
  setReferences: (references: string[]) => void;
  moveEducation: (id: string, direction: "up" | "down") => void;
  moveExperience: (id: string, direction: "up" | "down") => void;
  setTemplate: (template: ResumeState['template']) => void;
  setProfile: (profile: ResumeState['profile']) => void;
  loadDraft: (draft: {
    data?: ResumeState["data"];
    template?: ResumeState["template"];
    profile?: ResumeState["profile"];
  }) => void;
}

const defaultHeading = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: 'Accra',
  country: 'Ghana',
  postcode: '',
};

const defaultState = {
  step: 1,
  template: {
    id: null as string | null,
    accent: "#0f766e",
    columns: 1 as 1 | 2,
    headshot: false,
    variant: "classic" as TemplateVariant,
  },
  profile: {
    audience: "professional" as "student" | "professional",
    experience: null as "none" | "lt3" | "3-5" | "5-10" | "10+" | null,
  },
  data: {
    heading: defaultHeading,
    experience: [] as Experience[],
    education: [] as Education[],
    projects: [] as Project[],
    certifications: [] as Certification[],
    skills: [] as string[],
    highlights: [] as string[],
    languages: [] as string[],
    links: [] as string[],
    references: [] as string[],
    summary: '',
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

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      ...defaultState,
      setStep: (step) => set({ step }),
      updateHeading: (fields) => 
        set((state) => ({ data: { ...state.data, heading: { ...state.data.heading, ...fields } } })),
      addExperience: (exp) => 
        set((state) => ({ data: { ...state.data, experience: [...state.data.experience, exp] } })),
      updateExperience: (id, exp) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((e) => (e.id === id ? { ...e, ...exp } : e)),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          data: { ...state.data, experience: state.data.experience.filter((e) => e.id !== id) },
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
            education: state.data.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          data: { ...state.data, education: state.data.education.filter((e) => e.id !== id) },
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
            projects: state.data.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          data: { ...state.data, projects: state.data.projects.filter((p) => p.id !== id) },
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
            certifications: state.data.certifications.map((c) => (c.id === id ? { ...c, ...cert } : c)),
          },
        })),
      removeCertification: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            certifications: state.data.certifications.filter((c) => c.id !== id),
          },
        })),
      updateSummary: (text) => 
        set((state) => ({ data: { ...state.data, summary: text } })),
      setSkills: (skills) => 
        set((state) => ({ data: { ...state.data, skills } })),
      setHighlights: (highlights) =>
        set((state) => ({ data: { ...state.data, highlights } })),
      setLanguages: (languages) =>
        set((state) => ({ data: { ...state.data, languages } })),
      setLinks: (links) =>
        set((state) => ({ data: { ...state.data, links } })),
      setReferences: (references) =>
        set((state) => ({ data: { ...state.data, references } })),
      setTemplate: (template) =>
        set(() => ({ template })),
      setProfile: (profile) =>
        set(() => ({ profile })),
      loadDraft: (draft) =>
        set((state) => ({
          step: 1,
          template: draft.template ? { ...state.template, ...draft.template } : state.template,
          profile: draft.profile ? { ...state.profile, ...draft.profile } : state.profile,
          data: draft.data ? { ...state.data, ...draft.data } : state.data,
        })),
    }),
    {
      name: 'resume-storage',
      version: 6,
      migrate: (persistedState: any) => {
        const state = persistedState ?? {};
        const legacyHeading = state?.data?.heading ?? {};
        const migratedExperience = (state?.data?.experience ?? []).map((exp: any) => ({
          ...exp,
          startDate: exp?.startDate ?? "",
          endDate: exp?.endDate ?? "",
          isCurrent: typeof exp?.isCurrent === "boolean" ? exp.isCurrent : false,
        }));
        const migratedEducation = (state?.data?.education ?? []).map((edu: any) => ({
          ...edu,
          startDate: edu?.startDate ?? "",
          endDate: edu?.endDate ?? edu?.year ?? "",
          isCurrent: typeof edu?.isCurrent === "boolean" ? edu.isCurrent : false,
        }));
        const migratedProjects = (state?.data?.projects ?? []).map((project: any) => ({
          ...project,
          name: project?.name ?? "",
          role: project?.role ?? "",
          startDate: project?.startDate ?? "",
          endDate: project?.endDate ?? "",
          isCurrent: typeof project?.isCurrent === "boolean" ? project.isCurrent : false,
          description: project?.description ?? "",
        }));
        const migratedCertifications = (state?.data?.certifications ?? []).map((cert: any) => ({
          ...cert,
          name: cert?.name ?? "",
          issuer: cert?.issuer ?? "",
          date: cert?.date ?? "",
        }));
        return {
          ...defaultState,
          ...state,
          template: {
            ...defaultState.template,
            ...(state.template ?? {}),
            variant: state?.template?.variant ?? defaultState.template.variant,
          },
          profile: {
            ...defaultState.profile,
            ...(state.profile ?? {}),
          },
          data: {
            ...defaultState.data,
            ...(state.data ?? {}),
            experience: migratedExperience,
            education: migratedEducation,
            projects: migratedProjects,
            certifications: migratedCertifications,
            skills: Array.isArray(state?.data?.skills) ? state.data.skills : [],
            highlights: Array.isArray(state?.data?.highlights) ? state.data.highlights : [],
            languages: Array.isArray(state?.data?.languages) ? state.data.languages : [],
            links: Array.isArray(state?.data?.links) ? state.data.links : [],
            references: Array.isArray(state?.data?.references) ? state.data.references : [],
            heading: {
              ...defaultHeading,
              ...legacyHeading,
              firstName: legacyHeading.firstName ?? legacyHeading.name ?? '',
              lastName: legacyHeading.lastName ?? '',
              email: legacyHeading.email ?? '',
              phone: legacyHeading.phone ?? '',
              city: legacyHeading.city ?? 'Accra',
              country: legacyHeading.country ?? 'Ghana',
              postcode: legacyHeading.postcode ?? '',
            },
          },
        };
      },
      merge: (persistedState: any, currentState) => {
        const state = persistedState ?? {};
        const legacyHeading = state?.data?.heading ?? {};
        const mergedExperience = (state?.data?.experience ?? currentState.data.experience).map((exp: any) => ({
          ...exp,
          startDate: exp?.startDate ?? "",
          endDate: exp?.endDate ?? "",
          isCurrent: typeof exp?.isCurrent === "boolean" ? exp.isCurrent : false,
        }));
        const mergedEducation = (state?.data?.education ?? currentState.data.education).map((edu: any) => ({
          ...edu,
          startDate: edu?.startDate ?? "",
          endDate: edu?.endDate ?? edu?.year ?? "",
          isCurrent: typeof edu?.isCurrent === "boolean" ? edu.isCurrent : false,
        }));
        const mergedProjects = (state?.data?.projects ?? currentState.data.projects ?? []).map((project: any) => ({
          ...project,
          name: project?.name ?? "",
          role: project?.role ?? "",
          startDate: project?.startDate ?? "",
          endDate: project?.endDate ?? "",
          isCurrent: typeof project?.isCurrent === "boolean" ? project.isCurrent : false,
          description: project?.description ?? "",
        }));
        const mergedCertifications = (state?.data?.certifications ?? currentState.data.certifications ?? []).map((cert: any) => ({
          ...cert,
          name: cert?.name ?? "",
          issuer: cert?.issuer ?? "",
          date: cert?.date ?? "",
        }));
        return {
          ...currentState,
          ...state,
          template: {
            ...currentState.template,
            ...(state.template ?? {}),
            variant: state?.template?.variant ?? currentState.template.variant,
          },
          profile: {
            ...currentState.profile,
            ...(state.profile ?? {}),
          },
          data: {
            ...currentState.data,
            ...(state.data ?? {}),
            experience: mergedExperience,
            education: mergedEducation,
            projects: mergedProjects,
            certifications: mergedCertifications,
            skills: Array.isArray(state?.data?.skills) ? state.data.skills : currentState.data.skills,
            highlights: Array.isArray(state?.data?.highlights) ? state.data.highlights : currentState.data.highlights,
            languages: Array.isArray(state?.data?.languages) ? state.data.languages : currentState.data.languages,
            links: Array.isArray(state?.data?.links) ? state.data.links : currentState.data.links,
            references: Array.isArray(state?.data?.references) ? state.data.references : currentState.data.references,
            heading: {
              ...currentState.data.heading,
              ...legacyHeading,
              firstName: legacyHeading.firstName ?? legacyHeading.name ?? currentState.data.heading.firstName,
              lastName: legacyHeading.lastName ?? currentState.data.heading.lastName,
              email: legacyHeading.email ?? currentState.data.heading.email,
              phone: legacyHeading.phone ?? currentState.data.heading.phone,
              city: legacyHeading.city ?? currentState.data.heading.city,
              country: legacyHeading.country ?? currentState.data.heading.country,
              postcode: legacyHeading.postcode ?? currentState.data.heading.postcode,
            },
          },
        };
      },
    }
  )
);
