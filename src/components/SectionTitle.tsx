import { useMemo, type CSSProperties } from 'react'
import { Paw, PixelText } from './Pixel.tsx'

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const TRAIL_COLS = 120
const TRAIL = ['var(--trail-1)', 'var(--trail-2)', 'var(--trail-3)', 'var(--trail-4)', 'var(--trail-5)', 'var(--trail-6)']

/** Traînée de pixels qui se densifie vers la droite, comme les en-têtes du profil GitHub. */
function Trail({ seed }: { seed: number }) {
  const pixels = useMemo(() => {
    const rand = rng(seed)
    const out: { x: number; y: number; fill: string }[] = []
    for (let x = 0; x < TRAIL_COLS; x++) {
      const t = x / TRAIL_COLS
      for (let y = 0; y < 4; y++) {
        if (rand() > 0.12 + t * 0.72) continue
        out.push({ x, y, fill: TRAIL[Math.min(TRAIL.length - 1, Math.floor(rand() * (2 + t * 4)))] })
      }
    }
    return out
  }, [seed])
  return (
    <svg className="trail" viewBox={`0 0 ${TRAIL_COLS} 4`} preserveAspectRatio="xMaxYMid slice" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {pixels.map((p) => (
        <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width="1" height="1" fill={p.fill} style={{ '--d': `${p.x * 9}ms` } as CSSProperties} />
      ))}
    </svg>
  )
}

type Props = { id: string; label: string; pixel?: string; seed: number }

/** Titre de section : vrai <h2> (texte lu) + bandeau pixel décoratif.
 * À l'apparition : le bandeau s'ouvre, le libellé se tape lettre par lettre, la traînée se pose pixel par pixel.
  */
export function SectionTitle({ id, label, pixel, seed }: Props) {
  return (
    <div className="section-title" data-reveal="title">
      <Paw className="section-title__paw" />
      <h2 id={id} className="section-title__h">
        <span className="sr-only">{label}</span>
        <PixelText text={pixel ?? label} className="section-title__px" />
      </h2>
      <Trail seed={seed} />
    </div>
  )
}
