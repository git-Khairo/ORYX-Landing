"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { OperationalCanvas } from "@/components/media/OperationalCanvas";
import { SERVICES, type ServiceId } from "@/lib/content";
import { useExperience } from "@/lib/store";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The gateway question, answered by walking into one of three
 * environments rather than picking from a list.
 *
 * The doors reuse the territory treatment from the selector: charcoal
 * objects standing on the cream gateway, with literal cream type
 * inside them. Here they are separated by cream gutters and given a
 * cast shadow, an inset frame line and a threshold rule, so they read
 * as three standing objects on a surface rather than three regions of
 * one image.
 *
 * Accent discipline inside a door: the service colours are rust, leaf
 * and deep gold, and none of them clears AA as text on charcoal. So
 * the accent is carried by the threshold rule, the frame edge and the
 * arrow disc, never by a word or a numeral.
 */
export function Doors() {
  const choose = useExperience((s) => s.chooseContactService);
  const [hovered, setHovered] = useState<ServiceId | null>(null);
  const reduce = useReducedMotion();

  const question = ["What can we make", "ready for you?"];

  return (
    <div className="relative flex h-full flex-col overflow-y-auto overscroll-contain lg:overflow-hidden">
      <div
        className="field-grid pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      />

      {/* Composition. A marker, then the question at display scale,
          each line rising out of its own mask like every other piece of
          display type in the experience. */}
      <div className="relative z-10 shrink-0 px-6 pb-9 pt-1 sm:px-10 lg:px-14 lg:pb-14">
        <div className="mx-auto w-full max-w-[104rem]">
          <motion.p
            className="t-label flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span
              className="rule h-px w-10"
              style={{ background: "var(--accent)", opacity: 0.55 }}
              aria-hidden="true"
            />
            <span>Three environments</span>
          </motion.p>

          <h2 className="t-display mt-7 max-w-[15ch] text-[clamp(2.3rem,6vw,5.5rem)]">
            {question.map((line, i) => (
              <span key={line} className="mask-line">
                <motion.span
                  className="block"
                  initial={
                    reduce ? { opacity: 0 } : { opacity: 0, y: "106%" }
                  }
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

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 px-6 pb-6 sm:px-10 lg:flex-row lg:gap-4 lg:px-14 lg:pb-10">
        {SERVICES.map((s, i) => {
          const active = hovered === s.id;
          const dimmed = hovered !== null && !active;
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => choose(s.id)}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(s.id)}
              onBlur={() => setHovered(null)}
              className="group relative flex min-h-[13.5rem] flex-1 overflow-hidden bg-charcoal text-left lg:min-h-[16rem]"
              style={{
                boxShadow: active
                  ? "0 34px 76px -36px rgba(28,28,26,0.7)"
                  : "0 18px 46px -32px rgba(28,28,26,0.55)",
                transition: "box-shadow 0.7s cubic-bezier(0.16,1,0.3,1)",
              }}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: 34, clipPath: "inset(0% 0% 100% 0%)" }
              }
              animate={
                reduce
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: 0,
                      clipPath: "inset(0% 0% 0% 0%)",
                      flexGrow: active ? 1.42 : dimmed ? 0.9 : 1,
                    }
              }
              transition={{
                default: {
                  duration: reduce ? 0.4 : 0.95,
                  delay: reduce ? 0 : 0.16 + i * 0.09,
                  ease: EASE,
                },
                flexGrow: { duration: 0.7, ease: EASE },
              }}
              aria-label={`${s.name}. ${s.promise} Start this request.`}
            >
              <span className="absolute inset-0 z-0" aria-hidden="true">
                <span
                  className="absolute inset-0 block transition-opacity duration-1000"
                  style={{ opacity: active ? 1 : 0.72 }}
                >
                  <OperationalCanvas
                    variant={s.media}
                    accent={s.accent}
                    className="absolute inset-0 h-full w-full"
                  />
                </span>

                <span
                  className="absolute inset-0 block transition-opacity duration-700"
                  style={{
                    opacity: active ? 0.52 : 0.87,
                    background:
                      "linear-gradient(to top, rgba(28,28,26,0.97) 12%, rgba(28,28,26,0.58) 62%, rgba(28,28,26,0.88) 100%)",
                  }}
                />

                {/* The frame inside the frame. Depth without a shadow
                    stack, and it is what makes the panel read as a door
                    rather than a picture. */}
                <span className="absolute inset-3 block border border-[rgba(244,239,230,0.10)] sm:inset-4" />

                {/* Threshold. The one accent that is allowed to be a
                    colour here, because it carries no text. */}
                <span className="absolute inset-x-0 top-0 block h-px bg-[rgba(244,239,230,0.16)]" />
                <span
                  className="absolute inset-x-0 top-0 block h-[2px] origin-left transition-transform duration-700"
                  style={{
                    background: s.accent,
                    transform: `scaleX(${active ? 1 : 0})`,
                  }}
                />
              </span>

              <span className="relative z-10 flex w-full flex-col justify-between gap-8 p-6 text-[#f4efe6] sm:p-8 lg:p-10">
                <span className="flex items-center gap-3">
                  <span className="t-index text-[0.6875rem] tracking-[0.2em] text-[#b9b3a6]">
                    {s.index}
                  </span>
                  <span
                    className="block h-px w-8 transition-all duration-700"
                    style={{
                      background: active ? s.accent : "rgba(244,239,230,0.24)",
                      width: active ? "3.5rem" : "2rem",
                    }}
                    aria-hidden="true"
                  />
                </span>

                <span className="block">
                  <span className="block max-w-[13ch] text-[clamp(1.5rem,2.3vw,2.4rem)] leading-[1.04] tracking-tight">
                    {s.name}
                  </span>
                  <span className="mt-3.5 block max-w-[27ch] text-sm leading-relaxed text-[#b9b3a6]">
                    {s.promise}
                  </span>

                  <span className="mt-7 inline-flex items-center gap-3 text-[0.8125rem] text-[#f4efe6]">
                    <span
                      className="control flex h-9 w-9 items-center justify-center border transition-colors duration-500"
                      style={{
                        borderColor: active
                          ? s.accent
                          : "rgba(244,239,230,0.3)",
                        background: active
                          ? `color-mix(in oklab, ${s.accent} 22%, transparent)`
                          : "transparent",
                      }}
                      aria-hidden="true"
                    >
                      <ArrowRight
                        size={13}
                        weight="bold"
                        className="transition-transform duration-500 group-hover:translate-x-0.5"
                      />
                    </span>
                    Start here
                  </span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
