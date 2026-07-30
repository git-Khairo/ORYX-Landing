"use client";

import { useReducedMotion } from "motion/react";
import { useId, type CSSProperties } from "react";

/**
 * The ORYX figure library.
 *
 * Each figure is a self-contained SVG scene composed around one
 * service's story: a night street for transport, a dawn office for
 * cleaning, a building section for facility, a city of routes for the
 * hero, a radar for readiness, a route of stations for the process.
 * Miniature worlds, not icons, and not the mark repeated six times.
 *
 * Two disciplines hold the set together:
 *
 *  - Colour is never written down. Everything is the live accent and
 *    the ink tokens, mixed with color-mix, so every figure is correct
 *    in all three candidate palettes, and inside a service territory
 *    (which scopes --accent to its own tint) the same figure simply
 *    turns that service's colour.
 *  - Perpetual motion is SMIL, not JavaScript. Travelling dots, dash
 *    flows and flickering windows are <animate>/<animateMotion>,
 *    which cost nothing on the main thread. Under reduced motion the
 *    animated elements are not rendered at all and the still
 *    composition carries the scene.
 *
 * No text anywhere in these drawings. Copy belongs to the copy layer,
 * and drawings with fake labels read as fake screenshots.
 */

const mix = (pct: number, into = "transparent") =>
  `color-mix(in oklab, var(--accent) ${pct}%, ${into})`;
const inkMix = (pct: number, into = "transparent") =>
  `color-mix(in oklab, var(--ink) ${pct}%, ${into})`;

const s = (v: CSSProperties) => v;

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

/** A four-point glint, the "clean" sparkle. */
function Glint({
  x,
  y,
  r,
  begin,
  animate,
}: {
  x: number;
  y: number;
  r: number;
  begin: string;
  animate: boolean;
}) {
  return (
    <g>
      <path
        d={`M ${x} ${y - r} L ${x + r * 0.28} ${y - r * 0.28} L ${x + r} ${y} L ${x + r * 0.28} ${y + r * 0.28} L ${x} ${y + r} L ${x - r * 0.28} ${y + r * 0.28} L ${x - r} ${y} L ${x - r * 0.28} ${y - r * 0.28} Z`}
        style={s({ fill: "var(--accent)" })}
        opacity={animate ? 0 : 0.7}
      >
        {animate ? (
          <animate
            attributeName="opacity"
            values="0;0.9;0"
            dur="3.2s"
            begin={begin}
            repeatCount="indefinite"
          />
        ) : null}
      </path>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 01 Transport: the last van of the night                             */
/* ------------------------------------------------------------------ */

/**
 * A van crossing a sleeping Dutch street. Stepped gables behind, a
 * route arc overhead with a parcel travelling it, the road flowing
 * underneath. Movement is the whole story, so almost everything in
 * the frame is on its way somewhere.
 */
export function TransportFigure({ className = "" }: { className?: string }) {
  const id = useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={s({ stopColor: mix(9) })} />
          <stop offset="70%" style={s({ stopColor: "transparent" })} />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={s({ stopColor: mix(38) })} />
          <stop offset="100%" style={s({ stopColor: "transparent" })} />
        </linearGradient>
        <linearGradient id={`${id}-road`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={s({ stopColor: inkMix(10) })} />
          <stop offset="100%" style={s({ stopColor: "transparent" })} />
        </linearGradient>
      </defs>

      <rect width="300" height="400" fill={`url(#${id}-sky)`} />

      {/* Row houses: stepped gables, the Dutch skyline in four strokes. */}
      <g style={s({ stroke: inkMix(26), fill: inkMix(5) })} strokeWidth="1">
        <path d="M 10 218 L 10 130 L 22 130 L 22 118 L 36 118 L 36 106 L 52 106 L 52 118 L 64 118 L 64 218 Z" />
        <path d="M 70 218 L 70 112 L 84 96 L 98 112 L 98 218 Z" />
        <path d="M 104 218 L 104 138 L 116 138 L 116 124 L 132 124 L 132 138 L 144 138 L 144 218 Z" />
        <path d="M 150 218 L 150 104 L 163 92 L 176 104 L 176 128 L 188 128 L 188 218 Z" />
        <path d="M 194 218 L 194 142 L 206 142 L 206 128 L 224 128 L 224 142 L 238 142 L 238 218 Z" />
        <path d="M 244 218 L 244 118 L 258 102 L 272 118 L 272 218 Z" />
      </g>

      {/* A few windows still lit. The city is asleep; the work is not. */}
      <g style={s({ fill: "var(--accent)" })}>
        {[
          [30, 150, "0s"],
          [83, 132, "1.4s"],
          [122, 158, "2.6s"],
          [163, 120, "0.8s"],
          [214, 160, "2s"],
          [257, 140, "3.1s"],
        ].map(([x, y, begin], i) => (
          <rect key={i} x={Number(x)} y={Number(y)} width="6" height="8" opacity={0.5}>
            {!reduce ? (
              <animate
                attributeName="opacity"
                values="0.25;0.75;0.25"
                dur="5s"
                begin={String(begin)}
                repeatCount="indefinite"
              />
            ) : null}
          </rect>
        ))}
      </g>

      {/* The route overhead: depot to door, one parcel in flight. */}
      <path
        id={`${id}-arc`}
        d="M 18 92 C 90 30 210 30 282 86"
        fill="none"
        style={s({ stroke: mix(45) })}
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      <circle r="5" style={s({ fill: mix(18) })}>
        {!reduce ? (
          <animateMotion dur="7s" repeatCount="indefinite">
            <mpath href={`#${id}-arc`} />
          </animateMotion>
        ) : null}
      </circle>
      <rect x="-2.4" y="-2.4" width="4.8" height="4.8" style={s({ fill: "var(--accent)" })}>
        {!reduce ? (
          <animateMotion dur="7s" repeatCount="indefinite">
            <mpath href={`#${id}-arc`} />
          </animateMotion>
        ) : null}
      </rect>
      {/* Endpoints: where it left, where it lands. */}
      <circle cx="18" cy="92" r="3" fill="none" style={s({ stroke: mix(70) })} strokeWidth="1" />
      <circle cx="282" cy="86" r="3" style={s({ fill: "var(--accent)" })} opacity="0.9" />

      {/* The road, flowing under the van. */}
      <rect x="0" y="218" width="300" height="60" fill={`url(#${id}-road)`} />
      <line x1="0" y1="218" x2="300" y2="218" style={s({ stroke: inkMix(30) })} strokeWidth="1" />
      <line
        x1="0"
        y1="248"
        x2="300"
        y2="248"
        style={s({ stroke: mix(55) })}
        strokeWidth="1.4"
        strokeDasharray="14 12"
      >
        {/* Dashes stream left under a right-facing van, so the road
            reads as passing backward and the van as moving forward. */}
        {!reduce ? (
          <animate attributeName="stroke-dashoffset" from="0" to="52" dur="1.6s" repeatCount="indefinite" />
        ) : null}
      </line>

      {/* The van. Angular, faceted, nose down and moving. */}
      <g>
        {!reduce ? (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -1.6; 0 0"
            dur="2.2s"
            repeatCount="indefinite"
          />
        ) : null}
        {/* headlight cone first, so the body sits over its root */}
        <path d="M 224 236 L 300 226 L 300 252 L 224 246 Z" fill={`url(#${id}-beam)`} />
        {/* body */}
        <path
          d="M 118 208 L 196 208 L 218 218 L 226 232 L 226 244 L 118 244 Z"
          style={s({ fill: inkMix(14), stroke: inkMix(55) })}
          strokeWidth="1.2"
        />
        {/* windshield */}
        <path d="M 198 212 L 214 219 L 220 230 L 198 230 Z" style={s({ fill: mix(26) })} />
        {/* accent livery line, the one brand stroke on the vehicle */}
        <line x1="122" y1="236" x2="222" y2="236" style={s({ stroke: "var(--accent)" })} strokeWidth="1.6" />
        {/* wheels */}
        <circle cx="140" cy="246" r="7" style={s({ fill: "var(--base)", stroke: inkMix(60) })} strokeWidth="1.4" />
        <circle cx="206" cy="246" r="7" style={s({ fill: "var(--base)", stroke: inkMix(60) })} strokeWidth="1.4" />
        {/* speed slivers off the tail */}
        <g style={s({ stroke: mix(60) })} strokeWidth="1.6" strokeLinecap="round">
          <line x1="72" y1="214" x2="112" y2="214">
            {!reduce ? (
              <animate attributeName="opacity" values="0.1;0.9;0.1" dur="1.1s" repeatCount="indefinite" />
            ) : null}
          </line>
          <line x1="60" y1="226" x2="110" y2="226">
            {!reduce ? (
              <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.1s" repeatCount="indefinite" />
            ) : null}
          </line>
          <line x1="80" y1="238" x2="112" y2="238">
            {!reduce ? (
              <animate attributeName="opacity" values="0.1;0.9;0.1" dur="1.3s" repeatCount="indefinite" />
            ) : null}
          </line>
        </g>
      </g>

      {/* Parcels at the kerb, next stop's work. */}
      <g style={s({ stroke: mix(60), fill: mix(10) })} strokeWidth="1">
        <rect x="30" y="258" width="16" height="13" />
        <rect x="40" y="248" width="12" height="10" />
        <line x1="38" y1="258" x2="38" y2="271" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 02 Cleaning: the office at first light                              */
/* ------------------------------------------------------------------ */

/**
 * Dawn through a window grid, a machine crossing the floor, and the
 * floor behind it waking up: brighter tiles, glints, a reflection.
 * The transformation happens before anyone arrives, which is the
 * whole pitch.
 */
export function CleaningFigure({ className = "" }: { className?: string }) {
  const id = useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-dawn`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" style={s({ stopColor: mix(22) })} />
          <stop offset="60%" style={s({ stopColor: mix(6) })} />
          <stop offset="100%" style={s({ stopColor: "transparent" })} />
        </linearGradient>
        <linearGradient id={`${id}-shaft`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={s({ stopColor: mix(20) })} />
          <stop offset="100%" style={s({ stopColor: "transparent" })} />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={s({ stopColor: mix(30) })} />
          <stop offset="70%" style={s({ stopColor: mix(8) })} />
          <stop offset="100%" style={s({ stopColor: "transparent" })} />
        </linearGradient>
      </defs>

      {/* The window wall, dawn behind it. */}
      <g>
        <rect x="26" y="24" width="248" height="180" fill={`url(#${id}-dawn)`} />
        <g style={s({ stroke: inkMix(30) })} strokeWidth="1.4">
          <rect x="26" y="24" width="248" height="180" fill="none" />
          <line x1="108" y1="24" x2="108" y2="204" />
          <line x1="190" y1="24" x2="190" y2="204" />
          <line x1="26" y1="84" x2="274" y2="84" />
          <line x1="26" y1="144" x2="274" y2="144" />
        </g>
        {/* the sun, small and low */}
        <circle cx="212" cy="66" r="10" style={s({ fill: mix(60) })}>
          {!reduce ? (
            <animate attributeName="opacity" values="0.7;1;0.7" dur="6s" repeatCount="indefinite" />
          ) : null}
        </circle>
      </g>

      {/* Light shafts reaching the floor. */}
      <path d="M 108 204 L 190 204 L 258 330 L 128 330 Z" fill={`url(#${id}-shaft)`} opacity="0.5" />
      <path d="M 26 204 L 108 204 L 96 330 L 0 330 Z" fill={`url(#${id}-shaft)`} opacity="0.3" />

      {/* Floor line and tile seams, receding. */}
      <line x1="0" y1="204" x2="300" y2="204" style={s({ stroke: inkMix(35) })} strokeWidth="1" />
      <g style={s({ stroke: inkMix(14) })} strokeWidth="1">
        <line x1="0" y1="238" x2="300" y2="238" />
        <line x1="0" y1="280" x2="300" y2="280" />
        <line x1="0" y1="332" x2="300" y2="332" />
        <line x1="60" y1="204" x2="18" y2="400" />
        <line x1="150" y1="204" x2="150" y2="400" />
        <line x1="240" y1="204" x2="282" y2="400" />
      </g>

      {/* The clean wake: everything left of the machine is awake. */}
      <rect x="0" y="204" width="164" height="196" fill={`url(#${id}-shine)`} opacity="0.55" />

      {/* The machine, mid-crossing. */}
      <g>
        {!reduce ? (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-6 0; 8 0; -6 0"
            dur="7s"
            repeatCount="indefinite"
          />
        ) : null}
        <path
          d="M 158 268 L 186 268 L 192 282 L 188 296 L 156 296 L 152 282 Z"
          style={s({ fill: inkMix(16), stroke: inkMix(55) })}
          strokeWidth="1.2"
        />
        <rect x="166" y="256" width="10" height="12" style={s({ fill: inkMix(10), stroke: inkMix(45) })} strokeWidth="1" />
        <line x1="156" y1="290" x2="188" y2="290" style={s({ stroke: "var(--accent)" })} strokeWidth="1.6" />
        {/* the brush line it leaves behind */}
        <line x1="96" y1="296" x2="154" y2="296" style={s({ stroke: mix(70) })} strokeWidth="2" strokeLinecap="round">
          {!reduce ? (
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.4s" repeatCount="indefinite" />
          ) : null}
        </line>
      </g>

      {/* Glints on the finished floor. */}
      <Glint x={58} y={252} r={7} begin="0s" animate={!reduce} />
      <Glint x={104} y={318} r={9} begin="1.1s" animate={!reduce} />
      <Glint x={36} y={356} r={6} begin="2.3s" animate={!reduce} />
      <Glint x={132} y={232} r={5} begin="3s" animate={!reduce} />

      {/* Desk silhouettes waiting for the day, and one plant. */}
      <g style={s({ stroke: inkMix(30), fill: inkMix(6) })} strokeWidth="1">
        <rect x="216" y="236" width="52" height="4" />
        <line x1="222" y1="240" x2="222" y2="262" />
        <line x1="262" y1="240" x2="262" y2="262" />
        <rect x="230" y="222" width="20" height="14" />
      </g>
      <g style={s({ stroke: mix(55) })} strokeWidth="1.2" fill="none">
        <path d="M 284 232 C 280 220 288 214 290 206" />
        <path d="M 284 232 C 288 224 280 218 282 210" />
        <path d="M 280 232 L 292 232 L 290 244 L 282 244 Z" style={s({ fill: inkMix(10) })} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 03 Facility: the building, sectioned                                */
/* ------------------------------------------------------------------ */

/**
 * A cross-section: five floors, a lift on its way, risers carrying
 * pulses to every level, roof plant turning, and each floor's status
 * point coming online in turn. One accountable partner, drawn as one
 * building whose systems all answer.
 */
export function FacilityFigure({ className = "" }: { className?: string }) {
  const id = useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();
  const floors = [96, 148, 200, 252, 304];

  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-glow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={s({ stopColor: mix(14) })} />
          <stop offset="100%" style={s({ stopColor: "transparent" })} />
        </linearGradient>
      </defs>

      {/* Shell */}
      <rect x="52" y="70" width="196" height="286" style={s({ fill: inkMix(5), stroke: inkMix(40) })} strokeWidth="1.4" />
      <rect x="52" y="70" width="196" height="40" fill={`url(#${id}-glow)`} />

      {/* Roof plant: two units, one fan each. */}
      <g style={s({ stroke: inkMix(45), fill: inkMix(10) })} strokeWidth="1.2">
        <rect x="70" y="48" width="34" height="22" />
        <rect x="196" y="48" width="34" height="22" />
      </g>
      {[87, 213].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="59" r="7" fill="none" style={s({ stroke: mix(60) })} strokeWidth="1" />
          <g style={s({ stroke: mix(80) })} strokeWidth="1.4">
            <line x1={cx - 5} y1="59" x2={cx + 5} y2="59">
              {!reduce ? (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${cx} 59`}
                  to={`360 ${cx} 59`}
                  dur={i === 0 ? "3.4s" : "4.1s"}
                  repeatCount="indefinite"
                />
              ) : null}
            </line>
            <line x1={cx} y1="54" x2={cx} y2="64">
              {!reduce ? (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${cx} 59`}
                  to={`360 ${cx} 59`}
                  dur={i === 0 ? "3.4s" : "4.1s"}
                  repeatCount="indefinite"
                />
              ) : null}
            </line>
          </g>
        </g>
      ))}

      {/* Floor plates */}
      <g style={s({ stroke: inkMix(30) })} strokeWidth="1">
        {floors.map((y) => (
          <line key={y} x1="52" y1={y} x2="248" y2={y} />
        ))}
      </g>

      {/* Lift shaft and the car on its rounds. */}
      <rect x="138" y="70" width="26" height="286" fill="none" style={s({ stroke: inkMix(26) })} strokeWidth="1" strokeDasharray="2 4" />
      <rect x="142" y="0" width="18" height="34" style={s({ fill: mix(16), stroke: mix(70) })} strokeWidth="1.2">
        {!reduce ? (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 74; 0 316; 0 176; 0 74"
            keyTimes="0; 0.45; 0.75; 1"
            dur="14s"
            repeatCount="indefinite"
          />
        ) : (
          <animateTransform attributeName="transform" type="translate" values="0 176" dur="1s" fill="freeze" />
        )}
      </rect>

      {/* Risers, one each side, pulses climbing them. */}
      {[
        { x: 74, dur: "5s" },
        { x: 226, dur: "6.4s" },
      ].map((r) => (
        <g key={r.x}>
          <line x1={r.x} y1="356" x2={r.x} y2="70" style={s({ stroke: inkMix(24) })} strokeWidth="1" />
          <path id={`${id}-riser-${r.x}`} d={`M ${r.x} 356 L ${r.x} 70`} fill="none" stroke="none" />
          {!reduce ? (
            <circle r="2.4" style={s({ fill: "var(--accent)" })}>
              <animateMotion dur={r.dur} repeatCount="indefinite">
                <mpath href={`#${id}-riser-${r.x}`} />
              </animateMotion>
            </circle>
          ) : null}
        </g>
      ))}

      {/* Rooms, sparsely furnished with hairlines. */}
      <g style={s({ stroke: inkMix(18) })} strokeWidth="1">
        <line x1="62" y1="132" x2="118" y2="132" />
        <line x1="176" y1="132" x2="236" y2="132" />
        <line x1="62" y1="236" x2="118" y2="236" />
        <line x1="176" y1="288" x2="236" y2="288" />
        <rect x="62" y="180" width="24" height="20" fill="none" />
        <rect x="196" y="180" width="34" height="20" fill="none" />
        <rect x="62" y="332" width="42" height="14" fill="none" />
      </g>

      {/* Status points, one per floor, answering in sequence. */}
      {floors.map((y, i) => (
        <g key={y}>
          <circle cx="242" cy={y - 10} r="3" fill="none" style={s({ stroke: mix(50) })} strokeWidth="1" />
          <circle cx="242" cy={y - 10} r="1.6" style={s({ fill: "var(--accent)" })} opacity={reduce ? 0.8 : 0.2}>
            {!reduce ? (
              <animate
                attributeName="opacity"
                values="0.15;1;0.15"
                dur="5s"
                begin={`${i * 1}s`}
                repeatCount="indefinite"
              />
            ) : null}
          </circle>
        </g>
      ))}

      {/* Ground, and the one door that is always answered. */}
      <line x1="20" y1="356" x2="280" y2="356" style={s({ stroke: inkMix(40) })} strokeWidth="1.4" />
      <rect x="144" y="332" width="14" height="24" style={s({ fill: mix(20), stroke: mix(70) })} strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 04 Hero: the city that is already running                           */
/* ------------------------------------------------------------------ */

/**
 * A skyline before dawn, and under it the operational layer: one
 * route entering from the left and splitting to three destinations,
 * each already answered. The three branches are the three services,
 * without saying so.
 */
export function HeroFigure({ className = "" }: { className?: string }) {
  const id = useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 600 420"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-horizon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={s({ stopColor: "transparent" })} />
          <stop offset="78%" style={s({ stopColor: mix(10) })} />
          <stop offset="100%" style={s({ stopColor: "transparent" })} />
        </linearGradient>
      </defs>

      <rect width="600" height="420" fill={`url(#${id}-horizon)`} />

      {/* The skyline: gables and towers, one line of a city. */}
      <g style={s({ stroke: inkMix(30), fill: inkMix(4) })} strokeWidth="1.2">
        <path d="M 20 300 L 20 236 L 34 236 L 34 222 L 50 222 L 50 236 L 62 236 L 62 300 Z" />
        <path d="M 70 300 L 70 210 L 86 194 L 102 210 L 102 300 Z" />
        <path d="M 112 300 L 112 172 L 128 172 L 128 158 L 130 148 L 132 158 L 132 172 L 148 172 L 148 300 Z" />
        <path d="M 158 300 L 158 240 L 172 226 L 186 240 L 186 300 Z" />
        <path d="M 196 300 L 196 190 L 240 190 L 240 300 Z" />
        <path d="M 250 300 L 250 246 L 262 246 L 262 232 L 278 232 L 278 246 L 290 246 L 290 300 Z" />
        <path d="M 300 300 L 300 156 L 318 156 L 318 144 L 336 144 L 336 300 Z" />
        <path d="M 346 300 L 346 226 L 360 210 L 374 226 L 374 300 Z" />
        <path d="M 384 300 L 384 182 L 428 182 L 428 300 Z" />
        <path d="M 438 300 L 438 250 L 452 236 L 466 250 L 466 300 Z" />
        <path d="M 476 300 L 476 204 L 490 204 L 490 190 L 506 190 L 506 204 L 520 204 L 520 300 Z" />
        <path d="M 530 300 L 530 240 L 556 240 L 556 300 Z" />
      </g>

      {/* Windows waking, a handful only. */}
      <g style={s({ fill: "var(--accent)" })}>
        {[
          [40, 252, "0s"],
          [85, 232, "2.2s"],
          [122, 196, "1s"],
          [214, 214, "3.4s"],
          [312, 176, "0.6s"],
          [359, 244, "2.8s"],
          [400, 206, "1.8s"],
          [496, 218, "4s"],
          [542, 254, "1.2s"],
        ].map(([x, y, begin], i) => (
          <rect key={i} x={Number(x)} y={Number(y)} width="5" height="7" opacity="0.45">
            {!reduce ? (
              <animate
                attributeName="opacity"
                values="0.2;0.7;0.2"
                dur="6s"
                begin={String(begin)}
                repeatCount="indefinite"
              />
            ) : null}
          </rect>
        ))}
      </g>

      {/* Ground line */}
      <line x1="0" y1="300" x2="600" y2="300" style={s({ stroke: inkMix(35) })} strokeWidth="1.2" />

      {/* The operational layer: one trunk, three branches, three doors. */}
      <g fill="none" strokeWidth="1.4">
        <path
          id={`${id}-trunk`}
          d="M 0 356 C 90 356 130 348 178 344"
          style={s({ stroke: mix(70) })}
        />
        <path
          id={`${id}-b1`}
          d="M 178 344 C 250 336 300 330 348 318 C 380 310 398 306 412 304"
          style={s({ stroke: mix(55) })}
        />
        <path
          id={`${id}-b2`}
          d="M 178 344 C 260 344 340 348 420 356 C 470 360 510 364 560 372"
          style={s({ stroke: mix(55) })}
        />
        <path
          id={`${id}-b3`}
          d="M 178 344 C 230 352 268 366 300 382 C 322 392 344 398 372 402"
          style={s({ stroke: mix(55) })}
        />
      </g>

      {/* The junction where one partner takes over. */}
      <circle cx="178" cy="344" r="4.5" fill="none" style={s({ stroke: "var(--accent)" })} strokeWidth="1.4" />
      <circle cx="178" cy="344" r="1.8" style={s({ fill: "var(--accent)" })} />

      {/* Deliveries in motion along each branch. */}
      {!reduce
        ? [
            { path: `${id}-b1`, dur: "6s", begin: "0s" },
            { path: `${id}-b2`, dur: "7.5s", begin: "1.2s" },
            { path: `${id}-b3`, dur: "5.4s", begin: "2.4s" },
            { path: `${id}-trunk`, dur: "3.2s", begin: "0.6s" },
          ].map((m, i) => (
            <circle key={i} r="2.6" style={s({ fill: "var(--accent)" })}>
              <animateMotion dur={m.dur} begin={m.begin} repeatCount="indefinite">
                <mpath href={`#${m.path}`} />
              </animateMotion>
            </circle>
          ))
        : null}

      {/* The three destinations, answered. */}
      {[
        [412, 304],
        [560, 372],
        [372, 402],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="none" style={s({ stroke: mix(75) })} strokeWidth="1.2" />
          <circle cx={x} cy={y} r="1.6" style={s({ fill: "var(--accent)" })}>
            {!reduce ? (
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="3s"
                begin={`${i * 0.9}s`}
                repeatCount="indefinite"
              />
            ) : null}
          </circle>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 05 Readiness: the watch dial                                        */
/* ------------------------------------------------------------------ */

/**
 * A quiet radar. The sweep goes round, and everything it passes
 * answers. Nothing dramatic happens, which is precisely the promise:
 * ready is a state, not an event.
 */
export function ReadyFigure({ className = "" }: { className?: string }) {
  const id = useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();

  const marks = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const long = i % 6 === 0;
    const r1 = long ? 128 : 136;
    return {
      x1: 200 + Math.cos(a) * r1,
      y1: 200 + Math.sin(a) * r1,
      x2: 200 + Math.cos(a) * 144,
      y2: 200 + Math.sin(a) * 144,
      long,
    };
  });

  const stations = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return {
      x: 200 + Math.cos(a) * 96,
      y: 200 + Math.sin(a) * 96,
      delay: (i / 6) * 9,
    };
  });

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-wedge`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={s({ stopColor: mix(30) })} />
          <stop offset="100%" style={s({ stopColor: "transparent" })} />
        </linearGradient>
      </defs>

      {/* Rings */}
      <g fill="none" style={s({ stroke: inkMix(16) })} strokeWidth="1">
        <circle cx="200" cy="200" r="144" style={s({ stroke: inkMix(28) })} strokeWidth="1.2" />
        <circle cx="200" cy="200" r="96" />
        <circle cx="200" cy="200" r="52" strokeDasharray="2 5" />
      </g>

      {/* Tick marks */}
      <g style={s({ stroke: inkMix(30) })}>
        {marks.map((m, i) => (
          <line
            key={i}
            x1={m.x1}
            y1={m.y1}
            x2={m.x2}
            y2={m.y2}
            strokeWidth={m.long ? 1.6 : 0.8}
            style={m.long ? s({ stroke: mix(60) }) : undefined}
          />
        ))}
      </g>

      {/* The sweep */}
      <g>
        {!reduce ? (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 200 200"
            to="360 200 200"
            dur="9s"
            repeatCount="indefinite"
          />
        ) : null}
        <path d="M 200 200 L 200 58 A 142 142 0 0 1 288 88 Z" fill={`url(#${id}-wedge)`} opacity="0.7" />
        <line x1="200" y1="200" x2="200" y2="58" style={s({ stroke: "var(--accent)" })} strokeWidth="1.4" />
      </g>

      {/* Stations that answer as the sweep passes. */}
      {stations.map((st, i) => (
        <g key={i}>
          <circle cx={st.x} cy={st.y} r="4.5" fill="none" style={s({ stroke: mix(55) })} strokeWidth="1" />
          <circle cx={st.x} cy={st.y} r="1.8" style={s({ fill: "var(--accent)" })} opacity={reduce ? 0.8 : 0.2}>
            {!reduce ? (
              <animate
                attributeName="opacity"
                values="0.15;1;0.35;0.15"
                keyTimes="0;0.06;0.3;1"
                dur="9s"
                begin={`${st.delay}s`}
                repeatCount="indefinite"
              />
            ) : null}
          </circle>
        </g>
      ))}

      {/* Centre: the constant. */}
      <circle cx="200" cy="200" r="6" fill="none" style={s({ stroke: "var(--accent)" })} strokeWidth="1.4" />
      <circle cx="200" cy="200" r="2.2" style={s({ fill: "var(--accent)" })} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 06 Process: four stations, one line                                 */
/* ------------------------------------------------------------------ */

/**
 * The partnership as a route. Four stations with their own small
 * glyphs: a lens that looks, a plan that is drawn, a switch that goes
 * on, a gauge that climbs. The line only reaches as far as the stage
 * the visitor is on, so the drawing and the copy tell one story.
 */
export function ProcessFigure({
  step = 4,
  className = "",
}: {
  /** 1 to 4: how much of the route exists yet. */
  step?: number;
  className?: string;
}) {
  const id = useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();
  const xs = [70, 230, 390, 550];
  const y = 150;
  const active = Math.max(1, Math.min(4, step));

  return (
    <svg
      viewBox="0 0 620 300"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* The whole route, faint: the plan. */}
      <path
        d={`M ${xs[0]} ${y} C 130 110 170 110 ${xs[1]} ${y} S 330 190 ${xs[2]} ${y} S 490 110 ${xs[3]} ${y}`}
        fill="none"
        style={s({ stroke: inkMix(18) })}
        strokeWidth="1.2"
        strokeDasharray="3 6"
      />

      {/* The route as far as it has been built. */}
      <path
        id={`${id}-done`}
        d={`M ${xs[0]} ${y} C 130 110 170 110 ${xs[1]} ${y} S 330 190 ${xs[2]} ${y} S 490 110 ${xs[3]} ${y}`}
        fill="none"
        style={s({
          stroke: "var(--accent)",
          strokeDasharray: 1,
          strokeDashoffset: 1 - (active - 1) / 3,
          transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)",
        })}
        strokeWidth="1.8"
        pathLength={1}
      />

      {/* The carrier, moving along what exists. */}
      {!reduce && active > 1 ? (
        <circle r="3" style={s({ fill: "var(--accent)" })}>
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            keyPoints={`0;${(active - 1) / 3};${(active - 1) / 3};0;0`}
            keyTimes="0;0.42;0.6;0.6;1"
            calcMode="linear"
          >
            <mpath href={`#${id}-done`} />
          </animateMotion>
        </circle>
      ) : null}

      {/* Stations. */}
      {xs.map((x, i) => {
        const on = i < active;
        const dim = s({ stroke: on ? "var(--accent)" : inkMix(30) });
        return (
          <g key={x}>
            <circle cx={x} cy={y} r="7" fill="none" style={dim} strokeWidth="1.4" />
            <circle cx={x} cy={y} r="2.4" style={s({ fill: on ? "var(--accent)" : inkMix(30) })} />

            {/* Each station's glyph, above the line. */}
            <g fill="none" strokeWidth="1.3" style={dim} opacity={on ? 1 : 0.45}>
              {i === 0 ? (
                /* the lens: understand */
                <>
                  <circle cx={x} cy={y - 52} r="13" />
                  <line x1={x + 9} y1={y - 43} x2={x + 18} y2={y - 34} />
                </>
              ) : null}
              {i === 1 ? (
                /* the drawn plan: design */
                <>
                  <rect x={x - 15} y={y - 66} width="30" height="26" />
                  <line x1={x - 15} y1={y - 57} x2={x + 15} y2={y - 57} />
                  <line x1={x - 5} y1={y - 57} x2={x - 5} y2={y - 40} />
                </>
              ) : null}
              {i === 2 ? (
                /* the switch, on: activate */
                <>
                  <rect x={x - 17} y={y - 60} width="34" height="16" rx="8" />
                  <circle
                    cx={on ? x + 9 : x - 9}
                    cy={y - 52}
                    r="5.5"
                    style={s({
                      fill: on ? "var(--accent)" : "transparent",
                      transition: "all 500ms cubic-bezier(0.22,1,0.36,1)",
                    })}
                  />
                </>
              ) : null}
              {i === 3 ? (
                /* the gauge, climbing: improve */
                <>
                  <path d={`M ${x - 14} ${y - 44} A 14 14 0 1 1 ${x + 14} ${y - 44}`} />
                  <line x1={x} y1={y - 52} x2={x + (on ? 8 : -8)} y2={y - (on ? 60 : 58)} style={s({ stroke: on ? "var(--accent)" : inkMix(30), transition: "all 700ms cubic-bezier(0.22,1,0.36,1)" })} />
                </>
              ) : null}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 07 Contact: the light left on                                       */
/* ------------------------------------------------------------------ */

/**
 * Night proper, one office lit at the top of one building, a signal
 * ringing out from its mast. Whoever is reading this scene at 01:40
 * is exactly who it is drawn for.
 */
export function SignalFigure({ className = "" }: { className?: string }) {
  const id = useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 500 400"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* The block, mostly dark. */}
      <g style={s({ stroke: inkMix(28), fill: inkMix(4) })} strokeWidth="1.2">
        <path d="M 60 340 L 60 260 L 74 246 L 88 260 L 88 340 Z" />
        <path d="M 98 340 L 98 228 L 142 228 L 142 340 Z" />
        <path d="M 152 340 L 152 268 L 166 268 L 166 254 L 182 254 L 182 268 L 194 268 L 194 340 Z" />
        <path d="M 204 340 L 204 140 L 260 140 L 260 340 Z" />
        <path d="M 270 340 L 270 250 L 284 236 L 298 250 L 298 340 Z" />
        <path d="M 308 340 L 308 216 L 352 216 L 352 340 Z" />
        <path d="M 362 340 L 362 276 L 376 276 L 376 262 L 392 262 L 392 276 L 404 276 L 404 340 Z" />
        <path d="M 414 340 L 414 244 L 442 244 L 442 340 Z" />
      </g>

      {/* Dark windows on the tall one, and the single lit floor. */}
      <g style={s({ stroke: inkMix(16) })} strokeWidth="1">
        {[160, 180, 200, 220, 240, 260, 280, 300].map((wy) => (
          <line key={wy} x1="212" y1={wy} x2="252" y2={wy} />
        ))}
      </g>
      <rect x="208" y="148" width="48" height="10" style={s({ fill: mix(35) })}>
        {!reduce ? (
          <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />
        ) : null}
      </rect>

      {/* The mast and its signal. */}
      <line x1="232" y1="140" x2="232" y2="116" style={s({ stroke: mix(70) })} strokeWidth="1.4" />
      <circle cx="232" cy="112" r="2.4" style={s({ fill: "var(--accent)" })} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="232" cy="112" r="8" fill="none" style={s({ stroke: "var(--accent)" })} strokeWidth="1" opacity={reduce ? 0.3 : 0}>
          {!reduce ? (
            <>
              <animate attributeName="r" values="6;44" dur="3.6s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0" dur="3.6s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
            </>
          ) : null}
        </circle>
      ))}

      {/* Ground, and the reply on its way in. */}
      <line x1="20" y1="340" x2="480" y2="340" style={s({ stroke: inkMix(35) })} strokeWidth="1.2" />
      <path
        id={`${id}-reply`}
        d="M 500 384 C 420 380 340 368 268 348 C 248 342 238 338 232 330"
        fill="none"
        style={s({ stroke: mix(45) })}
        strokeWidth="1.2"
        strokeDasharray="4 6"
      />
      {!reduce ? (
        <circle r="2.6" style={s({ fill: "var(--accent)" })}>
          <animateMotion dur="5s" repeatCount="indefinite">
            <mpath href={`#${id}-reply`} />
          </animateMotion>
        </circle>
      ) : null}
    </svg>
  );
}
