import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useInView, useReducedMotion } from '../lib/motion.ts'
import { Paw, TrotFox } from './Pixel.tsx'

const CELL = 4 // taille d'un pixel du renard, en px
const FOX_W = 24 * CELL
const GAP = 72 // espacement des empreintes, comme le séparateur du profil
const PX_PER_S = 260 // vitesse de trot

type Run = { width: number; dist: number; dur: number; steps: number }

/**
 * Bande entre deux sections : à son arrivée à l'écran, le renard la traverse au trot
 * et laisse derrière lui les empreintes du séparateur du profil GitHub.
 * Sans animation : les empreintes sont simplement affichées, sans renard.
 */
export function TrotLane({ direction = 'right' }: { direction?: 'right' | 'left' }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, threshold: 0.9 })
  const reduced = useReducedMotion()
  const [run, setRun] = useState<Run | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reduced || run || !width) return
    const dist = Math.round((width + FOX_W * 2) / CELL) * CELL
    setRun({ width, dist, dur: (dist / PX_PER_S) * 1000, steps: dist / CELL })
  }, [inView, reduced, run, width])

  const count = Math.max(3, Math.floor((width - 40) / GAP))
  const paws = Array.from({ length: count }, (_, i) => 20 + i * GAP)
  const done = reduced || !!run

  return (
    <div
      ref={ref}
      className={`trot-lane trot-lane--${direction}`}
      aria-hidden="true"
      data-running={run ? '' : undefined}
      style={
        run
          ? ({ '--dist': `${run.dist}px`, '--dur': `${run.dur}ms`, '--steps': run.steps } as CSSProperties)
          : undefined
      }
    >
      <div className="trot-lane__track">
        {paws.map((x, i) => {
          // L'empreinte apparaît quand le renard (qui part de -FOX_W) arrive à sa hauteur.
          const delay = run ? ((x + FOX_W * 0.4) / run.dist) * run.dur : 0
          return (
            <span
              key={x}
              className="trot-lane__paw"
              data-on={done ? '' : undefined}
              style={{ left: x, top: i % 2 ? 6 : 26, animationDelay: `${Math.round(delay)}ms` }}
            >
              <Paw />
            </span>
          )
        })}
        {run && <TrotFox className="trot-lane__fox" />}
      </div>
    </div>
  )
}
