"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { ArrowLeft } from "@phosphor-icons/react";
import { OperationalCanvas } from "@/components/media/OperationalCanvas";
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
 * It stays charcoal because it grows out of a charcoal territory
 * panel. Holding the dark is what makes the shared element read as
 * one object rather than two. Type inside uses literal cream values,
 * and the root declares the charcoal tone so the shared type classes
 * resolve against the dark surface instead of the cream page.
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

  return (
    <motion.div
      className="fixed inset-0 z-[100] text-[#f4efe6]"
      style={{ ["--accent" as string]: service.accent } as React.CSSProperties}
      data-tone="charcoal"
      role="dialog"
      aria-modal="true"
      aria-label={`${service.name}. ${service.promise}`}
    >
      {/* The shared element arriving from the selector */}
      <motion.div
        layoutId={`world-${service.id}`}
        className="absolute inset-0 z-0"
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="absolute inset-0 bg-charcoal" />
        <OperationalCanvas
          variant={service.media}
          accent={service.accent}
          className="absolute inset-0 h-full w-full"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 30%, rgba(28,28,26,0.55) 0%, rgba(28,28,26,0.9) 60%, rgba(28,28,26,0.97) 100%)",
          }}
        />
      </motion.div>

      <div ref={trap} className="absolute inset-0 z-10">
        {/* Persistent control. Always reachable, never in the way. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
          <motion.div
            className="h-px origin-left"
            style={{ scaleX: progress, background: service.accent }}
            aria-hidden="true"
          />
          <div className="pointer-events-auto mx-auto flex w-full max-w-[104rem] items-center justify-between gap-4 px-6 py-5 sm:px-10 lg:px-14">
            <button
              type="button"
              onClick={onClose}
              className="control group inline-flex items-center gap-2.5 border border-[color:var(--line)] bg-charcoal/70 px-4 py-2.5 text-[0.8125rem] text-[#f4efe6] backdrop-blur-sm transition-colors hover:border-[color:rgba(244,239,230,0.6)]"
            >
              <ArrowLeft
                size={14}
                weight="bold"
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              All services
            </button>
            <span
              className="t-index text-[0.6875rem] tracking-[0.2em]"
              style={{ color: service.accent }}
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
              <p className="t-lede mt-10 max-w-[46ch]">{service.lede}</p>
            </section>

            {service.scenes.map((scene, i) => (
              <SubScene
                key={scene.marker}
                scene={scene}
                index={i}
                accent={service.accent}
                still={stillFor(service.id, i)}
              />
            ))}

            {/* Service specific close */}
            <section className="mx-auto flex min-h-[80svh] w-full max-w-[104rem] flex-col justify-center px-6 py-28 sm:px-10 lg:px-14">
              <div className="border-t border-[color:var(--line-soft)] pt-12">
                <p className="t-display-sm max-w-[14ch]">
                  {service.contactPrompt}
                </p>
                <p className="t-lede mt-6">
                  A short set of questions about this service, then a written
                  operational answer from our team.
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
 * Sub-scenes rotate through four compositions so no two consecutive
 * moments inside a world share a layout.
 *
 * Most of them now carry a real photograph. The exception is the third
 * beat in every world, which is the one about systems and visibility,
 * and that one keeps its operational drawing. So each world alternates
 * between photography and diagram instead of turning into a gallery.
 */
function SubScene({
  scene,
  index,
  accent,
  still,
}: {
  scene: Service["scenes"][number];
  index: number;
  accent: string;
  still: Still | null;
}) {
  const reduce = useReducedMotion();
  const family = index % 4;
  const mediaFirst = family === 2;
  const isFullBleed = family === 1;
  const isTextOnly = family === 3;

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
      <p className="mt-7 max-w-[44ch] text-base leading-relaxed text-[#b9b3a6]">
        {scene.body}
      </p>
      {scene.notes ? (
        <ul className="mt-9 max-w-[40ch] border-t border-[color:var(--line-soft)]">
          {scene.notes.map((n) => (
            <li
              key={n}
              className="border-b border-[color:var(--line-soft)] py-3.5 text-sm text-[color:rgba(244,239,230,0.8)]"
            >
              {n}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );

  /* Photography is graded to sit in the same world as the film:
     desaturated, contrast lifted a touch, never at full brightness on
     charcoal. The frame is a hairline, not a card. */
  const photoClass =
    "absolute inset-0 h-full w-full object-cover [filter:saturate(0.6)_contrast(1.05)_brightness(0.82)]";

  const media = (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-mask)] border border-[color:var(--line-soft)] lg:aspect-[5/4]">
      {still ? (
        <img
          src={still.src}
          alt={still.alt}
          loading="eager"
          decoding="async"
          className={photoClass}
        />
      ) : (
        <OperationalCanvas
          variant={scene.media}
          accent={accent}
          density={0.7}
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );

  return (
    <motion.section
      className="mx-auto w-full max-w-[104rem] px-6 py-24 sm:px-10 lg:py-32 lg:px-14"
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
        delay: reduce ? 0 : 0.45 + index * 0.06,
        ease: EASE,
      }}
    >
      {isFullBleed ? (
        <div className="relative isolate overflow-hidden rounded-[var(--radius-mask)] border border-[color:var(--line-soft)] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
          {still ? (
            <img
              src={still.src}
              alt={still.alt}
              loading="eager"
              decoding="async"
              className={`-z-10 ${photoClass}`}
            />
          ) : (
            <div className="absolute inset-0 -z-10 opacity-70">
              <OperationalCanvas
                variant={scene.media}
                accent={accent}
                density={0.7}
                className="h-full w-full"
              />
            </div>
          )}
          {/* The copy sits left, so the cover is weighted left too and
              the picture stays open on the right. */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(96deg, rgba(28,28,26,0.94) 0%, rgba(28,28,26,0.86) 42%, rgba(28,28,26,0.5) 72%, rgba(28,28,26,0.35) 100%)",
            }}
          />
          <div className="max-w-[46ch]">{heading}</div>
        </div>
      ) : isTextOnly ? (
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">{heading}</div>
          {still ? (
            <div className="relative aspect-[16/10] w-full self-center overflow-hidden rounded-[var(--radius-mask)] border border-[color:var(--line-soft)] lg:col-span-5 lg:aspect-[4/5]">
              <img
                src={still.src}
                alt={still.alt}
                loading="eager"
                decoding="async"
                className={photoClass}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <div className={`lg:col-span-6 ${mediaFirst ? "lg:order-2" : ""}`}>
            {heading}
          </div>
          <div className={`lg:col-span-6 ${mediaFirst ? "lg:order-1" : ""}`}>
            {media}
          </div>
        </div>
      )}
    </motion.section>
  );
}
