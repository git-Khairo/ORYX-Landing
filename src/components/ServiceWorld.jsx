import TransportWorld from './worlds/TransportWorld'
import WorkforceWorld from './worlds/WorkforceWorld'
import RenovationWorld from './worlds/RenovationWorld'

/**
 * Which world opens.
 *
 * A lookup rather than a template with three tints. The previous component ran
 * all three services through one skeleton and recoloured it, which meant that
 * opening Renovation straight after Transport felt like changing the lighting
 * in a room you were already standing in — the brief was for three pages that
 * are genuinely different, and a shared layout cannot deliver that no matter
 * how it is themed.
 *
 * Each world owns its own sections and its own signature device: Transport is a
 * route line you travel, Workforce is a timetable that fills with people,
 * Renovation is a building that goes up in layers. They share only the chrome,
 * which lives in `WorldShell`.
 */
const WORLDS = {
  transport: TransportWorld,
  workforce: WorkforceWorld,
  renovation: RenovationWorld,
}

export default function ServiceWorld({ service, onClose, onRequest }) {
  const World = WORLDS[service.id]
  /* A service without a world is a content error, not a rendering one — better
     to open nothing than to fall back to a generic page and hide the mistake. */
  if (!World) return null
  return <World service={service} onClose={onClose} onRequest={onRequest} />
}
