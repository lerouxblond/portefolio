import type { CSSProperties } from 'react'
import { treelineMask } from '../lib/treeline.ts'

/**
 * Lisière pixel : une ligne de sapins à la couleur du fond de la section, posée sur son bord haut.
 * Elle monte en parallaxe au défilement (src/lib/scenes.ts) ; immobile avec « réduire les animations ».
 */
export function Edge({ seed }: { seed: number }) {
  return <span className="edge" data-edge aria-hidden="true" style={{ '--edge-mask': treelineMask(seed) } as CSSProperties} />
}
