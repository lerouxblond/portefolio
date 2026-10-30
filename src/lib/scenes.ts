import { useLayoutEffect } from 'react'
import { PAW } from './sprites.ts'
import { cellsToPath, spriteCells } from './pixels.ts'
import { gsap, getLenis, headerHeight, ScrollTrigger, scrollToY, startSmoothScroll, stopSmoothScroll } from './scroll.ts'

/*
 * Mise en scène au défilement (phase 3), construite en un seul endroit et dans l'ordre de la page :
 * une épingle décale tout ce qui la suit, donc les ScrollTriggers sont créés de haut en bas
 * (puis triés par ScrollTrigger.sort()).
 *
 *   B. Plongée dans l'en-tête : hero épinglé (pinSpacing: false), calques de forêt à vitesses différentes,
 *      le titre grossit et s'efface, la section suivante glisse par-dessus.
 *   C. Lisière pixel : la ligne de sapins en haut de chaque section monte en parallaxe.
 *   D. Galerie horizontale des projets (≥ 768 px) + renard au trot synchronisé.
 *   « Deux vitesses » : textes révélés ligne par ligne derrière un masque, blocs en fondu + montée,
 *      courbes fluides (expo / power) ; les paliers restent réservés aux éléments pixel.
 *
 * Avec « réduire les animations » : rien de tout cela (ni Lenis, ni épingle, ni parallaxe), tout est visible.
 */

/** Réglages. */
export const TUNING = {
  /** Lissage du scrub (s) : true = collé au défilement, nombre = rattrapage. */
  heroScrub: true as boolean | number,
  galleryScrub: 0.6,
  edgeScrub: true as boolean | number,
  /** Profondeur de la plongée : [échelle, décalage vertical en %] par calque. */
  depth: { sky: [1.02, -4], far: [1.08, 2], mid: [1.2, 6], near: [1.45, 10] } as Record<string, [number, number]>,
  /** Lisière : départ (yPercent) et fenêtre de défilement. */
  edgeFrom: 70,
  edgeStart: 'top bottom',
  edgeEnd: 'clamp(top 45%)',
  /** Textes ligne par ligne. */
  linesDuration: 1.1,
  linesStagger: 0.09,
  /** Blocs en fondu + montée. */
  riseY: 32,
  riseDuration: 0.9,
  /** Renard de la galerie : arrêt après la fin du défilement (ms), espacement des empreintes (px). */
  foxIdleMs: 180,
  printGap: 48,
}

const RM = '(prefers-reduced-motion: reduce)'
const DESKTOP = '(min-width: 768px)'
const CELL = 4 // grille du renard de la galerie (px)
const FOX_W = 96

const pawPath = (() => {
  const cells = spriteCells(PAW).O
  return cellsToPath(cells)
})()

/* ─── Textes ligne par ligne ─────────────────────────────────────────── */

type Split = { el: HTMLElement; html: string }

/**
 * Découpe un texte simple en lignes masquées. Le texte complet reste lu par les lecteurs d'écran
 * (copie .sr-only) ; les lignes animées sont aria-hidden.
 */
function splitLines(el: HTMLElement): Split | null {
  if (el.children.length) return null // texte simple uniquement
  const html = el.innerHTML
  const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ')
  if (!text) return null
  const words = text.split(' ')
  el.innerHTML = words.map((w) => `<span class="w">${escapeHtml(w)}</span>`).join(' ')
  const lines: string[][] = []
  let top: number | null = null
  el.querySelectorAll<HTMLElement>('.w').forEach((w) => {
    if (w.offsetTop !== top) {
      lines.push([])
      top = w.offsetTop
    }
    lines[lines.length - 1].push(w.textContent ?? '')
  })
  el.innerHTML =
    `<span class="sr-only">${escapeHtml(text)}</span>` +
    lines.map((l) => `<span class="line" aria-hidden="true"><span>${escapeHtml(l.join(' '))}</span></span>`).join('')
  return { el, html }
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/* ─── Construction ───────────────────────────────────────────────────── */

function build(cleanups: (() => void)[]) {
  const motion = !window.matchMedia(RM).matches
  const desktop = window.matchMedia(DESKTOP).matches
  const root = document.documentElement
  root.classList.toggle('motion-on', motion)

  if (!motion) {
    stopSmoothScroll()
    return null
  }
  startSmoothScroll()

  // Découpe avant toute mesure : les lignes dépendent de la largeur et des polices.
  const splits = gsap.utils
    .toArray<HTMLElement>('[data-lines]')
    .map(splitLines)
    .filter((s): s is Split => !!s)
  cleanups.push(() => splits.forEach(({ el, html }) => (el.innerHTML = html)))

  const ctx = gsap.context(() => {
    const hero = document.querySelector<HTMLElement>('.hero')
    if (hero) heroDive(hero, desktop, cleanups)

    // Puis chaque section, de haut en bas : lisière, textes et blocs, galerie.
    gsap.utils.toArray<HTMLElement>('main .section, .site-footer').forEach((section) => {
      const edge = section.querySelector<HTMLElement>(':scope > [data-edge]')
      if (edge) {
        gsap.fromTo(
          edge,
          { yPercent: TUNING.edgeFrom },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: section, start: TUNING.edgeStart, end: TUNING.edgeEnd, scrub: TUNING.edgeScrub },
          },
        )
      }

      const gallery = section.hasAttribute('data-gallery-section') && desktop ? setupGallery(section, cleanups) : false

      section.querySelectorAll<HTMLElement>('[data-lines], [data-rise], .contact-form-wrap, .project-slot').forEach((el) => {
        if (el.hasAttribute('data-lines')) {
          const spans = el.querySelectorAll('.line > span')
          if (!spans.length) return
          gsap.from(spans, {
            yPercent: 110,
            duration: TUNING.linesDuration,
            ease: 'expo.out',
            stagger: TUNING.linesStagger,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
          })
          return
        }
        // Cartes de la galerie : animées par la galerie, pas par le défilement vertical.
        if (gallery && el.classList.contains('project-slot')) return
        gsap.from(el, {
          y: TUNING.riseY,
          opacity: 0,
          duration: TUNING.riseDuration,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
        })
      })
    })
  })

  ScrollTrigger.sort()
  return ctx
}

/* ─── B. Plongée dans l'en-tête ──────────────────────────────────────── */

function heroDive(hero: HTMLElement, desktop: boolean, cleanups: (() => void)[]) {
  const layers = gsap.utils.toArray<HTMLElement>('.hero__layer', hero)
  const content = hero.querySelector('.hero__content')
  const avail = () => window.innerHeight - headerHeight()
  // Hero plus haut que l'écran : on attend que son bas (la forêt, le renard) soit visible avant d'épingler.
  const start = () => (hero.offsetHeight > avail() ? 'bottom bottom' : `top ${headerHeight()}px`)
  const end = () => `bottom ${headerHeight()}px`
  const willChange = (on: boolean) => layers.forEach((l) => (l.style.willChange = on ? 'transform' : ''))

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start,
      end,
      scrub: TUNING.heroScrub,
      pin: desktop,
      pinSpacing: false,
      invalidateOnRefresh: true,
      onToggle: (self) => willChange(self.isActive),
    },
  })
  layers.forEach((l) => {
    const [scale, y] = TUNING.depth[l.dataset.depth ?? ''] ?? [1, 0]
    tl.to(l, { scale, yPercent: y }, 0)
  })
  if (content) tl.to(content, { scale: 1.14, yPercent: -18, opacity: 0, ease: 'power2.in' }, 0)
  cleanups.push(() => willChange(false))
}

/* ─── D. Galerie horizontale + renard au trot ────────────────────────── */

function setupGallery(section: HTMLElement, cleanups: (() => void)[]): boolean {
  const gallery = section.querySelector<HTMLElement>('[data-gallery]')
  const track = section.querySelector<HTMLElement>('[data-track]')
  const lane = section.querySelector<HTMLElement>('[data-lane]')
  const runner = section.querySelector<HTMLElement>('[data-runner]')
  const fox = runner?.querySelector<SVGSVGElement>('svg')
  if (!gallery || !track || !lane || !runner || !fox) return false

  // La galerie n'a de sens que si les cartes tiennent en hauteur sous l'en-tête ; sinon, grille verticale.
  section.classList.add('is-gallery')
  if (gallery.offsetHeight > window.innerHeight - headerHeight() - 16) {
    section.classList.remove('is-gallery')
    return false
  }
  cleanups.push(() => section.classList.remove('is-gallery'))

  const cards = gsap.utils.toArray<HTMLElement>('.project-slot', track)
  const articles = cards.map((c) => c.querySelector<HTMLElement>('article')).filter((a): a is HTMLElement => !!a)
  // Clavier : chaque carte devient atteignable (et ramenée à l'écran au focus).
  articles.forEach((a) => a.setAttribute('tabindex', '0'))
  cleanups.push(() => articles.forEach((a) => a.removeAttribute('tabindex')))

  const dist = () => Math.max(0, track.scrollWidth - gallery.clientWidth)
  const laneW = () => lane.clientWidth - FOX_W

  // Empreintes tous les 48 px, en quinconce, révélées derrière le renard.
  const prints: [number, SVGSVGElement][] = []
  for (let x = 24, i = 0; x < lane.clientWidth - 40; x += TUNING.printGap, i++) {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    p.setAttribute('class', 'print')
    p.setAttribute('viewBox', '0 0 9 8')
    p.setAttribute('shape-rendering', 'crispEdges')
    p.setAttribute('aria-hidden', 'true')
    p.innerHTML = `<path d="${pawPath}" fill="currentColor"/>`
    p.style.left = `${x}px`
    p.style.bottom = `${i % 2 ? 15 : 24}px`
    lane.appendChild(p)
    prints.push([x, p])
  }

  const frames = Array.from(fox.querySelectorAll('g'))
  let frame = frames.findIndex((g) => g.classList.contains('on'))
  let facing = 1
  let lastDust = -99
  let idle = 0
  const setFrame = (i: number) => {
    if (i === frame) return
    frames[frame]?.classList.remove('on')
    frames[i]?.classList.add('on')
    frame = i
  }
  // Rebond d'une cellule sur les images de passage, demi-tour quand on remonte la page.
  const pose = (f: number, moving: boolean) => {
    setFrame(f)
    fox.style.transform = `scaleX(${facing}) translateY(${moving && f % 2 ? -CELL : 0}px)`
  }
  const dust = (x: number) => {
    const d = document.createElement('span')
    d.className = 'dust'
    d.style.left = `${x}px`
    d.style.setProperty('--dx', `${-10 * facing}px`)
    d.addEventListener('animationend', () => d.remove())
    lane.appendChild(d)
  }

  const tween = gsap.to(track, {
    x: () => -dist(),
    ease: 'none',
    scrollTrigger: {
      trigger: gallery,
      start: () => {
        const h = headerHeight()
        const free = window.innerHeight - h - gallery.offsetHeight
        return `top ${Math.round(h + Math.max(0, free / 2))}px`
      },
      end: () => `+=${dist()}`,
      pin: true,
      scrub: TUNING.galleryScrub,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        track.style.willChange = self.isActive ? 'transform' : ''
        runner.style.willChange = self.isActive ? 'transform' : ''
      },
      onUpdate: (self) => {
        const x = Math.round((self.progress * laneW()) / CELL) * CELL
        if (self.direction) facing = self.direction < 0 ? -1 : 1
        runner.style.transform = `translateX(${x}px)`
        const f = Math.floor(x / 16) % 4
        // Poussière sur les images de contact (pattes écartées).
        if (f !== frame && f % 2 === 0 && Math.abs(x - lastDust) >= 32) {
          lastDust = x
          dust(facing > 0 ? x + 6 : x + 84)
        }
        pose(f, true)
        for (const [px, p] of prints) p.classList.toggle('on', px + 40 < x)
        // Il s'arrête net, debout, quand le défilement s'arrête.
        window.clearTimeout(idle)
        idle = window.setTimeout(() => pose(1, false), TUNING.foxIdleMs)
      },
    },
  })

  // Têtes qui dépassent : déclenchées par la position horizontale des cartes.
  cards.forEach((card) =>
    ScrollTrigger.create({ trigger: card, containerAnimation: tween, start: 'left 72%', end: 'right 28%', toggleClass: 'is-peeking' }),
  )

  // Focus clavier dans une carte : on fait défiler la page jusqu'à ce qu'elle soit centrée.
  const onFocus = (e: FocusEvent) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.project-slot')
    const st = tween.scrollTrigger
    if (!card || !st) return
    const d = dist()
    const target = card.offsetLeft + card.offsetWidth / 2 - gallery.clientWidth / 2
    const k = d ? Math.min(1, Math.max(0, target / d)) : 0
    scrollToY(st.start + (st.end - st.start) * k, 0.8)
  }
  track.addEventListener('focusin', onFocus)

  cleanups.push(() => {
    track.removeEventListener('focusin', onFocus)
    window.clearTimeout(idle)
    lane.querySelectorAll('.print, .dust').forEach((n) => n.remove())
    runner.style.transform = ''
    fox.style.transform = ''
    track.style.willChange = runner.style.willChange = ''
    cards.forEach((c) => c.classList.remove('is-peeking'))
    setFrame(1)
  })
  return true
}

/* ─── Hook ───────────────────────────────────────────────────────────── */

/** Ancres internes (#…) : défilement via Lenis, calé sous l'en-tête, puis focus sur la cible. */
function onAnchorClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null
  const lenis = getLenis()
  if (!a || !lenis) return
  const id = decodeURIComponent(a.getAttribute('href')!.slice(1))
  if (id === 'main') return // lien d'évitement : comportement natif (focus)
  if (id === '' || id === 'top') {
    e.preventDefault()
    lenis.scrollTo(0, { duration: 1.2 })
    return
  }
  const target = document.getElementById(id)
  if (!target) return
  e.preventDefault()
  history.replaceState(null, '', `#${id}`)
  // Cible calculée sur la position réelle de la page (et non celle, lissée, de Lenis).
  const y = target.getBoundingClientRect().top + window.scrollY - headerHeight() - 16
  lenis.scrollTo(Math.max(0, y), {
    duration: 1.2,
    onComplete: () => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    },
  })
}

/**
 * Construit (et reconstruit) toutes les scènes : au montage, quand les polices sont chargées, quand la
 * largeur change, quand la préférence de mouvement change. Nettoyage complet au démontage.
 */
export function useScenes() {
  useLayoutEffect(() => {
    let ctx: gsap.Context | null = null
    let cleanups: (() => void)[] = []
    let lastW = window.innerWidth

    const teardown = () => {
      ctx?.revert()
      ctx = null
      cleanups.reverse().forEach((f) => f())
      cleanups = []
    }
    const rebuild = () => {
      const y = window.scrollY
      teardown()
      ctx = build(cleanups)
      ScrollTrigger.refresh()
      if (y) {
        const lenis = getLenis()
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
        else window.scrollTo(0, y)
      }
    }
    rebuild()

    // Polices : les lignes et les hauteurs changent quand Atkinson arrive.
    let alive = true
    if (document.fonts && document.fonts.status !== 'loaded') {
      document.fonts.ready.then(() => alive && rebuild())
    }

    let rt = 0
    const onResize = () => {
      window.clearTimeout(rt)
      rt = window.setTimeout(() => {
        if (window.innerWidth === lastW) return
        lastW = window.innerWidth
        rebuild()
      }, 200)
    }
    window.addEventListener('resize', onResize)

    const mqs = [window.matchMedia(RM), window.matchMedia(DESKTOP)]
    mqs.forEach((m) => m.addEventListener('change', rebuild))

    // Le contenu change de hauteur (formulaire, images) : on recale les déclencheurs.
    let rh = 0
    let lastH = document.body.offsetHeight
    const ro = new ResizeObserver(() => {
      window.clearTimeout(rh)
      rh = window.setTimeout(() => {
        const h = document.body.offsetHeight
        if (Math.abs(h - lastH) < 2) return
        lastH = h
        ScrollTrigger.refresh()
      }, 250)
    })
    ro.observe(document.body)

    document.addEventListener('click', onAnchorClick)

    return () => {
      alive = false
      window.clearTimeout(rt)
      window.clearTimeout(rh)
      window.removeEventListener('resize', onResize)
      mqs.forEach((m) => m.removeEventListener('change', rebuild))
      ro.disconnect()
      document.removeEventListener('click', onAnchorClick)
      teardown()
      stopSmoothScroll()
      document.documentElement.classList.remove('motion-on')
    }
  }, [])
}
