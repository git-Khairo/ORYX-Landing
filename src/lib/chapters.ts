export interface Chapter {
  id: string;
  index: string;
  label: string;
  /** Shown in the primary navigation. */
  nav?: boolean;
}

/**
 * Five chapters, down from nine.
 *
 * The client's "felt like reading a newspaper" was a word-count
 * complaint, and nine chapters each carrying a headline, a lede and a
 * list is how a page becomes a document. Technology, Why, Values and
 * Sustainability were four separate arguments for the same thing, so
 * they are now one, and the detail that survives moved behind a click
 * into the service worlds where it is opt in.
 *
 * The order is load-bearing. Stage3D's camera poses and Mark's split
 * behaviour are indexed by chapter, so Services must stay at index 1.
 */
export const CHAPTERS: Chapter[] = [
  { id: "hero", index: "01", label: "Always ready" },
  { id: "services", index: "02", label: "Services", nav: true },
  { id: "standard", index: "03", label: "Standard", nav: true },
  { id: "process", index: "04", label: "Process", nav: true },
  { id: "contact", index: "05", label: "Contact", nav: true },
];
