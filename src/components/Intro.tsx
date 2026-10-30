import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap, lockScroll, unlockScroll } from '../lib/scroll.ts'
import { FOX_EYES, FOX_EYES_CLOSED, FOX_HEAD } from '../lib/sprites.ts'
import { treelineMask } from '../lib/treeline.ts'
import { CellsPath, PixelText, SpritePaths } from './Pixel.tsx'

declare global {
  interface Window {
    __introStarted?: boolean
  }
}

/** Réglages de l'intro (secondes, sur la frise du timeline). */
const T = {
  head: 0, // la tête apparaît en 3 paliers
  name: 0.28, // le nom se tape
  blink: 0.62,
  markOut: 0.9, // tête + nom s'effacent
  curtain: 0.95, // le rideau descend…
  curtainDur: 0.85, // …pendant 0,85 s (expo.inOut)
  forest: 1.15, // les calques de la forêt remontent
  texts: 1.3, // puis les textes du hero
}

const HERO_TEXTS = '.hero__term, .hero__title, .hero__tagline, .hero__status, .hero__actions'

/**
 * Intro à chaque arrivée : tête du renard, clignement, nom tapé en police pixel, puis un rideau descend ;
 * son bord haut est une lisière de sapins qui découvre le ciel, la forêt qui se met en place, puis les textes.
 * Le rideau existe dès le HTML (index.html, html.intro posé avant React) : aucun flash de la page.
 * Passable au clic, Échap, Entrée ou Espace. Jamais avec « réduire les animations » (html.intro absent).
 */
export function Intro() {
  const [host] = useState(() => document.getElementById('intro'))
  const [active, setActive] = useState(() => !!host && document.documentElement.classList.contains('intro'))
  const head = useRef<SVGSVGElement>(null)
  const lid = useRef<SVGGElement>(null)

  useLayoutEffect(() => {
    if (!host) return
    if (!active) {
      host.remove()
      return
    }
    window.__introStarted = true
    const root = document.documentElement
    const curtain = host.querySelector<HTMLElement>('.intro__curtain')!
    const mark = host.querySelector<HTMLElement>('.intro__mark')!
    const edge = host.querySelector<HTMLElement>('.intro__edge')!
    const name = mark.querySelector('.intro__name')
    edge.style.setProperty('--edge-mask', treelineMask(99))

    window.scrollTo(0, 0)
    lockScroll()

    const layers = gsap.utils.toArray<Element>('.hero__layer > *')
    const texts = gsap.utils.toArray<Element>(HERO_TEXTS)
    const setLid = (on: boolean) => lid.current?.setAttribute('opacity', on ? '1' : '0')

    let released = false
    const release = () => {
      if (released) return
      released = true
      root.classList.remove('intro')
      unlockScroll()
      // Arrivée sur une ancre (#projets…) : on y va une fois le rideau levé.
      const target = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null
      if (target) target.scrollIntoView()
    }

    const tl = gsap
      .timeline({
        onComplete: () => {
          release()
          gsap.set([...layers, ...texts], { clearProps: 'transform,opacity' })
          setActive(false)
        },
      })
      .fromTo(head.current, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'steps(3)' }, T.head)
      .fromTo(name, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.36, ease: 'steps(14)' }, T.name)
      .call(setLid, [true], T.blink)
      .call(setLid, [false], T.blink + 0.1)
      .to(mark, { y: -16, opacity: 0, duration: 0.25, ease: 'power2.in' }, T.markOut)
      .fromTo(curtain, { yPercent: 0 }, { yPercent: 108, duration: T.curtainDur, ease: 'expo.inOut' }, T.curtain)
      // Le rideau a fini de descendre : on rend le défilement sans attendre la fin des textes.
      .call(release, [], T.curtain + T.curtainDur)
      .fromTo(layers, { yPercent: 10 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07 }, T.forest)
      .fromTo(texts, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.07 }, T.texts)

    const skip = () => {
      if (tl.isActive() || tl.progress() < 1) tl.progress(1)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.key === 'Tab') {
        if (e.key !== 'Tab') e.preventDefault()
        skip()
      }
    }
    host.addEventListener('click', skip)
    window.addEventListener('keydown', onKey)

    return () => {
      host.removeEventListener('click', skip)
      window.removeEventListener('keydown', onKey)
      // Démontage (ou double montage de StrictMode en dev) : on tue sans « finir » ;
      // le second montage relance l'intro depuis le début, sans qu'elle ait été visible deux fois.
      tl.kill()
      gsap.set([curtain, mark, name, head.current, ...layers, ...texts], { clearProps: 'transform,opacity,clipPath' })
    }
  }, [host, active])

  if (!host || !active) return null
  const markEl = host.querySelector('.intro__mark')
  if (!markEl) return null

  return createPortal(
    <>
      <svg ref={head} className="intro__head" viewBox="0 0 20 17" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
        <SpritePaths grid={FOX_HEAD} replace={{ E: 'O' }} />
        <CellsPath cells={FOX_EYES} fill="var(--fox-n)" />
        <g ref={lid} opacity="0">
          <CellsPath cells={FOX_EYES.filter(([, r]) => r === 8)} fill="var(--fox-o)" />
          <CellsPath cells={FOX_EYES_CLOSED} fill="var(--fox-n)" />
        </g>
      </svg>
      <PixelText text="Ethan Houziaux" className="intro__name" shadow />
    </>,
    markEl,
  )
}
