"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ServiceId } from "./content";

export interface Details {
  company: string;
  name: string;
  email: string;
  phone: string;
  contactPreference: "email" | "phone";
  notes: string;
}

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

type AnswerValue = string | string[];

interface ExperienceState {
  /* Where the visitor is in the journey. Fed by SceneTracker, read by
     the navigation and the journey rail so both stay in one truth. */
  activeScene: string;
  sceneTone: "charcoal" | "cream";
  setScene: (id: string, tone: "charcoal" | "cream") => void;

  /* Expanded service world */
  activeService: ServiceId | null;
  openService: (id: ServiceId) => void;
  closeService: () => void;

  /* Contact gateway */
  contactOpen: boolean;
  contactService: ServiceId | null;
  step: number;
  reviewing: boolean;
  answers: Record<string, AnswerValue>;
  details: Details;
  status: SubmitStatus;
  errorMessage: string;

  openContact: (service?: ServiceId) => void;
  closeContact: () => void;
  chooseContactService: (id: ServiceId) => void;
  backToGateway: () => void;
  setStep: (n: number) => void;
  setAnswer: (id: string, value: AnswerValue) => void;
  toggleAnswer: (id: string, value: string) => void;
  setDetails: (patch: Partial<Details>) => void;
  setReviewing: (v: boolean) => void;
  setStatus: (s: SubmitStatus, message?: string) => void;
  resetRequest: () => void;
}

const emptyDetails: Details = {
  company: "",
  name: "",
  email: "",
  phone: "",
  contactPreference: "email",
  notes: "",
};

export const useExperience = create<ExperienceState>()(
  persist(
    (set) => ({
      activeScene: "hero",
      sceneTone: "cream",
      setScene: (activeScene, sceneTone) => set({ activeScene, sceneTone }),

      activeService: null,
      openService: (id) => set({ activeService: id }),
      closeService: () => set({ activeService: null }),

      contactOpen: false,
      contactService: null,
      step: 0,
      reviewing: false,
      answers: {},
      details: emptyDetails,
      status: "idle",
      errorMessage: "",

      openContact: (service) =>
        set((s) => ({
          contactOpen: true,
          contactService: service ?? s.contactService,
          status: s.status === "success" ? "idle" : s.status,
        })),
      closeContact: () => set({ contactOpen: false }),
      chooseContactService: (id) =>
        set((s) => ({
          contactService: id,
          step: s.contactService === id ? s.step : 0,
          reviewing: false,
          answers: s.contactService === id ? s.answers : {},
        })),
      backToGateway: () => set({ contactService: null, reviewing: false }),
      setStep: (n) => set({ step: Math.max(0, n) }),
      setAnswer: (id, value) =>
        set((s) => ({ answers: { ...s.answers, [id]: value } })),
      toggleAnswer: (id, value) =>
        set((s) => {
          const current = s.answers[id];
          const list = Array.isArray(current) ? current : [];
          const next = list.includes(value)
            ? list.filter((v) => v !== value)
            : [...list, value];
          return { answers: { ...s.answers, [id]: next } };
        }),
      setDetails: (patch) =>
        set((s) => ({ details: { ...s.details, ...patch } })),
      setReviewing: (v) => set({ reviewing: v }),
      setStatus: (status, errorMessage = "") => set({ status, errorMessage }),
      resetRequest: () =>
        set({
          contactService: null,
          step: 0,
          reviewing: false,
          answers: {},
          details: emptyDetails,
          status: "idle",
          errorMessage: "",
        }),
    }),
    {
      name: "oryx-request",
      // Progress survives closing the gateway. Overlay open state does not:
      // a visitor returning later should land on the page, not in a dialog.
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        contactService: s.contactService,
        step: s.step,
        answers: s.answers,
        details: s.details,
      }),
    },
  ),
);
