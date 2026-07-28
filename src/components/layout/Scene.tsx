"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type Tone = "cream" | "charcoal";

/**
 * A scene is one moment in the ORYX world.
 *
 * It owns its tone and its accent. Exactly one accent is live at a
 * time, and tone is either the warm world or one of the three
 * charcoal moments. Everything downstream reads `--ink`, `--surface`
 * and `--accent`, so no component ever hard codes a colour.
 *
 * `free` opts a scene out of snapping when its story needs scroll
 * length, so the visitor is never held inside a tall section.
 */
export function Scene({
  id,
  accent,
  tone = "cream",
  free = false,
  label,
  className = "",
  children,
}: {
  id: string;
  accent?: string;
  tone?: Tone;
  free?: boolean;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      data-scene={id}
      data-tone={tone}
      className={`scene ${free ? "scene--free" : ""} relative isolate w-full ${
        free ? "" : "min-h-[100svh]"
      } ${className}`}
      style={
        {
          ...(accent ? { ["--accent" as string]: accent } : {}),
          background: "var(--surface)",
          color: "var(--ink)",
        } as React.CSSProperties
      }
    >
      {children}
    </section>
  );
}

/** Standard content frame. Wide, generous, never a boxed container. */
export function SceneFrame({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[100rem] flex-col justify-center px-6 py-24 sm:px-10 lg:px-16 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Scene marker. A rule, an index and a word. Rationed to the scenes
 * that genuinely need an operational label.
 */
export function Marker({
  index,
  children,
}: {
  index?: string;
  children: ReactNode;
}) {
  return (
    <p className="t-label flex items-center gap-3">
      {index ? (
        <span className="t-index text-[color:var(--accent)]">{index}</span>
      ) : null}
      <span
        className="rule h-px w-10"
        style={{ background: "var(--accent)", opacity: 0.5 }}
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Entrance. Fades only under reduced motion. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration: reduce ? 0.35 : 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Typographic sequencing. Each line rises out of its own mask, which
 * is how display type behaves everywhere in this experience.
 */
export function MaskLines({
  lines,
  className = "",
  delay = 0,
  stagger = 0.1,
}: {
  lines: string[];
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={line + i} className="mask-line">
          <motion.span
            className="block"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: "108%" }}
            whileInView={{ opacity: 1, y: "0%" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reduce ? 0.35 : 1.15,
              delay: delay + i * stagger,
              ease: EASE,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
