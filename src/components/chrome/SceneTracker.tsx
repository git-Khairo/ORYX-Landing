"use client";

import { useEffect } from "react";
import { useExperience } from "@/lib/store";

/**
 * One observer for the whole page. Reports which scene owns the top of
 * the viewport, so the
 * navigation can adapt and the journey rail can show position. No
 * scroll listeners.
 */
export function SceneTracker() {
  const setScene = useExperience((s) => s.setScene);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scene]"),
    );
    if (sections.length === 0) return;

    const visible = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.scene!;
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        }
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (!best) return;
        setScene(best);
      },
      { threshold: [0.2, 0.4, 0.6, 0.8] },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [setScene]);

  return null;
}
