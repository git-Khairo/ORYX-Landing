"use client";

import { Scene, Reveal, MaskLines } from "@/components/layout/Scene";
import { SceneMedia } from "@/components/media/SceneMedia";
import { Action } from "@/components/ui/Action";
import { OryxMark, Wordmark } from "@/components/brand/OryxMark";
import { SERVICES } from "@/lib/content";
import { useExperience } from "@/lib/store";

const ACCENT = "#b48a50";

/**
 * Scene 09. The invitation, and the end of the world.
 *
 * Charcoal, like the hero. You enter through the dark, live in the
 * warm, and leave through the dark. The service links open the gateway
 * with that journey already selected, so someone who arrived for one
 * thing does not have to choose it twice.
 */
export function Closing() {
  const openContact = useExperience((s) => s.openContact);

  return (
    <Scene id="contact" label="Contact ORYX" accent={ACCENT} tone="charcoal">
      <SceneMedia
        slot="contact"
        variant="converge"
        accent={ACCENT}
        tone="charcoal"
        scrim="edge"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[104rem] flex-col justify-between px-6 pb-10 pt-[calc(var(--nav-h)+4rem)] sm:px-10 lg:px-16">
        <div className="flex flex-1 flex-col justify-center">
          <h2 className="t-display max-w-[15ch]">
            <MaskLines lines={["One partner.", "Every operational detail."]} />
          </h2>

          <Reveal delay={0.25}>
            <div className="mt-12 flex flex-col gap-8 lg:mt-16 lg:flex-row lg:items-end lg:justify-between">
              <p className="t-lede">
                Tell us what needs to be ready. We will come back with an
                operational answer, not a brochure.
              </p>
              <Action onClick={() => openContact()}>Start a request</Action>
            </div>
          </Reveal>

          <Reveal delay={0.35}>
            <ul className="mt-14 grid gap-px border-t border-[color:var(--line-soft)] sm:grid-cols-3">
              {SERVICES.map((s) => (
                <li key={s.id} className="border-b border-[color:var(--line-soft)]">
                  <button
                    type="button"
                    onClick={() => openContact(s.id)}
                    className="group flex w-full items-baseline gap-4 py-5 text-left"
                  >
                    <span
                      className="t-index text-[0.6875rem]"
                      // The service accents are tuned for cream. Rust
                      // on charcoal is about 2.4:1, so this closing
                      // list keeps the scene accent for its numerals.
                      style={{ color: "var(--accent)" }}
                    >
                      {s.index}
                    </span>
                    <span className="text-base tracking-tight transition-colors duration-300 group-hover:text-[color:var(--accent)]">
                      {s.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* The footer sits on film, so it gets the same treatment the
            navigation gets when it lifts: a blurred plate rather than a
            solid band, so the picture stays visible through it.

            The right padding keeps the contact column clear of the
            journey rail, which is fixed against the right edge and
            vertically centred, and used to land straight on top of it.
            The rail itself was the larger part of that problem and is
            now much narrower, so this only has to cover the ticks. */}
        <footer className="relative mt-16 lg:pr-16 xl:pr-20">
          <div
            className="pointer-events-none absolute inset-x-0 -inset-y-6 -z-10 lg:-left-10 lg:-right-10"
            style={{
              background:
                "linear-gradient(to top, rgba(28,28,26,0.72), rgba(28,28,26,0.34))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              maskImage:
                "linear-gradient(to top, #000 72%, rgba(0,0,0,0.55) 88%, transparent 100%)",
            }}
            aria-hidden="true"
          />
          <div className="border-t border-[color:var(--line-soft)] pt-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3 text-[color:var(--accent)]">
              <OryxMark size={30} strokeWidth={2.2} />
              <div className="leading-tight text-[color:var(--ink)]">
                <Wordmark className="text-sm" />
                <p className="mt-1.5 font-mono text-[0.625rem] tracking-[0.2em] text-[color:var(--ink-muted)]">
                  ALWAYS READY.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-[color:var(--ink-muted)] sm:items-end">
              <a
                href="mailto:hello@oryx.nl"
                className="text-[color:var(--ink)] transition-colors hover:text-[color:var(--accent)]"
              >
                hello@oryx.nl
              </a>
              <p>Operating across the Netherlands.</p>
            </div>
          </div>

          <p className="mt-8 max-w-[60ch] text-xs leading-relaxed text-[color:var(--ink-muted)]">
            We use the details you share only to answer your request. Nothing is
            sold, and nothing is used for unrelated marketing.
          </p>
          </div>
        </footer>
      </div>
    </Scene>
  );
}
