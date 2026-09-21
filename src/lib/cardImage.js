import { cardStills } from '../content/cards'

/**
 * Which picture a card shows.
 *
 * Every card has a stock still to start with, listed in `content/cards.js`.
 * The pictures that are meant to be there are generated ones, made to the
 * prompts in `docs/image-prompts.md`. Dropping a file into
 * `src/assets/cards/<page>/<id>.jpg` is all it takes to swap one in: the glob
 * below finds it at build time and it wins over the stock still. No code
 * changes, and `npm run check:claims` stops listing that card as a
 * placeholder.
 */
const own = import.meta.glob('../assets/cards/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byKey = {}
for (const [path, url] of Object.entries(own)) {
  const m = path.match(/cards\/(.+)\.(?:jpe?g|png|webp)$/i)
  if (m) byKey[m[1]] = url
}

export function cardImage(key) {
  if (byKey[key]) return { src: byKey[key], alt: '' }
  const still = cardStills[key]
  if (!still?.src) return null
  return { src: `${still.src}?auto=compress&cs=tinysrgb&w=1200`, alt: still.alt || '' }
}
