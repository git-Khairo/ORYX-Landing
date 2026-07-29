"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { SERVICES, type ServiceId } from "@/lib/content";
import { useExperience } from "@/lib/store";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The gateway question, answered by choosing one of three doors.
 *
 * The previous version stood three filled panels side by side, each
 * with its own drawing, its own gradient and its own cast shadow. On a
 * dark stage that is three competing pictures. The doors are now three
 * full width thresholds separated by hairlines: index, name, promise,
 * arrow. Nothing is filled, so the question above them stays the
 * loudest thing on the screen.
 *
 * Accent discipline: the accent carries the edge bar and the arrow
 * ring, never a word. Every colour resolves from the palette variables,
 * so the surface is correct in all three palettes without a branch.
 */
export function Doors() {
  const choose = useExperience((s) => s.chooseContactService);
  const [hovered, setHovered] = useState<ServiceId | null>(null);
  const reduce = useReducedMotion();

  const question = ["What can we make", "ready for you?"];

  return (
    <div className="relative flex h-full flex-col overflow-y-auto overscroll-contain lg:overflow-hidden">
      {/* Composition. A marker, then the question at display scale,
          each line rising out of its own mask like every other piece of
          display type in the experience. */}
      <div className="shrink-0 px-6 pb-10 pt-10 sm:px-10 lg:px-14 lg:pb-14 lg:pt-14">
        <div className="mx-auto w-full max-w-[104rem]">
          <motion.p
            className="t-label flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span
              className="block h-px w-10 bg-[color:var(--accent)]"
              aria-hidden="true"
            />
            <span>Three environments</span>
          </motion.p>

          <h2 className="t-display mt-7 max-w-[15ch] text-[clamp(2.3rem,5.6vw,5rem)]">
            {question.map((line, i) => (
              <span key={line} className="mask-line">
                <motion.span
                  className="block"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: "106%" }}
                  animate={{ opacity: 1, y: "0%" }}
                  transition={{
                    duration: reduce ? 0.35 : 1.05,
                    delay: reduce ? 0 : 0.06 + i * 0.09,
                    ease: EASE,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-end px-6 pb-6 sm:px-10 lg:px-14 lg:pb-10">
        <div className="mx-auto w-full max-w-[104rem] border-t border-[color:var(--line-soft)]">
          {SERVICES.map((s, i) => {
            const active = hovered === s.id;
            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => choose(s.id)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(s.id)}
                onBlur={() => setHovered(null)}
                className="group relative flex w-full items-center gap-5 border-b border-[color:var(--line-soft)] py-6 pl-5 pr-1 text-left transition-colors duration-500 sm:gap-8 sm:py-7 lg:py-8"
                style={{
                  background: active
                    ? "color-mix(in oklab, var(--accent) 6%, transparent)"
                    : "transparent",
                }}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0.35 : 0.8,
                  delay: reduce ? 0 : 0.16 + i * 0.08,
                  ease: EASE,
                }}
                aria-label={`${s.name}. ${s.promise} Start this request.`}
              >
                {/* Edge bar. The one accent that is allowed to be a
                    colour here, because it carries no text. */}
                <span
                  className="absolute inset-y-0 left-0 block w-[2px] origin-center bg-[color:var(--accent)] transition-transform duration-500"
                  style={{ transform: `scaleY(${active ? 1 : 0})` }}
                  aria-hidden="true"
                />

                <span
                  className="t-index shrink-0 text-[0.6875rem] tracking-[0.2em] transition-colors duration-500"
                  style={{ color: active ? "var(--ink)" : "var(--ink-muted)" }}
                  aria-hidden="true"
                >
                  {s.index}
                </span>

                <span className="flex min-w-0 flex-1 flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-10">
                  <span className="t-display-xs block min-w-0 flex-1 text-[color:var(--ink)]">
                    {s.name}
                  </span>
                  <span className="block max-w-[34ch] text-sm leading-relaxed text-[color:var(--ink-muted)] lg:text-right">
                    {s.promise}
                  </span>
                </span>

                <span
                  className="control flex h-10 w-10 shrink-0 items-center justify-center border transition-colors duration-500"
                  style={{
                    borderColor: active ? "var(--accent)" : "var(--line)",
                    color: active ? "var(--accent)" : "var(--ink-muted)",
                  }}
                  aria-hidden="true"
                >
                  <ArrowRight
                    size={14}
                    weight="bold"
                    className="transition-transform duration-500 group-hover:translate-x-0.5"
                  />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
