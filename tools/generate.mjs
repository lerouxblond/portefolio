// Génère la scène pixel du hero (clair + sombre) dans src/assets/.
// Adapté de lerouxblond/tools/generate.mjs (bannière du profil GitHub) : même forêt,
// même ciel, même renard — mais sans texte, pour laisser le titre en HTML accessible.
//
// Usage : npm run generate:svg   (Node >= 22.18, qui sait importer du .ts)
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FOX_SITTING, FOX_EYES_CLOSED, TAIL_FRAMES, TAIL_ANCHOR } from '../src/lib/sprites.ts'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets')
mkdirSync(OUT, { recursive: true })

const FOX = { O: '#E8671C', D: '#B4440F', L: '#F59A4A', W: '#FFF4E6', P: '#2A1810', N: '#2A1810', E: '#2A1810' }

const THEMES = {
  dark: {
    fox: { ...FOX, K: '#3A2418' },
    sky: ['#0E0B09', '#120E0B', '#17110D', '#1E150F', '#2A1B12'],
    treesBack: '#1E1510', treesFront: '#130E0B', ground: '#0C0907',
  },
  light: {
    fox: { ...FOX, W: '#FFFFFF', K: '#3A2418' },
    sky: ['#FFF8F0', '#FFF0E0', '#FFE4C8', '#FCD3AA', '#F7BE8A'],
    treesBack: '#EDA56C', treesFront: '#D27237', ground: '#9C3A0D',
  },
}

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const r1 = (n) => Math.round(n * 100) / 100

function cellsPath(cells, x, y, s, fill, attrs = '') {
  if (!cells.length) return ''
  const rows = new Map()
  for (const [c, r] of cells) (rows.get(r) ?? rows.set(r, []).get(r)).push(c)
  let d = ''
  for (const [r, cols] of [...rows].sort((a, b) => a[0] - b[0])) {
    cols.sort((a, b) => a - b)
    let start = cols[0], prev = cols[0]
    const flush = () => { d += `M${x + start * s} ${y + r * s}h${(prev - start + 1) * s}v${s}h${-(prev - start + 1) * s}z` }
    for (const c of cols.slice(1)) {
      if (c === prev + 1) { prev = c; continue }
      if (c === prev) continue
      flush(); start = prev = c
    }
    flush()
  }
  return `<path${attrs} fill="${fill}" d="${d}"/>`
}

function sprite(grid, colors, x, y, s, { only, skip = '' } = {}) {
  const byRole = {}
  grid.forEach((row, r) => [...row].forEach((ch, c) => {
    if (ch === '.' || skip.includes(ch) || (only && !only.includes(ch))) return
    ;(byRole[ch] ??= []).push([c, r])
  }))
  return Object.entries(byRole).map(([role, cells]) => cellsPath(cells, x, y, s, colors[role])).join('')
}

function discCells(rad) {
  const cells = []
  for (let r = -rad; r <= rad; r++)
    for (let c = -rad; c <= rad; c++)
      if (c * c + r * r <= rad * rad + rad * 0.6) cells.push([c + rad, r + rad])
  return cells
}

function onOff(name, ranges) {
  const e = 0.01
  const stops = ['0%{opacity:0}']
  for (const [a, b] of ranges) {
    stops.push(`${r1(Math.max(a - e, 0))}%{opacity:0}`, `${a}%{opacity:1}`, `${b}%{opacity:1}`, `${r1(Math.min(b + e, 100))}%{opacity:0}`)
  }
  stops.push('100%{opacity:0}')
  return `@keyframes ${name}{${stops.join('')}}`
}

function pine(col, baseRow, h) {
  const cells = []
  const tiers = Math.max(2, Math.round(h / 5))
  const tierH = Math.ceil(h / tiers)
  for (let r = 0; r < h - 1; r++) {
    const tier = Math.floor(r / tierH)
    const inTier = r % tierH
    const half = Math.floor(1 + tier * 1.1 + inTier * 0.8)
    for (let c = -half; c <= half; c++) cells.push([col + c, baseRow - h + r])
  }
  cells.push([col, baseRow - 1], [col, baseRow])
  return cells
}

function forest(rand, groundRow, cols, heightAt) {
  const cells = []
  for (let col = 0; col < cols; col += 3 + Math.floor(rand() * 4)) {
    const h = Math.round(heightAt(col) * (0.7 + rand() * 0.5))
    if (h >= 4) cells.push(...pine(col, groundRow, h))
  }
  return cells
}

function scene(themeName) {
  const T = THEMES[themeName]
  const W = 1200, H = 420, s = 6
  const cols = W / s, groundRow = 66 // sol à y = 396
  const rand = rng(themeName === 'dark' ? 7 : 11)
  let body = '', css = ''

  const band = H / T.sky.length
  T.sky.forEach((color, i) => {
    body += `<rect y="${r1(i * band)}" width="${W}" height="${r1(band + 1)}" fill="${color}"/>`
    if (i > 0) {
      const dither = []
      for (let c = 0; c < cols; c += 2) dither.push([c, 0])
      body += cellsPath(dither, 0, Math.round(i * band) - s, s, color)
    }
  })

  // astre au-dessus du renard
  const moonRad = 6, mx = 880, my = 54
  body += cellsPath(discCells(moonRad + 2), mx - 2 * s, my - 2 * s, s, themeName === 'dark' ? '#241913' : '#FFE9D2')
  body += cellsPath(discCells(moonRad), mx, my, s, themeName === 'dark' ? '#FFF4E6' : '#FFFFFF')
  if (themeName === 'dark') body += cellsPath([[3, 4], [4, 4], [8, 7], [6, 9], [7, 9], [9, 3]], mx, my, s, '#EAD6BE')

  if (themeName === 'dark') {
    css += '@keyframes tw{0%,100%{opacity:1}50%{opacity:.15}}'
    for (let i = 0; i < 90; i++) {
      const x = Math.floor(rand() * cols) * s, y = Math.floor(rand() * 40) * s
      if (x < 760 && y > 30) continue // le titre HTML vit à gauche
      const size = rand() < 0.25 ? s : s / 2
      const fill = ['#FFF4E6', '#9FB4C7', '#F59A4A'][Math.floor(rand() * 3)]
      body += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}" style="animation:tw ${r1(2 + rand() * 4)}s ${r1(-rand() * 5)}s infinite"/>`
    }
  } else {
    css += '@keyframes fall{0%{transform:translate(0,-20px)}25%{transform:translate(24px,90px)}50%{transform:translate(-6px,200px)}75%{transform:translate(20px,310px)}100%{transform:translate(0,440px)}}'
    for (let i = 0; i < 16; i++) {
      const x = 720 + Math.floor(rand() * (W - 760))
      const fill = ['#E8671C', '#B4440F', '#F59A4A'][Math.floor(rand() * 3)]
      const leaf = [[0, 0], [1, 0], [1, 1], [2, 1]]
      body += `<g style="animation:fall ${r1(9 + rand() * 6)}s linear ${r1(-rand() * 15)}s infinite">${cellsPath(leaf, x, 0, 4, fill)}</g>`
    }
  }

  // forêt : basse sous le texte (gauche), haute derrière le renard (droite)
  const edge = (col) => {
    const x = col * s
    if (x < 680) return 7
    if (x < 860) return 13
    return 26
  }
  body += cellsPath(forest(rand, groundRow, cols, (c) => edge(c) + 4), 0, 0, s, T.treesBack)
  body += cellsPath(forest(rand, groundRow, cols, (c) => edge(c) * 0.75), 0, 0, s, T.treesFront)
  body += `<rect y="${groundRow * s}" width="${W}" height="${H - groundRow * s}" fill="${T.ground}"/>`

  if (themeName === 'dark') {
    css += '@keyframes fly{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}50%{transform:translate(14px,-26px)}80%{opacity:1}100%{opacity:0;transform:translate(-8px,-50px)}}'
    for (let i = 0; i < 12; i++) {
      const x = 700 + Math.floor(rand() * 480), y = 300 + Math.floor(rand() * 80)
      body += `<g style="animation:fly ${r1(5 + rand() * 4)}s ease-in-out ${r1(-rand() * 8)}s infinite"><rect x="${x - 3}" y="${y - 3}" width="9" height="9" fill="#F59A4A" opacity=".25"/><rect x="${x}" y="${y}" width="3" height="3" fill="#FFD9A8"/></g>`
    }
  }

  // renard assis : queue animée, clignement des yeux
  const fx = 1010, fy = groundRow * s - FOX_SITTING.length * s
  const [ax, ay] = TAIL_ANCHOR
  css += onOff('tA', [[0, 33], [50, 83]]) + onOff('tB', [[33.01, 49.99]]) + onOff('tC', [[83.01, 100]])
  css += '.tail{animation-duration:3s;animation-iteration-count:infinite;animation-timing-function:step-end}'
  ;['tA', 'tB', 'tC'].forEach((name, i) => {
    const opacity = i === 0 ? '' : ' opacity="0"'
    body += `<g class="tail" style="animation-name:${name}"${opacity}>${sprite(TAIL_FRAMES[i], T.fox, fx + ax * s, fy + ay * s, s)}</g>`
  })
  body += sprite(FOX_SITTING, T.fox, fx, fy, s, { skip: 'E' })
  css += '@keyframes blinkOpen{0%,93%{opacity:1}94%,97%{opacity:0}98%,100%{opacity:1}}'
  css += '@keyframes blinkShut{0%,93%{opacity:0}94%,97%{opacity:1}98%,100%{opacity:0}}'
  body += `<g style="animation:blinkOpen 5s infinite">${sprite(FOX_SITTING, T.fox, fx, fy, s, { only: 'E' })}</g>`
  body += `<g opacity="0" style="animation:blinkShut 5s infinite">${cellsPath(FOX_EYES_CLOSED, fx, fy, s, T.fox.E)}</g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMaxYMax slice" shape-rendering="crispEdges">
<style>${css}
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }</style>
${body}
</svg>
`
}

for (const theme of Object.keys(THEMES)) {
  const content = scene(theme)
  writeFileSync(join(OUT, `scene-${theme}.svg`), content)
  console.log(`  scene-${theme}.svg  ${(content.length / 1024).toFixed(1)} KB`)
}

// Favicon : tête du renard (17 premières lignes du sprite assis).
{
  const head = FOX_SITTING.slice(0, 17)
  const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -2 22 21" shape-rendering="crispEdges">${sprite(head, THEMES.light.fox, 0, 0, 1)}</svg>\n`
  const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
  mkdirSync(pub, { recursive: true })
  writeFileSync(join(pub, 'favicon.svg'), fav)
  console.log('  public/favicon.svg')
}
