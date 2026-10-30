import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
// Mobile : la barre d'adresse qui apparaît / disparaît ne doit pas tout recalculer.
ScrollTrigger.config({ ignoreMobileResize: true })

let lenis: Lenis | null = null
let locked = false

const tick = (time: number) => lenis?.raf(time * 1000)
const resize = () => lenis?.resize()

/** Défilement adouci (Lenis), cadencé par le ticker GSAP et synchronisé avec ScrollTrigger. */
export function startSmoothScroll() {
  if (lenis) return lenis
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
  lenis.on('scroll', ScrollTrigger.update)
  // Après un recalcul (épingles posées / retirées), Lenis reprend les dimensions de la page.
  ScrollTrigger.addEventListener('refresh', resize)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  if (locked) lenis.stop()
  return lenis
}

export function stopSmoothScroll() {
  if (!lenis) return
  gsap.ticker.remove(tick)
  ScrollTrigger.removeEventListener('refresh', resize)
  lenis.destroy()
  lenis = null
}

export const getLenis = () => lenis

/** Bloque le défilement (intro) : Lenis à l'arrêt ; html.intro coupe le défilement natif. */
export function lockScroll() {
  locked = true
  lenis?.stop()
}
export function unlockScroll() {
  locked = false
  lenis?.start()
}

/** Hauteur de l'en-tête collant (les épingles et les ancres se calent dessous). */
export const headerHeight = () => document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0

/** Défile jusqu'à une position ou un élément, via Lenis s'il est actif. */
export function scrollToY(y: number, duration = 1.2) {
  const top = Math.max(0, y)
  if (lenis) lenis.scrollTo(top, { duration })
  else window.scrollTo({ top })
}

export { gsap, ScrollTrigger }
