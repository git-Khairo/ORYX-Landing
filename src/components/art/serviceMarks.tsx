"use client";

import { useId } from "react";
import { useReducedMotion } from "motion/react";

/**
 * The three service marks.
 *
 * One visual language, three arguments. Thin ink hairlines, one accent
 * gesture each, generous space, slow motion. They share the contour
 * feeling of the hero rather than illustrating a literal van, office or
 * building: movement for transport, a resolving surface for cleaning, a
 * coordinating hub for facility. Each panel scopes `--accent` to its
 * service tint, so the accent element simply becomes that service's
 * colour.
 *
 * Perpetual motion is SMIL, so it costs nothing on the main thread, and
 * under reduced motion the animated parts are dropped and the still
 * composition carries the mark.
 */

const ink = (pct: number) =>
  `color-mix(in oklab, var(--ink) ${pct}%, transparent)`;

/* ------------------------------------------------------------------ */
/* Transportation: streams moving forward                             */
/* ------------------------------------------------------------------ */

export function TransportMark({ className = "" }: { className?: string }) {
  const id = useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();

  // Gentle flight paths across the frame, alternating curvature.
  const ys = [70, 116, 162, 208, 254, 300, 346];
  const accentY = 208;
  const path = (y: number) => {
    const bend = ((y / 46) % 2 < 1 ? -1 : 1) * 26;
    return `M -30 ${y} C 90 ${y + bend} 210 ${y - bend} 330 ${y}`;
  };

  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" strokeLinecap="round">
        {ys.map((y) =>
          y === accentY ? null : (
            <path key={y} d={path(y)} stroke={ink(16)} strokeWidth={0.8} />
          ),
        )}

        {/* The one accent stream, and a mark that travels it forward. */}
        <path
          id={`${id}-lane`}
          d={path(accentY)}
          stroke="var(--accent)"
          strokeWidth={1.3}
          opacity={0.85}
        />
        {!reduce ? (
          <g>
            <path
              d="M -6 -4 L 6 0 L -6 4 Z"
              fill="var(--accent)"
            >
              <animateMotion
                dur="6s"
                repeatCount="indefinite"
                rotate="auto"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              >
                <mpath href={`#${id}-lane`} />
              </animateMotion>
            </path>
          </g>
        ) : null}

        {/* Faint departure and arrival ticks. */}
        <g stroke={ink(28)} strokeWidth={1}>
          <line x1="30" y1="196" x2="30" y2="220" />
          <line x1="270" y1="196" x2="270" y2="220" />
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Cleaning: a surface resolving under a passing light                */
/* ------------------------------------------------------------------ */

export function CleaningMark({ className = "" }: { className?: string }) {
  const id = useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();

  const xs = [60, 90, 120, 150, 180, 210, 240];
  const rows = [110, 140, 170, 200, 230, 260, 290];

  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect x="52" y="102" width="196" height="196" />
        </clipPath>
      </defs>

      {/* The fine surface lattice. */}
      <g stroke={ink(15)} strokeWidth={0.8}>
        {xs.map((x) => (
          <line key={`v${x}`} x1={x} y1={104} x2={x} y2={296} />
        ))}
        {rows.map((y) => (
          <line key={`h${y}`} x1={54} y1={y} x2={246} y2={y} />
        ))}
      </g>
      <rect
        x="52"
        y="102"
        width="196"
        height="196"
        fill="none"
        stroke={ink(24)}
        strokeWidth={1}
      />

      {/* A diagonal gleam passing across it. */}
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="-120" y="102" width="120" height="196" fill={`url(#${id}-sweep)`}>
          {!reduce ? (
            <animate
              attributeName="x"
              from="-120"
              to="248"
              dur="5.5s"
              repeatCount="indefinite"
            />
          ) : null}
        </rect>
      </g>

      {/* Two glints where the surface catches. */}
      {!reduce
        ? [
            [120, 150, "0s"],
            [196, 232, "2.4s"],
          ].map(([x, y, begin], i) => (
            <path
              key={i}
              d={`M ${x} ${Number(y) - 6} L ${Number(x) + 2} ${y} L ${x} ${Number(y) + 6} L ${Number(x) - 2} ${y} Z`}
              fill="var(--accent)"
              opacity={0}
            >
              <animate
                attributeName="opacity"
                values="0;0.9;0"
                dur="3.2s"
                begin={String(begin)}
                repeatCount="indefinite"
              />
            </path>
          ))
        : null}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Facility: one hub coordinating the whole                           */
/* ------------------------------------------------------------------ */

export function FacilityMark({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  const cx = 150;
  const cy = 205;
  // Four coordinated points around the hub.
  const nodes = [
    [150, 95],
    [250, 175],
    [212, 305],
    [78, 288],
    [64, 150],
  ];

  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Nested framework. */}
      <g fill="none" stroke={ink(14)} strokeWidth={0.8}>
        <circle cx={cx} cy={cy} r={62} />
        <circle cx={cx} cy={cy} r={104} />
        <circle cx={cx} cy={cy} r={146} />
      </g>

      {/* Connectors from the hub to each coordinated point. */}
      <g stroke={ink(22)} strokeWidth={0.9}>
        {nodes.map(([x, y], i) => (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} />
        ))}
      </g>

      {/* The coordinated points. */}
      <g fill={ink(45)}>
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.6} />
        ))}
      </g>

      {/* The accountable hub, with a slow pulse. */}
      <circle cx={cx} cy={cy} r={5} fill="var(--accent)" />
      {!reduce ? (
        <circle cx={cx} cy={cy} r={5} fill="none" stroke="var(--accent)" strokeWidth={1}>
          <animate attributeName="r" from="5" to="34" dur="3.6s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            from="0.7"
            to="0"
            dur="3.6s"
            repeatCount="indefinite"
          />
        </circle>
      ) : null}
    </svg>
  );
}
