import { useSectionReveal } from '../lib/useSectionReveal'

/**
 * Shared shell for every journey section. Provides the scroll anchor, a tone
 * that drives its background/accent, an optional full-bleed illustration `bg`,
 * and wires the reveal hook so any child with [data-reveal] animates in.
 */
export default function SectionShell({
  id,
  index,
  tone = 'cream',
  bg = null,
  className = '',
  /* One scroll stop per section is the page's whole premise, so it is declared
     here rather than measured. Pass a higher number only for a section that is
     deliberately multi-screen. */
  stops = 1,
  children,
}) {
  const ref = useSectionReveal()
  return (
    <section
      id={id}
      ref={ref}
      data-section={index}
      data-stops={stops}
      className={`section tone-${tone} ${bg ? 'has-bg' : ''} ${className}`}
    >
      {bg ? <div className="section-bg-wrap">{bg}</div> : null}
      <div className="section-inner">{children}</div>
    </section>
  )
}
