"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Scene, Marker } from "@/components/layout/Scene";
import { OperationalCanvas } from "@/components/media/OperationalCanvas";
import { SERVICES, type ServiceId } from "@/lib/content";
import { useExperience } from "@/lib/store";

/**
 * Scene 04. Three living territories.
 *
 * Not three cards. The viewport is divided into three worlds that
 * respond to attention: the one you are looking at takes more room,
 * its media resolves, its colour arrives, and the other two go quiet.
 * Selecting one grows it into the full experience from where it
 * already stands.
 *
 * The scene itself is cream. The three territories are deliberately
 * dark objects standing on that cream page: each keeps a charcoal
 * base under its drawing, so type inside a panel is cream rather than
 * the scene ink. That contrast is what makes a territory read as a
 * doorway into somewhere else.
 */
export function ServiceSelector({
  onOpen,
}: {
  onOpen: (id: ServiceId) => void;
}) {
  const [hovered, setHovered] = useState<ServiceId | null>(null);
  const activeService = useExperience((s) => s.activeService);
  const reduce = useReducedMotion();

  return (
    <Scene id="services" label="The three ORYX services" accent="#b48a50">
      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <div className="mx-auto w-full max-w-[104rem] px-6 pb-8 pt-[calc(var(--nav-h)+3rem)] sm:px-10 lg:px-16">
          <Marker index="04">Three services. One agreement.</Marker>
        </div>

        <div className="flex flex-1 flex-col lg:flex-row">
          {SERVICES.map((s) => {
            const isHovered = hovered === s.id;
            const dimmed = hovered !== null && !isHovered;
            const isOpen = activeService === s.id;

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
                className="group relative flex min-h-[30svh] flex-1 items-end overflow-hidden border-b border-[color:rgba(244,239,230,0.08)] text-left last:border-b-0 lg:min-h-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
                style={{ ["--accent" as string]: s.accent }}
                animate={
                  reduce
                    ? undefined
                    : { flexGrow: isHovered ? 1.55 : dimmed ? 0.86 : 1 }
                }
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* The shared element. It leaves this panel and becomes
                    the expanded world, so the two are literally the
                    same object. */}
                {!isOpen && (
                  <motion.div
                    layoutId={`world-${s.id}`}
                    className="absolute inset-0 z-0"
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="absolute inset-0 bg-charcoal" />
                    {/* Thinned out. Three drawings running side by
                        side, each under its own panel of type, was too
                        much texture competing for the same attention. */}
                    <OperationalCanvas
                      variant={s.media}
                      accent={s.accent}
                      density={0.5}
                      className="absolute inset-0 h-full w-full"
                    />
                    <div
                      className="absolute inset-0 transition-opacity duration-700"
                      style={{
                        opacity: isHovered ? 0.55 : 0.86,
                        background:
                          "linear-gradient(to top, rgba(28,28,26,0.96) 8%, rgba(28,28,26,0.55) 55%, rgba(28,28,26,0.8) 100%)",
                      }}
                    />
                  </motion.div>
                )}

                {/* Type sits on the charcoal panel, so it uses literal
                    cream values. The scene ink is charcoal here and
                    would disappear into the panel. */}
                <div className="relative z-10 w-full p-6 text-[#f4efe6] sm:p-8 lg:p-10">
                  <span
                    className="t-index block text-[0.6875rem] tracking-[0.2em] transition-colors duration-500"
                    style={{ color: isHovered ? s.accent : "#b9b3a6" }}
                  >
                    {s.index}
                  </span>

                  <span className="mt-5 block max-w-[14ch] text-3xl leading-[1.02] tracking-tight sm:text-4xl lg:text-[2.6rem]">
                    {s.name}
                  </span>

                  <span className="mt-3 block max-w-[26ch] text-sm text-[#b9b3a6]">
                    {s.promise}
                  </span>

                  <motion.span
                    className="block overflow-hidden"
                    initial={false}
                    animate={{
                      height: isHovered && !reduce ? "auto" : 0,
                      opacity: isHovered && !reduce ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="block max-w-[38ch] pt-4 text-sm leading-relaxed text-[color:rgba(244,239,230,0.8)]">
                      {s.detail}
                    </span>
                  </motion.span>

                  <span
                    className="mt-6 inline-flex items-center gap-2 text-[0.8125rem] transition-colors duration-500"
                    style={{ color: isHovered ? s.accent : "#b9b3a6" }}
                  >
                    Open
                    <ArrowUpRight
                      size={14}
                      weight="bold"
                      className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>

                  <span
                    className="mt-6 block h-px w-full origin-left transition-transform duration-700"
                    style={{
                      background: s.accent,
                      transform: `scaleX(${isHovered ? 1 : 0})`,
                    }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </Scene>
  );
}
