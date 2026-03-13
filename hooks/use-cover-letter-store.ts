import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CoverLetterState {
  step: number;
  accent: string;
  data: {
    sender: {
      fullName: string;
      email: string;
      phone: string;
      location: string;
    };
    recipient: {
      name: string;
      title: string;
      company: string;
      address: string;
    };
    date: string;
    subject: string;
    opening: string;
    body: string;
    closing: string;
    signature: string;
  };
  setStep: (step: number) => void;
  setAccent: (accent: string) => void;
  updateSender: (fields: Partial<CoverLetterState["data"]["sender"]>) => void;
  updateRecipient: (fields: Partial<CoverLetterState["data"]["recipient"]>) => void;
  updateField: (fields: Partial<CoverLetterState["data"]>) => void;
  reset: () => void;
  loadDraft: (draft: { data?: CoverLetterState["data"]; accent?: string }) => void;
}

const defaultState = {
  step: 1,
  accent: "#f97316",
  data: {
    sender: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
    },
    recipient: {
      name: "",
      title: "",
      company: "",
      address: "",
    },
    date: "",
    subject: "",
    opening: "Dear Hiring Manager,",
    body:
      "I am excited to apply for this role. With a strong background in [your field], I have delivered measurable results and collaborated across teams to drive impact.",
    closing: "Thank you for your time and consideration. I would welcome the opportunity to discuss my application.",
    signature: "",
  },
};

export const useCoverLetterStore = create<CoverLetterState>()(
  persist(
    (set) => ({
      ...defaultState,
      setStep: (step) => set({ step }),
      setAccent: (accent) => set({ accent }),
      updateSender: (fields) =>
        set((state) => ({
          data: { ...state.data, sender: { ...state.data.sender, ...fields } },
        })),
      updateRecipient: (fields) =>
        set((state) => ({
          data: { ...state.data, recipient: { ...state.data.recipient, ...fields } },
        })),
      updateField: (fields) =>
        set((state) => ({
          data: { ...state.data, ...fields },
        })),
      reset: () => set(() => ({ ...defaultState })),
      loadDraft: (draft) =>
        set((state) => ({
          step: 1,
          accent: draft.accent ?? state.accent,
          data: draft.data ? { ...state.data, ...draft.data } : state.data,
        })),
    }),
    {
      name: "cover-letter-storage",
      version: 1,
    }
  )
);
