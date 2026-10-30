// Convertit des cellules [col, row] en un chemin SVG, en fusionnant les séries horizontales.
export function cellsToPath(cells: readonly (readonly [number, number])[], s = 1, x = 0, y = 0): string {
  const rows = new Map<number, number[]>()
  for (const [c, r] of cells) {
    const row = rows.get(r)
    if (row) row.push(c)
    else rows.set(r, [c])
  }
  let d = ''
  for (const [r, cols] of [...rows].sort((a, b) => a[0] - b[0])) {
    cols.sort((a, b) => a - b)
    let start = cols[0]
    let prev = cols[0]
    const flush = () => {
      d += `M${x + start * s} ${y + r * s}h${(prev - start + 1) * s}v${s}h${-(prev - start + 1) * s}z`
    }
    for (const c of cols.slice(1)) {
      if (c === prev) continue
      if (c === prev + 1) {
        prev = c
        continue
      }
      flush()
      start = prev = c
    }
    flush()
  }
  return d
}

/** Regroupe les cellules d'un sprite (grille de caractères) par rôle de couleur. */
export function spriteCells(grid: readonly string[]): Record<string, [number, number][]> {
  const byRole: Record<string, [number, number][]> = {}
  grid.forEach((row, r) =>
    [...row].forEach((ch, c) => {
      if (ch === '.') return
      ;(byRole[ch] ??= []).push([c, r])
    }),
  )
  return byRole
}

/** Générateur pseudo-aléatoire déterministe (mulberry32) : mêmes dessins à chaque rendu. */
export function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
