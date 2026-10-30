import type { CSSProperties, ReactNode } from 'react'
import { GLYPH_H, textCells, textWidth } from '../lib/pixelFont.ts'
import { cellsToPath, spriteCells } from '../lib/pixels.ts'
import {
  FOX_EYES,
  FOX_EYES_HAPPY,
  FOX_EYES_SAD,
  FOX_HEAD,
  FOX_SLEEPING,
  FOX_SLEEPING_AWAKE_EYES,
  FOX_TEAR,
  FOX_TROT_BODY,
  FOX_TROT_LEGS,
  PAW,
  PAW_GRIP,
} from '../lib/sprites.ts'

type PixelTextProps = {
  text: string
  className?: string
  /** Ombre portée pixel (décalée d'une cellule vers le bas). */
  shadow?: boolean
}

/**
 * Texte dans la police bitmap du profil GitHub, rendu en SVG (couleur = currentColor).
 * Purement visuel : le texte accessible doit être fourni à côté (aria-hidden ici).
 */
export function PixelText({ text, className, shadow = false }: PixelTextProps) {
  const w = textWidth(text, 1)
  const h = GLYPH_H + (shadow ? 1 : 0)
  const d = cellsToPath(textCells(text))
  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      style={{ '--cells': w, '--chars': [...text].length } as CSSProperties}
    >
      {shadow && <path d={d} transform="translate(0 1)" className="px-shadow" />}
      <path d={d} fill="currentColor" />
    </svg>
  )
}

/** Rôles de couleur des sprites → variables CSS (suivent le thème). */
export const FOX_ROLES: Record<string, string> = {
  O: 'var(--fox-o)',
  D: 'var(--fox-d)',
  L: 'var(--fox-l)',
  W: 'var(--fox-w)',
  K: 'var(--fox-k)',
  E: 'var(--fox-n)',
  N: 'var(--fox-n)',
  P: 'var(--fox-n)',
}

type Cells = readonly (readonly [number, number])[]

type SpritePathsProps = {
  grid: readonly string[]
  roles?: Record<string, string>
  x?: number
  y?: number
  /** Remplacement de rôles avant rendu (ex. { E: 'O' } pour effacer les yeux). */
  replace?: Record<string, string>
}

/** Un <path> par couleur pour une grille de sprite, décalée de (x, y). */
export function SpritePaths({ grid, roles = FOX_ROLES, x = 0, y = 0, replace }: SpritePathsProps) {
  const g = replace ? grid.map((row) => [...row].map((ch) => replace[ch] ?? ch).join('')) : grid
  return (
    <>
      {Object.entries(spriteCells(g)).map(([role, cells]) => (
        <path key={role} d={cellsToPath(cells, 1, x, y)} fill={roles[role]} />
      ))}
    </>
  )
}

type CellsPathProps = { cells: Cells; fill: string; className?: string; dx?: number; dy?: number }
export const CellsPath = ({ cells, fill, className, dx = 0, dy = 0 }: CellsPathProps) => (
  <path className={className} d={cellsToPath(cells, 1, dx, dy)} fill={fill} />
)

type SpriteSvgProps = { w: number; h: number; className?: string; children: ReactNode }
function SpriteSvg({ w, h, className, children }: SpriteSvgProps) {
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

export const Paw = ({ className }: { className?: string }) => (
  <SpriteSvg w={9} h={8} className={className}>
    <SpritePaths grid={PAW} roles={{ O: 'currentColor' }} />
  </SpriteSvg>
)

/** Deux petites pattes posées sur un bord (4 × 3 chacune). */
export const PawGrip = ({ className }: { className?: string }) => (
  <SpriteSvg w={4} h={3} className={className}>
    <SpritePaths grid={PAW_GRIP} />
  </SpriteSvg>
)

/** Renard endormi du pied de page ; `awake` lui ouvre les yeux. */
export const SleepingFox = ({ className, awake = false }: { className?: string; awake?: boolean }) => (
  <SpriteSvg w={21} h={FOX_SLEEPING.length} className={className}>
    <SpritePaths grid={FOX_SLEEPING} />
    {awake && <CellsPath cells={FOX_SLEEPING_AWAKE_EYES} fill="var(--fox-n)" />}
  </SpriteSvg>
)

export type FoxMood = 'idle' | 'happy' | 'sad'

type FoxHeadProps = {
  className?: string
  mood?: FoxMood
  /** Nombre de lignes affichées depuis le haut (oreilles d'abord). */
  rows?: number
}

/** Tête du renard (oreilles → joues). Humeur : yeux normaux (qui clignent), contents ou tristes. */
export function FoxHead({ className, mood = 'idle', rows = FOX_HEAD.length }: FoxHeadProps) {
  return (
    <SpriteSvg w={20} h={rows} className={className}>
      <SpritePaths grid={FOX_HEAD.slice(0, rows)} replace={{ E: 'O' }} />
      {mood === 'idle' && <CellsPath cells={FOX_EYES} fill="var(--fox-n)" className="fox-eyes" />}
      {mood === 'happy' && <CellsPath cells={FOX_EYES_HAPPY} fill="var(--fox-n)" />}
      {mood === 'sad' && (
        <>
          <CellsPath cells={FOX_EYES_SAD} fill="var(--fox-n)" />
          <CellsPath cells={FOX_TEAR} fill="var(--moon)" className="fox-tear" />
        </>
      )}
    </SpriteSvg>
  )
}

const TROT_W = 24
const TROT_H = FOX_TROT_BODY.length + 3

/** Planche de 4 images du renard qui trotte, côte à côte ; la fenêtre .trot-fox n'en montre qu'une. */
export function TrotFox({ className }: { className?: string }) {
  return (
    <span className={`trot-fox ${className ?? ''}`} aria-hidden="true">
      <SpriteSvg w={TROT_W * 4} h={TROT_H} className="trot-fox__sheet">
        {FOX_TROT_LEGS.map((legs, i) => (
          <g key={i}>
            <SpritePaths grid={FOX_TROT_BODY} x={i * TROT_W} />
            <SpritePaths grid={legs} x={i * TROT_W} y={FOX_TROT_BODY.length} />
          </g>
        ))}
      </SpriteSvg>
    </span>
  )
}
