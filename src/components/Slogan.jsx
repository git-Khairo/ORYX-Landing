import { brand } from '../content/copy'

/**
 * The slogan, with the four letters it is built from picked out.
 *
 * "Our Reliability, Your eXcellence" spells ORYX, and until now nothing on the
 * page showed that outside the intro film. Each of the four letters gets its
 * own span so it can take the sand accent while the rest of the line stays
 * white. The pairs come from `brand.letters` rather than from the first letter
 * of each word, because the last one is the X inside eXcellence.
 *
 * The visible line is hidden from screen readers and the plain sentence is
 * read instead. Four coloured spans would otherwise be announced as fragments.
 */
const JOIN = [' ', ', ', ' ', '']

export function SloganWord({ k, w }) {
  const at = w.indexOf(k)
  if (at < 0) return w
  return (
    <>
      {w.slice(0, at)}
      <b className="slogan-k">{k}</b>
      {w.slice(at + 1)}
    </>
  )
}

export default function Slogan({ as: Tag = 'p', className = '' }) {
  return (
    /* English on every page, so it is marked English: read with Dutch or
       German pronunciation it would not be understood. */
    <Tag className={`slogan ${className}`} lang="en">
      <span className="sr-only">{brand.slogan}</span>
      <span aria-hidden="true">
        {brand.letters.map(({ k, w }, i) => (
          <span key={k}>
            <SloganWord k={k} w={w} />
            {JOIN[i]}
          </span>
        ))}
      </span>
    </Tag>
  )
}
