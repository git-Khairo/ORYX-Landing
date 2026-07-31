"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { Scene, Marker } from "@/components/layout/Scene";
import { SERVICES, type ServiceId } from "@/lib/content";
import {
  TransportMark,
  CleaningMark,
  FacilityMark,
} from "@/components/art/serviceMarks";
import { useExperience } from "@/lib/store";

/**
 * Scene 02. Three worlds, one way in.
 *
 * Each service is a full-height panel that behaves like a doorway, not
 * a card: a large drawn world behind it, a giant ghosted index for
 * depth, the name, one line, and a single unmistakable way in. Looking
 * at one lets it grow and brings its colour up; the other two step back
 * and go quiet. Almost no words, because the detail lives inside the
 * world, not on the doorstep.
 *
 * The panel background carries `layoutId="world-<id>"`, so opening a
 * service grows this exact surface into the full ServiceWorld. The
 * service tint is scoped to the panel through `--accent`, so every
 * accent reference resolves to that one service and nothing else.
 */
const PANEL: Record<ServiceId, React.ComponentType<{ className?: string }>> = {
  transportation: TransportMark,
  cleaning: CleaningMark,
  facility: FacilityMark,
};

export function ServiceSelector({
  onOpen,
}: {
  onOpen: (id: ServiceId) => void;
}) {
  const [hovered, setHovered] = useState<ServiceId | null>(null);
  const activeService = useExperience((s) => s.activeService);
  const reduce = useReducedMotion();

  return (
    <Scene id="services" label="The three ORYX services">
      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <div className="mx-auto w-full max-w-[110rem] px-6 pb-10 pt-[calc(var(--nav-h)+3.5rem)] sm:px-10 lg:px-16">
          <Marker index="02">Three services. One agreement.</Marker>
          <h2 className="t-display-sm mt-6 max-w-[18ch]">
            Pick a world. Step inside.
          </h2>
        </div>

        <div className="flex flex-1 flex-col border-t border-[color:var(--line-soft)] lg:flex-row">
          {SERVICES.map((s) => {
            const isHovered = hovered === s.id;
            const dimmed = hovered !== null && !isHovered;
            const isOpen = activeService === s.id;
            const Figure = PANEL[s.id];

            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => onOpen(s.id)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(s.id)}
                onBlur={() => setHovered(null)}
                aria-label={`${s.name}. ${s.promise} Open this service.`}
                className="group relative flex min-h-[42svh] flex-1 items-end overflow-hidden border-b border-[color:var(--line-soft)] text-left last:border-b-0 lg:min-h-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
                style={{ ["--accent" as string]: s.accent }}
                animate={
                  reduce
                    ? undefined
                    : { flexGrow: isHovered ? 1.7 : dimmed ? 0.82 : 1 }
                }
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Shared element: this surface grows into the world. It
                    is the only node with the layoutId, and it is not
                    rendered while its own world is open. */}
                {!isOpen && (
                  <motion.div
                    layoutId={`world-${s.id}`}
                    className="absolute inset-0 z-0"
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* The drawn world, held quiet until looked at. */}
                    <motion.div
                      className="absolute inset-0"
                      aria-hidden="true"
                      initial={false}
                      animate={{
                        opacity: isHovered ? 1 : 0.32,
                        scale: reduce ? 1 : isHovered ? 1.04 : 1,
                      }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Figure className="h-full w-full" />
                    </motion.div>

                    {/* Accent bloom from the floor, brightening on focus. */}
                    <div
                      className="absolute inset-0 transition-opacity duration-700"
                      style={{
                        opacity: isHovered ? 1 : 0.4,
                        background:
                          "radial-gradient(120% 80% at 50% 108%, color-mix(in oklab, var(--accent) 28%, transparent) 0%, transparent 60%)",
                      }}
                    />
                    {/* Legibility wash at the foot for the type. */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, color-mix(in oklab, var(--base) 90%, transparent) 0%, color-mix(in oklab, var(--base) 52%, transparent) 40%, transparent 78%)",
                      }}
                    />
                  </motion.div>
                )}

                {/* Giant ghost index, for depth. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-2 z-0 select-none font-semibold leading-none tracking-tighter transition-all duration-700 lg:right-8 lg:top-6"
                  style={{
                    fontSize: "clamp(6rem, 16vw, 13rem)",
                    color: s.accent,
                    opacity: isHovered ? 0.16 : 0.06,
                    fontVariationSettings: '"wdth" 118',
                  }}
                >
                  {s.index}
                </span>

                <div className="relative z-10 w-full px-6 pb-11 pt-24 sm:px-10 lg:px-12 lg:pb-14">
                  <motion.div
                    initial={false}
                    animate={{ y: reduce ? 0 : isHovered ? -6 : 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span
                      className="t-display-xs block max-w-[13ch] transition-colors duration-500"
                      style={{
                        color: isHovered
                          ? s.accent
                          : dimmed
                            ? "var(--ink-muted)"
                            : "var(--ink)",
                      }}
                    >
                      {s.name}
                    </span>

                    <span className="t-lede mt-4 block max-w-[26ch]">
                      {s.promise}
                    </span>

                    {/* One unmistakable way in. */}
                    <span
                      className="control mt-8 inline-flex items-center gap-2.5 border px-5 py-2.5 text-sm tracking-tight transition-all duration-500"
                      style={{
                        borderColor: isHovered
                          ? s.accent
                          : "var(--line)",
                        background: isHovered
                          ? s.accent
                          : "transparent",
                        color: isHovered ? "var(--accent-ink)" : "var(--ink)",
                      }}
                    >
                      Enter
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="transition-transform duration-500 group-hover:translate-x-1"
                      />
                    </span>
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </Scene>
  );
}
