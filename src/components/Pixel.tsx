import type { CSSProperties } from 'react'
import { GLYPH_H, textCells, textWidth } from '../lib/pixelFont.ts'
import { cellsToPath, spriteCells } from '../lib/pixels.ts'
import { FOX_SLEEPING, PAW } from '../lib/sprites.ts'

type PixelTextProps = {
  text: string
  className?: string
  /** Couleur de l'ombre portée pixel (décalée d'une cellule vers le bas). */
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
      style={{ '--cells': w } as CSSProperties}
    >
      {shadow && <path d={d} transform="translate(0 1)" className="px-shadow" />}
      <path d={d} fill="currentColor" />
    </svg>
  )
}

const FOX_ROLES: Record<string, string> = {
  O: 'var(--fox-o)',
  D: 'var(--fox-d)',
  L: 'var(--fox-l)',
  W: 'var(--fox-w)',
  K: 'var(--fox-k)',
  E: 'var(--fox-k)',
  N: 'var(--fox-n)',
  P: 'var(--fox-n)',
}

function Sprite({ grid, className, roles }: { grid: readonly string[]; className?: string; roles: Record<string, string> }) {
  const w = Math.max(...grid.map((r) => r.length))
  const groups = spriteCells(grid)
  return (
    <svg className={className} viewBox={`0 0 ${w} ${grid.length}`} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {Object.entries(groups).map(([role, cells]) => (
        <path key={role} d={cellsToPath(cells)} fill={roles[role]} />
      ))}
    </svg>
  )
}

export const SleepingFox = ({ className }: { className?: string }) => (
  <Sprite grid={FOX_SLEEPING} className={className} roles={FOX_ROLES} />
)

export const Paw = ({ className }: { className?: string }) => (
  <Sprite grid={PAW} className={className} roles={{ O: 'currentColor' }} />
)
