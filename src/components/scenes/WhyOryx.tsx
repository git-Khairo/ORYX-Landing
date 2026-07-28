"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Scene, Marker, Reveal } from "@/components/layout/Scene";
import { SceneMedia } from "@/components/media/SceneMedia";
import { WHY_ORYX } from "@/lib/content";

const ACCENT = "#b48a50";

/** The disciplines the signal reaches. One per differentiator. */
const PILLARS = [
  "Time",
  "Quality",
  "Communication",
  "Technology",
  "Sustainability",
  "Care",
];

/**
 * Scene 05. Why ORYX.
 *
 * Six differentiators presented as one synchronised system rather than
 * six boxes. A single signal in the centre, six disciplines around it,
 * lit in turn. Every statement is in the document, so nothing depends
 * on catching the rotation.
 */
export function WhyOryx() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setI((n) => (n + 1) % WHY_ORYX.length),
      3400,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <Scene id="why" label="Why ORYX" accent={ACCENT}>
      {/* No film here. The radial signal is the picture, and footage
          behind it needed a heavy cream wash that bleached both. The
          drawing alone sits on cream without fighting the type. */}
      <SceneMedia variant="pulse" accent={ACCENT} scrim="none" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[100rem] flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <Reveal>
          <Marker index="05">Why ORYX</Marker>
        </Reveal>

        {/* Radial system, desktop */}
        <div className="relative mt-10 hidden min-h-[50svh] lg:block">
          {PILLARS.map((p, idx) => {
            const angle = (idx / PILLARS.length) * Math.PI * 2 - Math.PI / 2;
            const left = 50 + Math.cos(angle) * 36;
            const top = 50 + Math.sin(angle) * 40;
            const on = idx === i;
            return (
              <button
                key={p}
                type="button"
                onMouseEnter={() => setI(idx)}
                onFocus={() => setI(idx)}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 text-[1.25rem] tracking-tight transition-all duration-700"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  /* The pillars carry colour, which needed the type to
                     grow. Gold is 2.74:1 on cream and fails at any
                     size. Golddeep is 3.95:1, which clears AA only at
                     large text, and large means 18.66px bold. So these
                     are set at 20px semibold rather than as 11px mono
                     labels, and the colour is earned rather than
                     decorative. Inactive uses --ink-muted at 4.77:1. */
                  color: on ? "#9a723c" : "var(--ink-muted)",
                  fontWeight: on ? 600 : 400,
                }}
              >
                <span
                  className="block h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-700"
                  style={{
                    background: on ? "#9a723c" : "var(--line)",
                    transform: on ? "scale(1)" : "scale(0.6)",
                  }}
                  aria-hidden="true"
                />
                {p}
              </button>
            );
          })}

          <div className="absolute left-1/2 top-1/2 w-full max-w-[40rem] -translate-x-1/2 -translate-y-1/2 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="t-display-sm">{WHY_ORYX[i].title}</p>
                <p className="mt-5 text-base text-[color:var(--ink-muted)]">
                  {WHY_ORYX[i].line}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Same system, listed, on small screens and under reduced motion */}
        <ul className="mt-12 grid gap-px border-y border-[color:var(--line-soft)] lg:hidden">
          {WHY_ORYX.map((w) => (
            <li
              key={w.title}
              className="border-b border-[color:var(--line-soft)] py-5 last:border-b-0"
            >
              <p className="text-xl tracking-tight">{w.title}</p>
              <p className="mt-1.5 text-sm text-[color:var(--ink-muted)]">{w.line}</p>
            </li>
          ))}
        </ul>
        <ul className="sr-only hidden lg:block">
          {WHY_ORYX.map((w) => (
            <li key={w.title}>
              {w.title} {w.line}
            </li>
          ))}
        </ul>

        <Reveal delay={0.15}>
          <p className="mt-10 text-center text-lg tracking-tight text-[color:var(--ink)] lg:mt-12 lg:text-xl">
            Set it once. Trust it continuously.
          </p>
        </Reveal>
      </div>
    </Scene>
  );
}
