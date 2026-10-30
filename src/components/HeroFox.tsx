import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useInView, useReducedMotion } from '../lib/motion.ts'
import { FOX_EYES, FOX_EYES_CLOSED, FOX_EYES_HAPPY, FOX_SITTING, TAIL_ANCHOR, TAIL_FRAMES } from '../lib/sprites.ts'
import { CellsPath, SpritePaths } from './Pixel.tsx'

// Mêmes coordonnées que dans la scène générée (tools/generate.mjs) : viewBox 1200 × 420, pixel = 6.
const FX = 1010
const FY = 396 - FOX_SITTING.length * 6
const HEART = ['.KK.KK.', 'KOOKOOK', 'KOOOOOK', '.KOOOK.', '..KOK..', '...K...']

type Look = [number, number]

/**
 * Le renard du hero, rendu en direct par-dessus la scène : il remue la queue, cligne des yeux,
 * suit le pointeur du regard et saute (avec un cœur) quand on clique dessus.
 * La couche SVG reproduit exactement le cadrage de l'image de fond (object-fit: cover, calé en bas à droite).
 */
export function HeroFox() {
  const layer = useRef<SVGSVGElement>(null)
  const eyes = useRef<SVGGElement>(null)
  const visible = useInView(layer, { threshold: 0 })
  const reduced = useReducedMotion()
  const [look, setLook] = useState<Look>([0, 0])
  const [jumps, setJumps] = useState(0)
  const [jumping, setJumping] = useState(false)

  // Regard qui suit le pointeur (souris uniquement, hero visible, animations autorisées).
  useEffect(() => {
    if (reduced || !visible || !window.matchMedia('(pointer: fine)').matches) return
    let frame = 0
    let last = ''
    const onMove = (e: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const r = eyes.current?.getBoundingClientRect()
        if (!r) return
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const next: Look = [Math.abs(dx) < 40 ? 0 : Math.sign(dx), dy < -90 ? -1 : dy > 90 ? 1 : 0]
        const key = next.join()
        if (key !== last) {
          last = key
          setLook(next)
        }
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [reduced, visible])

  const jump = useCallback(() => {
    if (reduced || jumping) return
    setJumping(true)
    setJumps((n) => n + 1)
    window.setTimeout(() => setJumping(false), 900)
  }, [reduced, jumping])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      jump()
    }
  }

  const [ax, ay] = TAIL_ANCHOR
  const state = [visible ? '' : 'is-paused', jumping ? 'is-jumping' : ''].join(' ')

  return (
    <svg
      ref={layer}
      className={`hero-fox ${state}`}
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMaxYMax slice"
      shapeRendering="crispEdges"
    >
      <g
        className="hero-fox__hit"
        transform={`translate(${FX} ${FY}) scale(6)`}
        role="button"
        tabIndex={0}
        aria-label="Faire sauter le renard"
        onClick={jump}
        onKeyDown={onKey}
      >
        <g className="hero-fox__body">
          {/* Zone de clic un peu plus large que le renard */}
          <rect x="-2" y="-2" width="34" height="31" fill="transparent" />
          {TAIL_FRAMES.map((frame, i) => (
            <g key={i} className={`hero-fox__tail hero-fox__tail--${i}`}>
              <SpritePaths grid={frame} x={ax} y={ay} />
            </g>
          ))}
          <SpritePaths grid={FOX_SITTING} replace={{ E: 'O' }} />
          {jumping ? (
            <CellsPath cells={FOX_EYES_HAPPY} fill="var(--fox-n)" />
          ) : (
            <g ref={eyes} className="hero-fox__eyes">
              <CellsPath cells={FOX_EYES} fill="var(--fox-n)" dx={look[0]} dy={look[1]} className="hero-fox__open" />
              <CellsPath cells={FOX_EYES_CLOSED} fill="var(--fox-n)" className="hero-fox__shut" />
            </g>
          )}
        </g>
        {jumping && (
          <g key={jumps} className="hero-fox__heart">
            <SpritePaths grid={HEART} x={6} y={-9} />
          </g>
        )}
      </g>
    </svg>
  )
}
