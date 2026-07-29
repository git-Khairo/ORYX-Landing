"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { CHAPTERS } from "@/lib/chapters";
import { useExperience } from "@/lib/store";
import { useMounted } from "@/lib/hooks";

/**
 * Position within the experience. A rail on the right at desktop, a
 * single hairline of progress on small screens. It reports where the
 * visitor is; it is not decoration and it is not a scroll instruction.
 */
export function JourneyRail() {
  const activeScene = useExperience((s) => s.activeScene);
  
  const hidden = useExperience((s) => s.activeService !== null || s.contactOpen);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const mounted = useMounted();

  // The rail floats over the scene, so it borrows that scene's ink.
  // One tone now, so the chrome no longer has to guess.
  const ink = "var(--ink)";

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed left-0 top-0 z-[70] h-px w-full origin-left bg-[color:var(--accent)] lg:hidden"
        style={
          mounted
            ? { scaleX: progress, opacity: hidden ? 0 : 0.85 }
            : { scaleX: 0, opacity: 0 }
        }
      />

      <motion.nav
        aria-label="Journey"
        className="fixed right-0 top-1/2 z-[70] hidden -translate-y-1/2 flex-col items-end gap-0 pr-6 lg:flex xl:pr-10"
        style={{ color: ink }}
        animate={{ opacity: hidden ? 0 : 1, x: hidden ? 24 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {CHAPTERS.map((c) => {
          const active = c.id === activeScene;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() =>
                document
                  .getElementById(c.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              aria-current={active ? "true" : undefined}
              className="group relative flex items-center justify-end gap-3 py-2.5"
            >
              {/* Absolutely positioned, and that is the whole point.
                  While the label sat in the rail's flow it made the
                  rail as wide as the longest chapter name, so a fixed
                  174px strip of every scene was sitting underneath it
                  and the closing footer ran straight into it. Out of
                  flow, the rail is only as wide as its ticks and the
                  label simply floats over the gutter when it is up. */}
              <span
                className="pointer-events-none absolute right-full mr-3 whitespace-nowrap font-mono text-[0.625rem] uppercase tracking-[0.18em] transition-all duration-500"
                style={{
                  opacity: active ? 0.9 : 0,
                  transform: active ? "translateX(0)" : "translateX(8px)",
                }}
              >
                {c.label}
              </span>
              <span
                className="block h-px transition-all duration-500 group-hover:w-8"
                style={{
                  width: active ? "1.75rem" : "0.625rem",
                  background: active ? "var(--accent)" : "currentColor",
                  opacity: active ? 1 : 0.32,
                }}
              />
            </button>
          );
        })}
      </motion.nav>
    </>
  );
}
