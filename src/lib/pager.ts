"use client";

import { useEffect, useRef } from "react";
import { useExperience } from "./store";

/**
 * Desktop paging.
 *
 * CSS scroll snapping cannot do what this experience needs. It snaps
 * after the browser has already thrown the page somewhere, which reads
 * as a correction rather than a transition, and it has no answer for a
 * scene that is three viewports tall and telling a story the whole way
 * down.
 *
 * So one gesture moves exactly one stop, on a real eased curve, and
 * input is ignored until it lands. Because the animation drives real
 * scroll position, every scroll linked animation in the page keeps
 * running through the transition. The words in scene 02 organise
 * themselves *during* the glide rather than after it.
 *
 * Stops are derived, not declared: a scene one viewport tall is one
 * stop, a scene three viewports tall is three. Nothing has to be kept
 * in sync by hand.
 *
 * Touch and small screens never reach this. They get CSS proximity
 * snapping, which is the right behaviour for a thumb.
 */

const DURATION = 950;
const COOLDOWN = 90;
/** Wheel distance that counts as one deliberate gesture. */
const THRESHOLD = 28;
/** A pause this long ends a gesture, so momentum cannot chain pages. */
const GESTURE_GAP = 180;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function usePager() {
  const blocked = useExperience(
    (s) => s.activeService !== null || s.contactOpen,
  );
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;

  useEffect(() => {
    const canPage = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine)",
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!canPage.matches || reduced.matches) return;

    let stops: number[] = [];
    let index = 0;
    let animating = false;
    let raf = 0;
    let accum = 0;
    let lastWheel = 0;
    let unlockAt = 0;

    /**
     * A scene taller than the viewport earns a stop per viewport.
     *
     * Ceil, not round. A scene that overflows by a third of a screen
     * still needs a second stop, otherwise the overflow is unreachable:
     * the wheel is prevented, so anything with no stop on it can never
     * be scrolled to. The document end is always a stop for the same
     * reason, so the closing footer is always reachable.
     */
    const measure = () => {
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      /* Anything shorter than this is not worth a gesture. A scene that
         overflows by a strip of padding does not need a stop for the
         padding, and a stop that moves the page 40px reads as the page
         failing to respond. */
      const minGap = vh * 0.2;
      const next: number[] = [];

      document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
        const top = el.offsetTop;
        const travel = el.offsetHeight - vh;
        if (travel <= minGap) {
          next.push(top);
          return;
        }
        const count = Math.max(2, Math.ceil((el.offsetHeight - 8) / vh));
        for (let i = 0; i < count; i++) {
          next.push(top + (travel * i) / (count - 1));
        }
      });

      next.push(max);

      stops = next
        .map((v) => Math.min(Math.max(0, Math.round(v)), max))
        .sort((a, b) => a - b)
        .filter((v, i, arr) => i === 0 || v - arr[i - 1] > minGap);

      syncIndex();
    };

    /** Where are we actually. Keeps the pager honest after any scroll
        it did not perform itself, such as a navigation click. */
    const syncIndex = () => {
      const y = window.scrollY;
      let best = 0;
      let bestDist = Infinity;
      stops.forEach((stop, i) => {
        const d = Math.abs(stop - y);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      index = best;
    };

    const cancel = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      animating = false;
    };

    const glideTo = (target: number) => {
      const from = window.scrollY;
      const distance = target - from;
      if (Math.abs(distance) < 2) return;

      animating = true;
      const start = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        window.scrollTo(0, from + distance * easeInOutCubic(t));
        if (t < 1) {
          raf = requestAnimationFrame(step);
          return;
        }
        raf = 0;
        animating = false;
        unlockAt = performance.now() + COOLDOWN;
        accum = 0;
      };
      raf = requestAnimationFrame(step);
    };

    const go = (direction: 1 | -1) => {
      const next = index + direction;
      if (next < 0 || next >= stops.length) return false;
      index = next;
      glideTo(stops[next]);
      return true;
    };

    /** True when the pointer sits over something with its own scroll,
        so an inner journey is never stolen by the page. */
    const overInnerScroller = (target: EventTarget | null) => {
      let node = target as HTMLElement | null;
      while (node && node !== document.body) {
        const style = getComputedStyle(node);
        if (
          /(auto|scroll)/.test(style.overflowY) &&
          node.scrollHeight > node.clientHeight + 4
        ) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    const onWheel = (e: WheelEvent) => {
      if (blockedRef.current || overInnerScroller(e.target)) return;
      if (e.ctrlKey) return; // pinch zoom belongs to the browser

      e.preventDefault();

      const now = performance.now();
      if (animating || now < unlockAt) return;
      if (now - lastWheel > GESTURE_GAP) accum = 0;
      lastWheel = now;

      accum += e.deltaY;
      if (Math.abs(accum) < THRESHOLD) return;

      const direction = accum > 0 ? 1 : -1;
      accum = 0;
      go(direction);
    };

    const onKey = (e: KeyboardEvent) => {
      if (blockedRef.current || animating) return;
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case "PageDown":
        case "ArrowDown":
          if (go(1)) e.preventDefault();
          break;
        case " ":
          if (go(e.shiftKey ? -1 : 1)) e.preventDefault();
          break;
        case "PageUp":
        case "ArrowUp":
          if (go(-1)) e.preventDefault();
          break;
        case "Home":
          e.preventDefault();
          index = 0;
          glideTo(stops[0]);
          break;
        case "End":
          e.preventDefault();
          index = stops.length - 1;
          glideTo(stops[index]);
          break;
      }
    };

    /** Any scroll we did not drive means the visitor or a link moved
        the page. Re-anchor so the next gesture continues from there. */
    let resync = 0;
    const onScroll = () => {
      if (animating) return;
      window.clearTimeout(resync);
      resync = window.setTimeout(syncIndex, 120);
    };

    let remeasure = 0;
    const onResize = () => {
      window.clearTimeout(remeasure);
      remeasure = window.setTimeout(measure, 180);
    };

    // Scenes settle after fonts and media, so measure once more.
    measure();
    const settle = window.setTimeout(measure, 700);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancel();
      window.clearTimeout(settle);
      window.clearTimeout(resync);
      window.clearTimeout(remeasure);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);
}
