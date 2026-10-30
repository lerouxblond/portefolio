import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useInView, useReducedMotion } from '../lib/motion.ts'
import { FoxHead, PawGrip, type FoxMood } from './Pixel.tsx'

type PeekProps = {
  children: ReactNode
  className?: string
  /** Côté d'où sort la tête. */
  side?: 'left' | 'right'
  /** Sortie automatique une fois, à l'arrivée à l'écran (ms avant de se cacher). */
  autoPeek?: number
  /** Délai avant la sortie automatique (laisse la carte apparaître d'abord). */
  autoDelay?: number
  /** Forçage externe : 'ears' (oreilles seulement), 'head' (tête entière) ou rien. */
  force?: 'ears' | 'head' | null
  mood?: FoxMood
}

/**
 * Le renard passe la tête derrière le bord supérieur d'une carte et pose ses pattes dessus.
 * La tête est derrière la carte (z-index), les pattes devant : la carte reste lisible.
 * Sortie au survol / focus, une fois automatiquement à l'arrivée à l'écran, ou forcée par le parent.
 */
export function Peek({ children, className = '', side = 'right', autoPeek = 0, autoDelay = 700, force = null, mood = 'idle' }: PeekProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, threshold: 0.5 })
  const reduced = useReducedMotion()
  const [auto, setAuto] = useState(false)

  useEffect(() => {
    if (!inView || !autoPeek || reduced) return
    const t1 = window.setTimeout(() => setAuto(true), autoDelay)
    const t2 = window.setTimeout(() => setAuto(false), autoDelay + autoPeek)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [inView, autoPeek, autoDelay, reduced])

  const state = force ?? (auto ? 'head' : undefined)

  return (
    <div ref={ref} className={`peek-wrap peek-wrap--${side} ${className}`} data-peek={state}>
      <span className="peek" aria-hidden="true">
        <FoxHead className="peek__head" rows={12} mood={mood} />
      </span>
      {children}
      <span className="peek__paws" aria-hidden="true">
        <PawGrip />
        <PawGrip />
      </span>
    </div>
  )
}
