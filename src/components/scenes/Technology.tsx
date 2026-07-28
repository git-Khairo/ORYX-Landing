"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Scene, Marker, Reveal, MaskLines } from "@/components/layout/Scene";
import { SceneMedia } from "@/components/media/SceneMedia";

const ACCENT = "#b48a50";

/**
 * Scene 03. The operational intelligence layer.
 *
 * Deliberately not a dashboard. It shows what the technology produces
 * for the client, in the client's language, and claims nothing
 * proprietary.
 */
const CAPABILITIES = [
  {
    index: "01",
    name: "Digital coordination",
    line: "Schedules, changes and handovers move through one channel instead of four.",
  },
  {
    index: "02",
    name: "Operational visibility",
    line: "You can see the status of the work without asking anyone for it.",
  },
  {
    index: "03",
    name: "Structured quality control",
    line: "Checks follow a defined route, and what they find is recorded.",
  },
  {
    index: "04",
    name: "Intelligent scheduling",
    line: "Work is planned around your building, your hours and your people.",
  },
  {
    index: "05",
    name: "Clear service reporting",
    line: "What was done, what was found, what happens next.",
  },
];

export function Technology() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    /* Charcoal, because this scene carries full bleed film behind its
       copy. A cream scrim over footage does two bad things at once: it
       bleaches the picture and it leaves charcoal type sitting on a
       mid tone. A dark scrim keeps the film readable as film and puts
       cream type on it, which is the higher contrast pairing. */
    <Scene
      id="technology"
      label="Technology makes service better"
      accent={ACCENT}
      tone="charcoal"
    >
      {/* tone still has to be told to the drawing: the scrim reads the
          scene's own --scrim-rgb, but the canvas picks its stroke
          colour in JS and cannot inherit a CSS variable. */}
      <SceneMedia
        slot="technology"
        variant="telemetry"
        accent={ACCENT}
        tone="charcoal"
        scrim="left"
      />

      {/* Vertical budget matters here. The scene was overflowing 100svh
          by about 44px at a 720px viewport, and because the pager gives
          no extra stop for an overflow that small, the foot of the
          scene was simply cut off. Padding and row rhythm are tuned to
          fit one viewport. */}
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-[100rem] grid-cols-1 items-center gap-10 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:gap-20 lg:px-16">
        <div className="lg:col-span-6">
          <Reveal>
            <Marker index="03">Operational intelligence</Marker>
          </Reveal>

          <h2 className="t-display-sm mt-8">
            <MaskLines lines={["Ready is a system,", "not a slogan."]} />
          </h2>

          <Reveal delay={0.2}>
            <p className="t-lede mt-8">
              Technology sits behind every detail so the service stays
              consistent. Visibility without constant supervision.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:pl-10">
          <ul className="border-t border-[color:var(--line-soft)]">
            {CAPABILITIES.map((c, i) => {
              const isActive = i === active;
              return (
                <li key={c.index} className="border-b border-[color:var(--line-soft)]">
                  <button
                    type="button"
                    className="group relative block w-full cursor-default py-5 text-left"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={isActive}
                  >
                    <span className="flex items-baseline gap-5">
                      <span
                        className="t-index text-[0.6875rem] transition-colors duration-500"
                        style={{ color: isActive ? ACCENT : undefined }}
                      >
                        {c.index}
                      </span>
                      <span
                        className="text-xl tracking-tight transition-colors duration-500 sm:text-2xl"
                        style={{
                          // Dimming with opacity was tuned for light
                          // text on near black. On cream it drops
                          // below AA, so the inactive state is a real
                          // colour instead.
                          color: isActive
                            ? "var(--ink)"
                            : "var(--ink-muted)",
                        }}
                      >
                        {c.name}
                      </span>
                    </span>

                    <motion.span
                      className="block overflow-hidden"
                      initial={false}
                      animate={{
                        height: isActive ? "auto" : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{
                        duration: reduce ? 0.15 : 0.45,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <span className="block max-w-[46ch] pl-[3.1rem] pt-3 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                        {c.line}
                      </span>
                    </motion.span>

                    <motion.span
                      className="absolute bottom-0 left-0 block h-px"
                      style={{ background: ACCENT }}
                      initial={false}
                      animate={{ width: isActive ? "100%" : "0%" }}
                      transition={{ duration: reduce ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[44ch] text-sm leading-relaxed text-[color:var(--ink-muted)]">
              Better systems make better service. The work still gets done by
              people who show up prepared.
            </p>
          </Reveal>
        </div>
      </div>
    </Scene>
  );
}
