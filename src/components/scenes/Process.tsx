"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Scene, Marker, Reveal } from "@/components/layout/Scene";
import { SceneMedia } from "@/components/media/SceneMedia";
import { PROCESS } from "@/lib/content";

const ACCENT = "#b48a50";

/**
 * Scene 07. How the partnership works.
 *
 * The stages used to take over the same space across four screens of
 * scroll, which made the process feel long and made the visitor wait
 * for information they could have compared. A process is a shape. You
 * should be able to see all of it at once.
 *
 * So: one viewport, four vertical columns divided by hairlines, held
 * under a single horizontal rule. The rule carries one travelling
 * segment that sits exactly over the open column, which is the whole
 * position indicator. The open column widens and speaks; the other
 * three stay as index, title and one line, still readable, still
 * comparable.
 *
 * Widths are explicit percentages rather than flex growth, because the
 * travelling segment has to agree with the column edges to the pixel
 * and derived measurements always arrive a frame late.
 *
 * The widening is a CSS transition, not a motion animation. Percentage
 * valued layout properties are exactly what CSS interpolates correctly
 * and reliably, and the global reduced motion rule already collapses
 * every transition in the page, so honouring the preference costs
 * nothing here.
 */

/** How much wider the open column is than a closed one. */
const OPEN = 2.2;
const UNITS = PROCESS.length - 1 + OPEN;
/** The open column's share of the row. Constant, whichever one it is. */
const OPEN_SHARE = OPEN / UNITS;
const EASE = [0.16, 1, 0.3, 1] as const;
const DWELL = 4600;

const share = (index: number, active: number) =>
  (index === active ? OPEN : 1) / UNITS;

export function Process() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  /** A pointer or a focus ring owns the sequence while it is present. */
  const [held, setHeld] = useState(false);
  /** Small screens get an accordion, and a closed accordion is valid. */
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    if (reduce || held) return;
    const id = window.setInterval(
      () => setI((n) => (n + 1) % PROCESS.length),
      DWELL,
    );
    return () => window.clearInterval(id);
  }, [reduce, held]);

  const take = useCallback((index: number) => {
    setI(index);
    setHeld(true);
  }, []);

  return (
    <Scene id="process" label="How the partnership works" accent={ACCENT}>
      {/* Drawing only. Film behind this needed a cream wash heavy
          enough to bleach it, and the four stage sequence is already
          carrying the scene. */}
      <SceneMedia variant="converge" accent={ACCENT} scrim="none" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[104rem] flex-col justify-center px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
        <Reveal y={16}>
          <Marker index="07">How the partnership works</Marker>
        </Reveal>

        <Reveal delay={0.1} y={16}>
          <h2 className="t-display-xs mt-6 max-w-[24ch]">
            Four stages, always in this order.
          </h2>
        </Reveal>

        {/* ---------- Desktop: the four columns ---------- */}
        <div
          className="mt-10 hidden lg:block"
          onMouseLeave={() => setHeld(false)}
        >
          {/* The rule and its travelling segment. One line across the
              whole composition, so position is read in the same glance
              as the columns themselves. */}
          <div
            className="relative h-px w-full bg-[color:var(--line)]"
            aria-hidden="true"
          >
            {/* The open column is always the same fraction of the row,
                so the segment never changes width. It only travels. */}
            <span
              className="absolute -top-px left-0 block h-[2px]"
              style={{
                background: ACCENT,
                width: `${OPEN_SHARE * 100}%`,
                // A closed column is 1 unit and the segment is OPEN
                // units wide, so moving one column along is 1/OPEN of
                // the segment's own width. Transform, so the travel is
                // composited rather than laid out.
                transform: `translateX(${(i / OPEN) * 100}%)`,
                transition: "transform 0.75s var(--ease-scene)",
              }}
            />
          </div>

          <div className="flex h-[clamp(16rem,40svh,22rem)] w-full items-stretch">
            {PROCESS.map((p, idx) => {
              const on = idx === i;
              return (
                <button
                  key={p.index}
                  type="button"
                  className="group relative flex shrink-0 grow-0 cursor-default flex-col border-l border-[color:var(--line-soft)] pr-6 pt-6 text-left first:border-l-0 first:pl-0 [&:not(:first-child)]:pl-6"
                  style={{
                    flexBasis: `${share(idx, i) * 100}%`,
                    transition: "flex-basis 0.75s var(--ease-scene)",
                  }}
                  onMouseEnter={() => take(idx)}
                  onFocus={() => take(idx)}
                  onBlur={() => setHeld(false)}
                  aria-expanded={on}
                >
                  <span
                    className="t-index block text-[0.6875rem] transition-colors duration-500"
                    style={{ color: on ? "var(--ink)" : "var(--ink-muted)" }}
                  >
                    {p.index}
                  </span>

                  <span
                    className="font-display mt-auto block leading-none tracking-[-0.01em] transition-colors duration-500"
                    style={{
                      fontSize: "clamp(1.375rem, 2.1vw, 2.25rem)",
                      // Colour, never opacity. A closed stage is still
                      // meant to be read, so it gets a real muted ink
                      // rather than a faded one.
                      color: on ? "var(--ink)" : "var(--ink-muted)",
                    }}
                  >
                    {p.title}
                  </span>

                  <span className="mt-3 block text-[0.8125rem] leading-relaxed text-[color:var(--ink-muted)]">
                    {p.line}
                  </span>

                  {/* The body area is reserved in every column, open or
                      closed, so widening a column never changes the
                      height of the scene. */}
                  <span className="mt-3 block h-[4.75rem] overflow-hidden">
                    <span
                      className="block max-w-[46ch] text-sm leading-relaxed text-[color:var(--ink-muted)]"
                      style={{
                        opacity: on ? 1 : 0,
                        transform: on ? "none" : "translateY(8px)",
                        transition:
                          "opacity 0.5s var(--ease-scene), transform 0.5s var(--ease-scene)",
                      }}
                    >
                      {p.body}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- Small screens: the same four stages, stacked ----------
            A column that has to be hovered is no use to a thumb, so the
            same content becomes an accordion driven by tap. */}
        <ul className="mt-10 border-t border-[color:var(--line)] lg:hidden">
          {PROCESS.map((p, idx) => {
            const on = open === idx;
            return (
              <li key={p.index} className="border-b border-[color:var(--line)]">
                <button
                  type="button"
                  className="block w-full py-4 text-left"
                  onClick={() => setOpen(on ? null : idx)}
                  aria-expanded={on}
                >
                  <span className="flex items-baseline gap-5">
                    <span
                      className="t-index text-[0.6875rem]"
                      style={{ color: on ? "var(--ink)" : "var(--ink-muted)" }}
                    >
                      {p.index}
                    </span>
                    <span className="font-display text-2xl leading-none tracking-[-0.01em]">
                      {p.title}
                    </span>
                  </span>
                  <span className="mt-2 block pl-10 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                    {p.line}
                  </span>
                  <motion.span
                    className="block overflow-hidden pl-10"
                    initial={false}
                    animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                    transition={{ duration: reduce ? 0.15 : 0.45, ease: EASE }}
                  >
                    <span className="block pt-3 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                      {p.body}
                    </span>
                  </motion.span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Scene>
  );
}
