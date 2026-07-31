"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Scene, Marker } from "@/components/layout/Scene";
import { MarkStage } from "@/components/art/oryx3d/MarkStage";
import { VALUES } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;
const DWELL = 3800;

/**
 * Scene 03. What ORYX holds itself to.
 *
 * One chapter replaces four: Technology, Why ORYX, Values and
 * Sustainability were all making the same argument in four different
 * layouts. One directory, seven entries, one statement at a time, shown
 * large, with the mark turning quietly behind it in the brand accent so
 * the standard has a presence and not just a list.
 *
 * The tablist is the previous build's APG implementation, kept intact:
 * roving tabindex, arrow / Home / End with wraparound, auto advance that
 * stops permanently on any interaction, and every statement in the
 * document regardless of what is on screen. What changed is the look:
 * the words are a horizontal rail, and the active one is stated at
 * display size rather than tucked in a side panel.
 */
export function Standard() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (reduce || held) return;
    const id = window.setInterval(
      () => setI((n) => (n + 1) % VALUES.length),
      DWELL,
    );
    return () => window.clearInterval(id);
  }, [reduce, held]);

  const take = useCallback((index: number) => {
    setI(index);
    setHeld(true);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const last = VALUES.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    e.stopPropagation();
    take(next);
    tabs.current[next]?.focus();
  };

  const current = VALUES[i];

  return (
    <Scene id="standard" label="The ORYX standard">
      {/* The mark, turning quietly in the brand accent, held back behind
          a wash so the type stays the subject. On-brand and built in
          code, in place of the old stock traffic clip. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[54%] items-center lg:flex"
        aria-hidden="true"
      >
        <div className="h-[70svh] max-h-[640px] w-full">
          <MarkStage variant="ambient" />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to right, var(--base) 0%, color-mix(in oklab, var(--base) 82%, transparent) 42%, color-mix(in oklab, var(--base) 40%, transparent) 100%)",
        }}
      />

      <div className="mx-auto flex min-h-[100svh] w-full max-w-[100rem] flex-col justify-center px-6 py-20 sm:px-10 lg:px-16">
        <Marker index="03">The standard</Marker>

        {/* The active value, stated large. */}
        <div
          role="tabpanel"
          id="standard-panel"
          aria-labelledby={`standard-tab-${i}`}
          tabIndex={-1}
          className="mt-10 min-h-[13rem] lg:mt-14 lg:min-h-[18rem]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.word}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: reduce ? 0.2 : 0.55, ease: EASE }}
            >
              <p className="t-display max-w-[16ch]">{current.word}</p>
              <p className="mt-6 max-w-[34ch] text-lg leading-snug tracking-tight text-[color:var(--ink-muted)] lg:text-xl">
                {current.line}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* The seven, as a rail. */}
        <div
          role="tablist"
          aria-label="What we hold to"
          onKeyDown={onKey}
          onMouseLeave={() => setHeld(false)}
          className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-[color:var(--line-soft)] pt-6 lg:mt-16"
        >
          {VALUES.map((v, idx) => {
            const on = idx === i;
            return (
              <button
                key={v.word}
                ref={(el) => {
                  tabs.current[idx] = el;
                }}
                type="button"
                role="tab"
                id={`standard-tab-${idx}`}
                aria-selected={on}
                aria-controls="standard-panel"
                tabIndex={on ? 0 : -1}
                onMouseEnter={() => take(idx)}
                onFocus={() => take(idx)}
                onClick={() => take(idx)}
                className="group inline-flex items-center gap-2.5 text-left"
              >
                <span
                  className="block h-1.5 w-1.5 rounded-full transition-all duration-500"
                  style={{
                    background: on ? "var(--accent)" : "var(--line)",
                    transform: on ? "scale(1.4)" : "scale(1)",
                  }}
                  aria-hidden="true"
                />
                <span
                  className="text-sm tracking-tight transition-colors duration-500"
                  style={{ color: on ? "var(--ink)" : "var(--ink-muted)" }}
                >
                  {v.word}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-sm text-[color:var(--ink-muted)]">
          Set it once. Trust it continuously.
        </p>

        {/* Every statement stays in the document whatever is on screen. */}
        <ul className="sr-only">
          {VALUES.map((v) => (
            <li key={v.word}>
              {v.word}. {v.line}
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}
