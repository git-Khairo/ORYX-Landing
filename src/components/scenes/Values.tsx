"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Scene, Marker, Reveal } from "@/components/layout/Scene";
import { VALUES } from "@/lib/content";

const ACCENT = "#b48a50";
const EASE = [0.16, 1, 0.3, 1] as const;
const DWELL = 4200;

/**
 * Scene 08. Values.
 *
 * A directory, not a list. Seven words held as a small numbered index
 * down the left, and whichever one is current set very large in the
 * serif on the right with its statement under it. The index is the
 * control; the panel is the consequence. Reading the index alone still
 * tells you what the seven values are, which is the test a directory
 * has to pass.
 *
 * No film here on purpose. This is the last cream scene before the page
 * goes dark again, and the eye has had footage behind it since the
 * hero. One typographic moment is the rest before the closing.
 *
 * It advances on its own, and any pointer, focus or arrow key takes it
 * over permanently. Tabs semantics rather than a list, because that is
 * exactly what this is: seven controls and one panel.
 */
export function Values() {
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
   * Arrows move through the directory. The page pager also listens for
   * arrow keys on the window, so a handled key is stopped here: inside
   * a tablist the arrows belong to the tablist.
   */
  const onKey = (e: React.KeyboardEvent) => {
    const last = VALUES.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      next = i === last ? 0 : i + 1;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      next = i === 0 ? last : i - 1;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = last;
    }
    if (next === null) return;
    e.preventDefault();
    e.stopPropagation();
    take(next);
    tabs.current[next]?.focus();
  };

  const current = VALUES[i];

  return (
    <Scene id="values" label="Values" accent={ACCENT}>
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[104rem] flex-col justify-center px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
        <Reveal y={16}>
          <Marker index="08">Values</Marker>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* The index. Small, numbered, complete. */}
          <div
            role="tablist"
            aria-label="Values"
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
                  id={`value-tab-${idx}`}
                  aria-selected={on}
                  aria-controls="value-panel"
                  tabIndex={on ? 0 : -1}
                  onMouseEnter={() => take(idx)}
                  onFocus={() => take(idx)}
                  onClick={() => take(idx)}
                  className="group flex w-full items-baseline gap-5 border-b border-[color:var(--line-soft)] py-3 text-left first:border-t"
                >
                  <span
                    className="t-index w-6 shrink-0 text-[0.6875rem] transition-colors duration-500"
                    style={{ color: on ? "var(--ink)" : "var(--ink-muted)" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* The accent enters as a rule that grows out of the
                      active row, never as coloured text: gold at this
                      size does not clear contrast on cream. */}
                  <span
                    className="relative block h-px shrink-0 self-center overflow-hidden transition-all duration-500"
                    style={{ width: on ? "2.5rem" : "0.75rem" }}
                    aria-hidden="true"
                  >
                    <span
                      className="absolute inset-0 block"
                      style={{
                        background: on ? ACCENT : "var(--line)",
                      }}
                    />
                  </span>

                  <span
                    className="block text-base tracking-tight transition-colors duration-500 sm:text-[1.0625rem]"
                    style={{ color: on ? "var(--ink)" : "var(--ink-muted)" }}
                  >
                    {v.word}
                  </span>
                </button>
              );
            })}
          </div>

          {/* The panel. One word at display scale, one statement under a
              hairline. Reserved height, so cycling never moves the page. */}
          <div
            role="tabpanel"
            id="value-panel"
            aria-labelledby={`value-tab-${i}`}
            tabIndex={-1}
            className="order-1 flex min-h-[14rem] flex-col justify-center lg:order-2 lg:col-span-8 lg:min-h-[22rem] lg:border-l lg:border-[color:var(--line-soft)] lg:pl-16"
          >
            <p className="t-index text-[0.6875rem] text-[color:var(--ink-muted)]">
              {String(i + 1).padStart(2, "0")} / {String(VALUES.length).padStart(2, "0")}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.word}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
                transition={{ duration: reduce ? 0.2 : 0.55, ease: EASE }}
              >
                <p
                  className="font-display mt-5 tracking-[-0.02em]"
                  style={{
                    fontSize: "clamp(2.75rem, 6.6vw, 7rem)",
                    lineHeight: 0.94,
                  }}
                >
                  {current.word}
                </p>

                <span
                  className="mt-7 block h-px w-16"
                  style={{ background: ACCENT }}
                  aria-hidden="true"
                />

                <p className="mt-6 max-w-[34ch] text-lg leading-relaxed tracking-tight text-[color:var(--ink)] lg:text-xl">
                  {current.line}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Every statement is in the document regardless of what the
            panel is currently showing, so nothing depends on catching
            the rotation or on being able to hover. */}
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
