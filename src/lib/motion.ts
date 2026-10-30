import { useEffect, useState, type RefObject } from 'react'

const RM = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia(RM).matches

/** Suit la préférence « réduire les animations » en direct. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia(RM)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

type InViewOptions = { once?: boolean; threshold?: number; rootMargin?: string }

/** Vrai quand l'élément est à l'écran (une seule fois si `once`). */
export function useInView<T extends Element>(ref: RefObject<T | null>, { once = false, threshold = 0.25, rootMargin = '0px' }: InViewOptions = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, threshold, rootMargin])
  return inView
}

/**
 * Apparitions pixel au défilement (titres de section) : chaque élément [data-reveal] reçoit data-shown
 * à son entrée à l'écran. Les blocs et les textes, eux, sont révélés par GSAP (src/lib/scenes.ts).
 * Le masquage initial n'existe que sous html.reveal-on, posé ici : sans JS ou avec « réduire les
 * animations », tout reste visible d'emblée.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
    const root = document.documentElement
    const timers: number[] = []
    // Une fois l'apparition jouée, on retire les animations (des centaines de pixels animés un par un
    // coûtent cher au compositeur à chaque image, même terminées).
    const show = (el: HTMLElement) => {
      el.dataset.shown = ''
      timers.push(window.setTimeout(() => (el.dataset.done = ''), 2200))
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          show(e.target as HTMLElement)
          io.unobserve(e.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
    // Ce qui est déjà visible au chargement s'affiche sans attendre.
    const vh = window.innerHeight
    els.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < vh * 0.92 && r.bottom > 0) show(el)
      else io.observe(el)
    })
    root.classList.add('reveal-on')
    return () => {
      io.disconnect()
      timers.forEach((t) => window.clearTimeout(t))
      root.classList.remove('reveal-on')
    }
  }, [])
}
