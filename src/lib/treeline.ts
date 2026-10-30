import { cellsToPath, rng } from './pixels.ts'

/** Taille d'une cellule de lisière, en px (même grain que la forêt du hero dans la maquette validée). */
export const EDGE_CELL = 4
const COLS = 160 // tuile de 640 px, répétée horizontalement
const ROWS = 12 // 48 px de haut

const cache = new Map<number, string>()

/**
 * Lisière de sapins pixel (même dessin que `drawEdge` de la maquette) sous forme de masque CSS :
 * la couleur vient du fond de la section (`background`), donc elle suit le thème sans rien redessiner.
 * La tuile boucle sur elle-même (les sapins coupés au bord reprennent de l'autre côté).
 */
export function treelineMask(seed: number): string {
  const hit = cache.get(seed)
  if (hit) return hit
  const r = rng(seed)
  const cells: [number, number][] = []
  for (let x = 0; x < COLS; x += 5 + Math.floor(r() * 6)) {
    const th = 6 + Math.floor(r() * (ROWS - 6))
    for (let row = 0; row < th; row++) {
      // Sapins en gradins : chaque étage s'élargit, avec un cran tous les 4 rangs.
      const half = 1 + Math.floor(row * 0.55) - (row % 4 === 0 && row > 2 ? 1 : 0)
      for (let c = -half; c <= half; c++) cells.push([(((x + c) % COLS) + COLS) % COLS, ROWS - th + row])
    }
  }
  for (let c = 0; c < COLS; c++) cells.push([c, ROWS - 2], [c, ROWS - 1])
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${COLS} ${ROWS}' width='${COLS * EDGE_CELL}' height='${ROWS * EDGE_CELL}' shape-rendering='crispEdges'>` +
    `<path d='${cellsToPath(cells)}'/></svg>`
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  cache.set(seed, url)
  return url
}
