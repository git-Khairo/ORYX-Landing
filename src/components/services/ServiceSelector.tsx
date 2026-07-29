"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Scene, Marker } from "@/components/layout/Scene";
import { SERVICES, type ServiceId } from "@/lib/content";
import {
  TransportFigure,
  CleaningFigure,
  FacilityFigure,
} from "@/components/art/figures";
import { useExperience } from "@/lib/store";

/**
 * Scene 04. Three territories.
 *
 * Not three cards. Each territory is a drawn world: a night street
 * for transport, an office at first light for cleaning, a sectioned
 * building for facility. Hairline dividers between them, type at the
 * foot, the scene left open above it. The one being looked at takes
 * more room and its tint arrives; the other two stay quiet.
 *
 * A territory carries an index, a name, one promise and a way in.
 * Nothing else. Detail belongs inside the world, not on the doorway.
 */
/* Each territory is its own drawn world. The figures read
   var(--accent), and each panel scopes that to its service tint, so
   the same discipline that colours the type colours the scene. */
const PANEL: Record<ServiceId, React.ComponentType<{ className?: string }>> = {
  transportation: TransportFigure,
  cleaning: CleaningFigure,
  facility: FacilityFigure,
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
        <div className="mx-auto w-full max-w-[104rem] px-6 pb-16 pt-[calc(var(--nav-h)+4rem)] sm:px-10 lg:px-16">
          <Marker index="04">Three services. One agreement.</Marker>
        </div>

        <div className="flex flex-1 flex-col border-t border-[color:var(--line-soft)] lg:flex-row">
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
                className="group relative flex min-h-[34svh] flex-1 items-end border-b border-[color:var(--line-soft)] text-left last:border-b-0 lg:min-h-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
                /* The service tint is scoped to this panel, so every
                   accent reference below resolves to it and to nothing
                   else on the page. */
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
                    same object. Rendered only while this service is
                    closed: two live nodes on one layoutId would break
                    the transition. */}
                {!isOpen && (
                  <motion.div
                    layoutId={`world-${s.id}`}
                    className="absolute inset-0 z-0"
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <PanelScene service={s.id} active={isHovered} />
                    {/* Scrim at the foot only, so type has somewhere to
                        sit and the illustration stays open above it. */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, color-mix(in oklab, var(--base) 88%, transparent) 0%, color-mix(in oklab, var(--base) 50%, transparent) 44%, transparent 84%)",
                      }}
                    />
                    {/* The tint, which arrives only on the active
                        territory and leaves the other two neutral. */}
                    <div
                      className="absolute inset-0 transition-opacity duration-700"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        background:
                          "linear-gradient(to top, color-mix(in oklab, var(--accent) 20%, transparent) 0%, transparent 56%)",
                      }}
                    />
                  </motion.div>
                )}

                <div className="relative z-10 w-full px-6 pb-12 pt-20 sm:px-10 lg:px-12 lg:pb-16 lg:pt-28">
                  <span
                    className="t-label t-index block transition-colors duration-500"
                    style={{
                      color: isHovered ? s.accent : "var(--ink-muted)",
                    }}
                  >
                    {s.index}
                  </span>

                  {/* The tint may carry a name at display size. It may
                      not carry the promise underneath it. */}
                  <span
                    className="t-display-xs mt-8 block max-w-[13ch] transition-colors duration-500"
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

                  <span className="t-lede mt-5 block">{s.promise}</span>

                  <span
                    className="t-label mt-12 inline-flex items-center gap-2 transition-colors duration-500"
                    style={{
                      color: isHovered ? s.accent : "var(--ink-muted)",
                    }}
                  >
                    Open
                    <ArrowUpRight
                      size={12}
                      weight="bold"
                      className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>

                  <span
                    className="mt-5 block h-px w-full origin-left transition-transform duration-700"
                    style={{
                      background: s.accent,
                      transform: `scaleX(${isHovered ? 1 : 0})`,
                    }}
                    aria-hidden="true"
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


/**
 * One territory's scene.
 *
 * Dormant panels hold their drawing at quarter strength so the row
 * reads as three worlds waiting rather than three posters shouting.
 * Attention brings the active one up, and the base wash at the foot
 * keeps the copy readable whatever the scene is doing behind it.
 */
function PanelScene({
  service,
  active,
}: {
  service: ServiceId;
  active: boolean;
}) {
  const Figure = PANEL[service];
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: active ? 0.95 : 0.28 }}
      >
        <Figure className="h-full w-full" />
      </div>
    </div>
  );
}
