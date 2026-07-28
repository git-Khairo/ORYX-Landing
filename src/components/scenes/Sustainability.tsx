"use client";

import { Scene, Marker, Reveal, MaskLines } from "@/components/layout/Scene";
import { SceneMedia } from "@/components/media/SceneMedia";

const ACCENT = "#7d8a5f";

/**
 * Scene 06. The one leaf passage.
 *
 * Composition: an editorial spread. Everywhere else in the experience
 * the film is a texture living behind the type. Here it is a subject.
 * A single tall plate, bordered, holding roughly a third of the width,
 * with the argument set beside it as a numbered sequence.
 *
 * That is why this one gets `scrim="none"`. A scrim exists to protect
 * copy, and no copy sits on this picture, so covering it would only
 * make the plate grey for no reason.
 *
 * The row is stretched rather than centred, so the plate ends exactly
 * where the last practice ends. Two edges agreeing down the page is
 * most of what makes a report spread feel composed.
 *
 * Nothing here claims an environmental outcome. Every line describes a
 * practical behaviour, which is the only kind of claim we can stand
 * behind.
 */
const PRACTICES = [
  {
    title: "Thoughtful use of resources",
    line: "Correct dosing and longer lasting materials. Less product, same standard.",
  },
  {
    title: "Efficient coordination",
    line: "Combined runs and planned routes remove trips nobody needed to make.",
  },
  {
    title: "Responsible service choices",
    line: "Methods and materials selected for the building, not for the invoice.",
  },
  {
    title: "Long term thinking",
    line: "Preventive work costs less and wastes less than repeated repair.",
  },
];

export function Sustainability() {
  return (
    <Scene id="sustainability" label="Sustainability" accent={ACCENT}>
      {/* `content-center` with a single stretched row: the row is as tall
          as the copy, the plate matches it, and the pair sits in the
          middle of the viewport. */}
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-[104rem] grid-cols-1 content-center items-stretch gap-y-12 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:gap-x-16 lg:px-16 xl:gap-x-24">
        {/* The plate. Bordered, not masked: this is a picture on a page. */}
        <figure className="flex flex-col lg:col-span-4">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-[color:var(--line)] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[46svh] lg:flex-1">
            <SceneMedia
              slot="sustainability"
              variant="organic"
              accent={ACCENT}
              scrim="none"
            />
          </div>

          <figcaption className="mt-4">
            <p className="t-label flex items-baseline gap-3">
              <span className="t-index">Plate 06</span>
              <span
                className="h-px flex-1"
                style={{ background: ACCENT, opacity: 0.55 }}
                aria-hidden="true"
              />
              <span>The long view</span>
            </p>
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-[color:var(--ink-muted)]">
              Efficiency and responsibility point the same direction. An
              operation that wastes less is usually an operation that runs
              better.
            </p>
          </figcaption>
        </figure>

        <div className="flex flex-col justify-between lg:col-span-8 lg:col-start-5">
          <div>
            <Reveal y={16}>
              <Marker index="06">Sustainability</Marker>
            </Reveal>

            <h2 className="t-display-sm mt-8 max-w-[18ch]">
              <MaskLines
                lines={["Responsible operations", "are better operations."]}
                stagger={0.14}
              />
            </h2>
          </div>

          {/* Four practices as an index rather than four little
              articles: number in the margin, practice on the left,
              what it means on the right, hairline between. Setting them
              across the row instead of stacking each pair is what keeps
              the whole spread inside one viewport at 720px, and it is
              also simply how a report lists things.

              The top rule carries the leaf so the accent enters as
              structure. As text at this size it would not clear
              contrast on cream. */}
          <ol className="mt-10 border-t lg:mt-12" style={{ borderColor: ACCENT }}>
            {PRACTICES.map((p, i) => (
              <li
                key={p.title}
                className="border-b border-[color:var(--line)]"
              >
                <Reveal delay={i * 0.09} y={14}>
                  <div className="flex items-baseline gap-5 py-3.5 sm:gap-6 lg:py-4">
                    <span className="t-index w-6 shrink-0 text-[0.6875rem] text-[color:var(--ink-muted)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-8">
                      <p className="text-base tracking-tight text-[color:var(--ink)] sm:w-[13rem] sm:shrink-0 lg:w-[15rem] lg:text-[1.0625rem]">
                        {p.title}
                      </p>
                      <p className="max-w-[52ch] flex-1 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                        {p.line}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Scene>
  );
}
