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
  children,
}) {
  const ref = useSectionReveal()
  return (
    <section
      id={id}
      ref={ref}
      data-section={index}
      className={`section tone-${tone} ${bg ? 'has-bg' : ''} ${className}`}
    >
      {bg ? <div className="section-bg-wrap">{bg}</div> : null}
      <div className="section-inner">{children}</div>
    </section>
  )
}
