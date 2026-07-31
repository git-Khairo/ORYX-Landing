"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Scene, Marker } from "@/components/layout/Scene";
import { ProcessStage } from "@/components/art/oryx3d/ProcessStage";
import { PROCESS } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;
const DWELL = 3600;

/**
 * Scene 04. How the partnership works.
 *
 * Four columns divided by hairlines, not four cards, and exactly one
 * viewport. The previous version spent four viewports on this and
 * still said less; the client's complaint was density of words, not
 * shortage of them, so the four stages now sit side by side and only
 * the active one carries its explanation.
 *
 * It advances on its own and yields permanently to any pointer, focus
 * or keyboard interaction, so it is never fighting the visitor.
 */
export function Process() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (reduce || held) return;
    const id = window.setInterval(
      () => setI((n) => (n + 1) % PROCESS.length),
      DWELL,
    );
    return () => window.clearInterval(id);
  }, [reduce, held]);

  const take = (index: number) => {
    setI(index);
    setHeld(true);
  };

  return (
    <Scene id="process" label="How the partnership works">
      {/* Four steps in space, the active one lifted and lit, in step
          with the copy below. Replaces the old flat route drawing. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[8%] -z-10 hidden h-[42svh] justify-center lg:flex"
        aria-hidden="true"
      >
        <div className="h-full w-full max-w-[70rem]">
          <ProcessStage active={i} />
        </div>
      </div>
      <div
        className="mx-auto flex min-h-[100svh] w-full max-w-[100rem] flex-col justify-center px-6 py-20 sm:px-10 lg:px-16"
        onMouseLeave={() => setHeld(false)}
      >
        <Marker index="04">How it works</Marker>

        <h2 className="t-display-sm mt-8 max-w-[18ch]">
          Understand, then build the thing that fits.
        </h2>

        {/* The track. Position within the process, drawn once. */}
        <div className="mt-12 h-px w-full lg:mt-16" style={{ background: "var(--line)" }}>
          <motion.div
            className="h-px origin-left"
            style={{ background: "var(--accent)" }}
            initial={false}
            animate={{ scaleX: (i + 1) / PROCESS.length }}
            transition={{ duration: reduce ? 0.15 : 0.7, ease: EASE }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((stage, idx) => {
            const on = idx === i;
            return (
              <button
                key={stage.index}
                type="button"
                onMouseEnter={() => take(idx)}
                onFocus={() => take(idx)}
                onClick={() => take(idx)}
                aria-expanded={on}
                className="group border-b border-[color:var(--line-soft)] pb-6 pt-6 text-left lg:border-b-0 lg:border-r lg:pr-8 lg:last:border-r-0"
              >
                <span
                  className="t-index block text-[0.6875rem] transition-colors duration-500"
                  style={{ color: on ? "var(--accent)" : "var(--ink-muted)" }}
                >
                  {stage.index}
                </span>
                <span
                  className="mt-4 block text-2xl tracking-tight transition-colors duration-500 lg:text-3xl"
                  style={{ color: on ? "var(--ink)" : "var(--ink-muted)" }}
                >
                  {stage.title}
                </span>

                <motion.span
                  className="block overflow-hidden"
                  initial={false}
                  animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                  transition={{ duration: reduce ? 0.15 : 0.45, ease: EASE }}
                >
                  <span className="block max-w-[30ch] pt-4 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                    {stage.line}
                  </span>
                </motion.span>
              </button>
            );
          })}
        </div>

        {/* All four explanations stay in the document, so the content
            never depends on the rotation being caught. */}
        <ul className="sr-only">
          {PROCESS.map((s) => (
            <li key={s.index}>
              {s.title}. {s.line} {s.body}
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}
