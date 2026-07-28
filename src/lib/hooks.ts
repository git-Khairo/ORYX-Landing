"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the client has taken over.
 *
 * Scroll driven motion values cannot be resolved during server render:
 * there is no viewport to measure against, so the server writes one
 * value and the first client frame computes another. Gating the style
 * on this keeps the markup identical through hydration, and the
 * parallax simply engages a frame later.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/* Shared lock count: two overlays can be open at once (a service world
   with the contact gateway on top) and the page must unlock exactly once,
   at the exact scroll position it left. */
let locks = 0;
let savedY = 0;
let coarse = false;

/**
 * Locks the page behind an overlay.
 *
 * Two techniques, on purpose. On precise pointers we hide document
 * overflow, which keeps every element at the same viewport coordinate
 * so the shared element expansion has nothing to fight with
 * (`scrollbar-gutter: stable` prevents the classic gutter jump).
 * On touch, where hidden overflow is unreliable, we pin the body and
 * restore the exact position on release.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const body = document.body;
    const html = document.documentElement;

    if (locks === 0) {
      coarse = window.matchMedia("(pointer: coarse)").matches;
      savedY = window.scrollY;
      if (coarse) {
        body.style.top = `-${savedY}px`;
        body.dataset.locked = "true";
      } else {
        html.style.overflow = "hidden";
      }
    }
    locks += 1;

    return () => {
      locks -= 1;
      if (locks > 0) return;
      if (coarse) {
        body.dataset.locked = "false";
        body.style.top = "";
        // Instant, not smooth: this is a restore, not a journey.
        const previous = html.style.scrollBehavior;
        html.style.scrollBehavior = "auto";
        window.scrollTo(0, savedY);
        html.style.scrollBehavior = previous;
      } else {
        html.style.overflow = "";
      }
    };
  }, [active]);
}

/** Escape closes the topmost overlay. */
export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onEscape();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, onEscape]);
}

/**
 * Dialog focus behaviour: move focus in on open, trap Tab inside,
 * return focus to the trigger on close.
 */
export function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    const previous = document.activeElement as HTMLElement | null;

    const selector =
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

    const focusables = () =>
      Array.from(node.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    const id = window.setTimeout(() => {
      const first = focusables()[0];
      (first ?? node).focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      node.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [active]);

  return ref;
}
