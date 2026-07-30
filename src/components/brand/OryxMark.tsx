"use client";

import { useId } from "react";

/**
 * The ORYX brand mark.
 *
 * An abstract line silhouette: two long horns and a head profile,
 * reduced to the fewest strokes that still read as alert. It is a
 * mark, not a mascot. It never speaks and never performs.
 *
 * `draw` animates the strokes as if the route line is forming it,
 * which is the device the opening moment uses. `glow` adds a soft
 * accent halo, and `sheen` sends a slow highlight travelling along the
 * strokes. Both are opt in, so the small Nav mark stays plain.
 */

/* One source of geometry, shared by the visible strokes and the sheen
   overlay, so the two can never drift apart. */
const STROKES: { d: string; delay: string }[] = [
  { d: "M23 41 Q35 24 52 7", delay: "0s" },
  { d: "M15 38 Q28 20 41 5", delay: "0.08s" },
  { d: "M23 41 Q16 47 17 55 Q18 61 27 61", delay: "0.16s" },
  { d: "M15 38 L23 41", delay: "0.22s" },
];

export function OryxMark({
  size = 40,
  className = "",
  draw = false,
  duration = 1.1,
  strokeWidth = 2.2,
  glow = false,
  sheen = false,
}: {
  size?: number;
  className?: string;
  draw?: boolean;
  duration?: number;
  strokeWidth?: number;
  glow?: boolean;
  sheen?: boolean;
}) {
  const id = useId().replace(/[:]/g, "");
  const base = (delay: string) =>
    draw
      ? ({
          strokeDasharray: 140,
          strokeDashoffset: 140,
          animation: `oryx-draw ${duration}s cubic-bezier(0.16,1,0.3,1) forwards`,
          animationDelay: delay,
        } as React.CSSProperties)
      : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={
        glow
          ? {
              filter:
                "drop-shadow(0 0 10px color-mix(in oklab, var(--accent) 45%, transparent))",
            }
          : undefined
      }
    >
      {sheen ? (
        <defs>
          {/* A narrow bright band travelling left to right in user
              space, transparent at both edges so only its crossing
              lights a stroke. */}
          <linearGradient
            id={`${id}-sheen`}
            gradientUnits="userSpaceOnUse"
            x1="-28"
            y1="0"
            x2="-4"
            y2="0"
          >
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop
              offset="50%"
              stopColor="color-mix(in oklab, var(--accent) 85%, white)"
              stopOpacity="0.95"
            />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            <animate
              attributeName="x1"
              from="-28"
              to="70"
              dur="3.6s"
              begin="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              from="-4"
              to="94"
              dur="3.6s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
      ) : null}

      {/* Base strokes: the ink mark. */}
      {STROKES.map((p, i) => (
        <path key={i} d={p.d} style={base(p.delay)} />
      ))}

      {/* Sheen overlay: the same strokes, lit only where the band is. */}
      {sheen
        ? STROKES.map((p, i) => (
            <path key={`s-${i}`} d={p.d} stroke={`url(#${id}-sheen)`} />
          ))
        : null}
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-medium leading-none tracking-[0.34em] ${className}`}
      style={{ letterSpacing: "0.34em" }}
    >
      ORYX
    </span>
  );
}
