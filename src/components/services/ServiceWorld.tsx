"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { ArrowLeft } from "@phosphor-icons/react";
import { Action } from "@/components/ui/Action";
import { useEscape, useFocusTrap, useScrollLock } from "@/lib/hooks";
import { useExperience } from "@/lib/store";
import { stillFor, type Still } from "@/lib/media";
import type { Service } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The expanded service world.
 *
 * The same object that stood in the selector, grown to fill the
 * viewport. It is never a route and never a page: the experience
 * underneath is untouched, and leaving puts the visitor back exactly
 * where they were standing.
 *
 * It is glass, not a lid. A heavy blur and a wash of the base colour
 * put the document out of reach without shutting the stage out, so a
 * world reads as a deeper room in the same building rather than a
 * panel dropped over it. The service tint appears three times only: a
 * glow at the head, the scroll rail and the index. Everything else is
 * type on the dark stage.
 */
export function ServiceWorld({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const trap = useFocusTrap(true);
  const reduce = useReducedMotion();
  const openContact = useExperience((s) => s.openContact);

  const contactOpen = useExperience((s) => s.contactOpen);

  useScrollLock(true);
  // Escape belongs to the topmost layer only, so one press does not
  // close the gateway and the world underneath it at the same time.
  useEscape(!contactOpen, onClose);

  const { scrollYProgress } = useScroll({ container: scroller });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    restDelta: 0.001,
  });

  /* Three beats per world, not five. The content model carries more,
     and the rest is deliberately left unrendered: a world is a short
     sequence of statements, not a document. */
  const scenes = service.scenes.slice(0, 3);

  return (
    <motion.div
      className="fixed inset-0 z-[100]"
      style={
        {
          ["--accent" as string]: service.accent,
          color: "var(--ink)",
        } as React.CSSProperties
      }
      role="dialog"
      aria-modal="true"
      aria-label={`${service.name}. ${service.promise}`}
    >
      {/* The shared element arriving from the selector. Same layoutId
          as the closed territory, and only ever one of the two is
          mounted, which is what lets the panel grow from exactly where
          it was standing. */}
      <motion.div
        layoutId={`world-${service.id}`}
        className="absolute inset-0 z-0 backdrop-blur-2xl"
        transition={{ duration: 0.8, ease: EASE }}
        style={{
          background: "color-mix(in oklab, var(--base) 92%, transparent)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 70% at 50% 0%, color-mix(in oklab, var(--accent) 14%, transparent) 0%, transparent 62%)",
          }}
        />
      </motion.div>

      <div ref={trap} className="absolute inset-0 z-10">
        {/* Persistent control. Always reachable, never in the way. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
          <motion.div
            className="h-px origin-left"
            style={{ scaleX: progress, background: "var(--accent)" }}
            aria-hidden="true"
          />
          <div className="pointer-events-auto mx-auto flex w-full max-w-[104rem] items-center justify-between gap-4 px-6 py-5 sm:px-10 lg:px-14">
            <button
              type="button"
              onClick={onClose}
              className="control group inline-flex items-center gap-2.5 border border-[color:var(--line)] px-5 py-2.5 backdrop-blur-sm transition-colors hover:border-[color:var(--accent)]"
              style={{
                background: "color-mix(in oklab, var(--base) 55%, transparent)",
                color: "var(--ink)",
              }}
            >
              <ArrowLeft
                size={13}
                weight="bold"
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              <span className="t-label" style={{ color: "inherit" }}>
                All services
              </span>
            </button>
            <span
              className="t-label t-index"
              style={{ color: "var(--accent)" }}
            >
              {service.index}
            </span>
          </div>
        </div>

        {/* Inner journey */}
        <div
          ref={scroller}
          className="h-full overflow-y-auto overscroll-contain"
          style={{ scrollbarWidth: "thin" }}
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduce ? 0 : 0.34, ease: EASE }}
          >
            {/* Service hero */}
            <section className="mx-auto flex min-h-[100svh] w-full max-w-[104rem] flex-col justify-center px-6 py-28 sm:px-10 lg:px-14">
              <h2 className="t-display max-w-[16ch]">
                {service.headline.split("\n").map((line, i) => (
                  <span key={line} className="mask-line">
                    <motion.span
                      className="block"
                      initial={reduce ? { opacity: 0 } : { y: "110%" }}
                      animate={reduce ? { opacity: 1 } : { y: "0%" }}
                      transition={{
                        duration: 1,
                        delay: 0.42 + i * 0.1,
                        ease: EASE,
                      }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h2>
              <p className="t-lede mt-10">{service.lede}</p>
            </section>

            {scenes.map((scene, i) => (
              <SubScene
                key={scene.marker}
                scene={scene}
                index={i}
                still={stillFor(service.id, i)}
              />
            ))}

            {/* Service specific close */}
            <section className="mx-auto flex min-h-[70svh] w-full max-w-[104rem] flex-col justify-center px-6 py-28 sm:px-10 lg:px-14">
              <div className="border-t border-[color:var(--line-soft)] pt-12">
                <p className="t-display-sm max-w-[14ch]">
                  {service.contactPrompt}
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Action onClick={() => openContact(service.id)}>
                    Start a request
                  </Action>
                  <Action variant="ghost" arrow="left" onClick={onClose}>
                    All services
                  </Action>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * One beat inside a world: a marker, a title and a single paragraph.
 *
 * The `notes` lists in the content model are deliberately not rendered
 * here. Three stacked lists inside one world was the largest single
 * block of reading in the build, and none of it said anything the
 * paragraph above it had not already said.
 *
 * The photograph is the only physical world proof in the experience,
 * so a beat that has one is built around it and a beat that has none
 * stands as type against a hairline rather than reaching for a
 * substitute. That alternation is what keeps a world from reading as
 * a gallery.
 */
function SubScene({
  scene,
  index,
  still,
}: {
  scene: Service["scenes"][number];
  index: number;
  still: Still | null;
}) {
  const reduce = useReducedMotion();
  const layout = !still ? "type" : index % 2 === 1 ? "bleed" : "split";

  const heading = (
    <>
      <p className="t-label">{scene.marker}</p>
      <h3 className="t-display-sm mt-6 max-w-[16ch]">
        {scene.title.split("\n").map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </h3>
      <p className="t-lede mt-7">{scene.body}</p>
    </>
  );

  /* Photography is graded to sit in the same world as the stage:
     desaturated, contrast lifted a touch, never at full brightness on
     the base. The frame is a hairline, not a card. */
  const photoClass =
    "absolute inset-0 h-full w-full object-cover [filter:saturate(0.6)_contrast(1.05)_brightness(0.82)]";

  return (
    <motion.section
      className="mx-auto w-full max-w-[104rem] px-6 py-24 sm:px-10 lg:py-36 lg:px-14"
      /* Revealed on open, not on scroll.

         `whileInView` observes the document viewport by default, and
         these sections live inside a fixed overlay that scrolls its
         own content. Motion offers a `root` option for exactly this
         case, but the scroller ref is still null at the moment these
         children mount and register their observers, so it does not
         reliably help either.

         A world is opened deliberately, so there is nothing worth
         deferring. Revealing once on open, staggered down the page,
         removes any dependence on an observer firing inside a nested
         scroll container. */
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0.3 : 0.85,
        delay: reduce ? 0 : 0.45 + index * 0.08,
        ease: EASE,
      }}
    >
      {layout === "bleed" && still ? (
        <div className="relative isolate overflow-hidden rounded-[var(--radius-mask)] border border-[color:var(--line-soft)] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
          <img
            src={still.src}
            alt={still.alt}
            loading="eager"
            decoding="async"
            className={`-z-10 ${photoClass}`}
          />
          {/* The copy sits left, so the cover is weighted left too and
              the picture stays open on the right. */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(96deg, color-mix(in oklab, var(--base) 94%, transparent) 0%, color-mix(in oklab, var(--base) 86%, transparent) 42%, color-mix(in oklab, var(--base) 46%, transparent) 72%, color-mix(in oklab, var(--base) 28%, transparent) 100%)",
            }}
          />
          <div className="max-w-[46ch]">{heading}</div>
        </div>
      ) : layout === "split" && still ? (
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">{heading}</div>
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-mask)] border border-[color:var(--line-soft)] lg:aspect-[16/10]">
              <img
                src={still.src}
                alt={still.alt}
                loading="eager"
                decoding="async"
                className={photoClass}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-[color:var(--line-soft)] pt-12 lg:pl-[8%]">
          {heading}
        </div>
      )}
    </motion.section>
  );
}
