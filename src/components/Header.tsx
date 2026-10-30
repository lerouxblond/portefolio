import { useEffect, useState } from 'react'
import { nav } from '../data/site.ts'
import type { Theme } from '../lib/useTheme.ts'
import { cellsToPath } from '../lib/pixels.ts'
import { Paw } from './Pixel.tsx'

// Soleil et lune en pixels (grilles 9 × 9).
const SUN = ['....#....', '.#.....#.', '...###...', '..#####..', '#.#####.#', '..#####..', '...###...', '.#.....#.', '....#....']
const MOON = ['...####..', '..##.....', '.##......', '.##......', '.##......', '.##......', '..##....#', '...#####.', '.........']
const gridPath = (g: string[]) => cellsToPath(g.flatMap((row, r) => [...row].flatMap((ch, c) => (ch === '#' ? [[c, r] as [number, number]] : []))))

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const next = theme === 'dark' ? 'clair' : 'sombre'
  return (
    <button type="button" className="icon-btn" onClick={onToggle} aria-label={`Passer au thème ${next}`} title={`Thème ${next}`}>
      <svg viewBox="0 0 9 9" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
        <path d={gridPath(theme === 'dark' ? SUN : MOON)} fill="currentColor" />
      </svg>
    </button>
  )
}

export function Header({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#top">
          <Paw className="brand__paw" />
          <span>ethan houziaux</span>
        </a>
        <nav aria-label="Navigation principale" className="nav">
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-list"
            onClick={() => setOpen((o) => !o)}
          >
            Menu
          </button>
          <ul id="nav-list" className="nav__list" data-open={open}>
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </div>
    </header>
  )
}
