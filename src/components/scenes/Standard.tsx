"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Scene, Marker } from "@/components/layout/Scene";
import { ReadyFigure } from "@/components/art/figures";
import { VALUES } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;
const DWELL = 4200;

/**
 * Scene 03. What ORYX holds itself to.
 *
 * This one chapter replaces four: Technology, Why ORYX, Values and
 * Sustainability were all making the same argument in four different
 * layouts, which is exactly how a site starts reading as a document.
 * One directory, seven entries, one statement at a time.
 *
 * The tablist below is ported wholesale from the old Values scene
 * rather than rewritten. It is a complete APG implementation and it
 * was the best accessibility work in the previous build, so it moves
 * across intact: roving tabindex, arrow and Home and End with
 * wraparound, auto advance that stops permanently on any interaction,
 * a reserved-height panel so cycling never moves the page, and every
 * statement in the document regardless of what is on screen.
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

  /**
   * Arrows belong to the tablist while focus is inside it. pager.ts
   * also listens for arrow keys on window, so a handled key has to be
   * stopped here or the page pages instead of the list advancing.
   */
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
      {/* The radar: everything the sweep passes, answers. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-[-4%] -z-10 hidden w-[46%] items-center opacity-80 lg:flex"
        aria-hidden="true"
      >
        <ReadyFigure className="h-full max-h-[72svh] w-full" />
      </div>
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[100rem] flex-col justify-center px-6 py-20 sm:px-10 lg:px-16">
        <Marker index="03">The standard</Marker>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div
            role="tablist"
            aria-label="What we hold to"
            aria-orientation="vertical"
            onKeyDown={onKey}
            onMouseLeave={() => setHeld(false)}
            className="order-2 lg:order-1 lg:col-span-4"
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
                  className="flex w-full items-baseline gap-5 border-b border-[color:var(--line-soft)] py-3 text-left first:border-t"
                >
                  <span
                    className="t-index w-6 shrink-0 text-[0.6875rem] transition-colors duration-500"
                    style={{ color: on ? "var(--ink)" : "var(--ink-muted)" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {/* The accent arrives as a rule, not as coloured
                      text, so it never has to clear a text contrast
                      bar it cannot reach on every palette. */}
                  <span
                    className="block h-px shrink-0 self-center transition-all duration-500"
                    style={{
                      width: on ? "2.5rem" : "0.75rem",
                      background: on ? "var(--accent)" : "var(--line)",
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="block text-base tracking-tight transition-colors duration-500"
                    style={{ color: on ? "var(--ink)" : "var(--ink-muted)" }}
                  >
                    {v.word}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="standard-panel"
            aria-labelledby={`standard-tab-${i}`}
            tabIndex={-1}
            className="order-1 flex min-h-[13rem] flex-col justify-center lg:order-2 lg:col-span-8 lg:min-h-[24rem] lg:border-l lg:border-[color:var(--line-soft)] lg:pl-16"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.word}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: reduce ? 0.2 : 0.5, ease: EASE }}
              >
                <p className="t-display-sm">{current.word}</p>
                <p className="mt-6 max-w-[32ch] text-lg leading-snug tracking-tight lg:text-xl">
                  {current.line}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-12 text-sm text-[color:var(--ink-muted)] lg:mt-16">
          Set it once. Trust it continuously.
        </p>

        {/* Every statement is in the document whatever the panel is
            showing, so nothing depends on catching the rotation or on
            being able to hover. */}
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
