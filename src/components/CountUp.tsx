import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from '../lib/motion.ts'

/**
 * Chiffre clé animé à son arrivée à l'écran :
 * « 459 → 0 » décompte de 459 à 0, « 92 » compte de 0 à 92, le reste s'affiche tel quel.
 * Le lecteur d'écran lit toujours la valeur finale ; la largeur est réservée (pas de saut de mise en page).
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, threshold: 0.6 })
  const reduced = useReducedMotion()

  const range = value.match(/^(\d+) → (\d+)$/)
  const single = value.match(/^(\d+)$/)
  const from = range ? +range[1] : 0
  const to = range ? +range[2] : single ? +single[1] : 0
  const animated = !!(range || single)

  const [n, setN] = useState(from)

  useEffect(() => {
    if (!animated || !inView) return
    if (reduced) {
      setN(to)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration)
      // Décélération en paliers : le compteur « cliquette » comme un compteur de jeu.
      const eased = 1 - Math.pow(1 - k, 3)
      setN(Math.round(from + (to - from) * eased))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animated, inView, reduced, from, to, duration])

  if (!animated) return <span className="count">{value}</span>

  const width = `${String(Math.max(from, to)).length}ch`
  return (
    <span ref={ref} className="count">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {range && <>{range[1]} → </>}
        <span className="count__num" style={{ minWidth: width }}>
          {n}
        </span>
      </span>
    </span>
  )
}
