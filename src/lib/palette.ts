"use client";

import { useEffect, useState } from "react";

/**
 * One source of colour for both worlds.
 *
 * The DOM reads the palette through CSS variables. WebGL cannot, so
 * without this the canvas would carry its own copy of every hex and
 * drift out of agreement with the page the moment a palette changed.
 * Instead we read the computed variables back out of the document and
 * hand them to Three.
 *
 * Consequence worth knowing: this can only run on the client, because
 * there is no computed style on the server. Everything here is behind
 * an effect and callers get the fallback until it resolves.
 */

export type PaletteName = "sand" | "steel" | "paper";

export const PALETTES: PaletteName[] = ["sand", "steel", "paper"];

/**
 * The three service tints.
 *
 * Hue-shifts of one another rather than three unrelated brand
 * colours, which is what lets the mark split into three clusters and
 * still read as one object dividing rather than as three logos. They
 * live here rather than in the content model, because a colour is not
 * copy and Three needs a literal hex, not a CSS variable.
 *
 * All three clear 4.5:1 against every light palette base, so they may
 * carry a service name at display size. They still may not carry body
 * text. Deepened from their original dark-stage values so they read on
 * a light background.
 */
export const SERVICE_TINT = {
  transportation: "#0f8a7d",
  cleaning: "#4f8f22",
  facility: "#2f6fce",
} as const;

export interface Palette {
  base: string;
  raised: string;
  ink: string;
  inkMuted: string;
  accent: string;
}

/** Matches the :root declaration in tokens.css. */
const FALLBACK: Palette = {
  base: "#f2f1ef",
  raised: "#fbfaf8",
  ink: "#17141a",
  inkMuted: "#5b5650",
  accent: "#e8641e",
};

function readVar(styles: CSSStyleDeclaration, name: string, fallback: string) {
  const value = styles.getPropertyValue(name).trim();
  return value || fallback;
}

export function readPalette(): Palette {
  if (typeof window === "undefined") return FALLBACK;
  const s = getComputedStyle(document.documentElement);
  return {
    base: readVar(s, "--base", FALLBACK.base),
    raised: readVar(s, "--raised", FALLBACK.raised),
    ink: readVar(s, "--ink", FALLBACK.ink),
    inkMuted: readVar(s, "--ink-muted", FALLBACK.inkMuted),
    accent: readVar(s, "--accent", FALLBACK.accent),
  };
}

/**
 * The live palette, re-read whenever data-palette changes.
 *
 * The observer is what makes the three-palettes-at-once decision gate
 * work: switching the attribute restyles the page and recolours the
 * 3D in the same frame, with no reload and no second source of truth.
 */
export function usePalette(): Palette {
  const [palette, setPalette] = useState<Palette>(FALLBACK);

  useEffect(() => {
    const sync = () => setPalette(readPalette());
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-palette"],
    });
    return () => observer.disconnect();
  }, []);

  return palette;
}

/**
 * Lets the palette be driven from the URL during the review gate, so
 * the client can be sent three links rather than three screenshots
 * and compare them live. Harmless in production: with no parameter it
 * leaves whatever the document already declares.
 */
export function applyPaletteFromQuery() {
  if (typeof window === "undefined") return;
  const requested = new URLSearchParams(window.location.search).get("palette");
  if (requested && (PALETTES as string[]).includes(requested)) {
    document.documentElement.setAttribute("data-palette", requested);
  }
}
