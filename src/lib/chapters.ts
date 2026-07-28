export interface Chapter {
  id: string;
  index: string;
  label: string;
  /** Shown in the primary navigation. */
  nav?: boolean;
}

export const CHAPTERS: Chapter[] = [
  { id: "hero", index: "01", label: "Always ready" },
  { id: "partner", index: "02", label: "Partner" },
  { id: "technology", index: "03", label: "Technology", nav: true },
  { id: "services", index: "04", label: "Services", nav: true },
  { id: "why", index: "05", label: "Why ORYX", nav: true },
  { id: "sustainability", index: "06", label: "Sustainability", nav: true },
  { id: "process", index: "07", label: "Partnership" },
  { id: "values", index: "08", label: "Values" },
  { id: "contact", index: "09", label: "Contact", nav: true },
];
