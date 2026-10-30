import type { CSSProperties } from 'react'
import contribLight from '../assets/github/profile-fox-light.svg'
import contribDark from '../assets/github/profile-fox-dark.svg'
import { site } from '../data/site.ts'
import { skillIcons, stack } from '../data/stack.ts'
import { Edge } from './Edge.tsx'
import { SectionTitle } from './SectionTitle.tsx'

export function Stack() {
  return (
    <section className="section section--band" aria-labelledby="stack">
      <Edge seed={47} />
      <SectionTitle id="stack" label="Stack" pixel="Stack technique" seed={103} />
      <div className="stack">
        {stack.map((g) => (
          <div key={g.title} className="stack__group" data-rise>
            <h3 className="stack__title">{g.title}</h3>
            <ul className="stack__icons">
              {g.icons.map((icon, i) => (
                <li key={icon} className="stack__icon" title={g.names[i]} style={{ '--i': i } as CSSProperties}>
                  <img className="only-light" src={skillIcons([icon], 'light')} alt="" loading="lazy" width="48" height="48" />
                  <img className="only-dark" src={skillIcons([icon], 'dark')} alt="" loading="lazy" width="48" height="48" />
                </li>
              ))}
            </ul>
            <p className="stack__names">{g.names.join(', ')}</p>
          </div>
        ))}
      </div>

      <figure className="contrib" data-rise>
        <img className="only-light" src={contribLight} alt="Calendrier des contributions GitHub en 3D, aux couleurs du renard" loading="lazy" width="1280" height="850" />
        <img className="only-dark" src={contribDark} alt="Calendrier des contributions GitHub en 3D, aux couleurs du renard" loading="lazy" width="1280" height="850" />
        <figcaption>
          Mes contributions GitHub, publiques et privées, sur{' '}
          <a href={site.github} target="_blank" rel="noreferrer">
            mon profil
          </a>
          .
        </figcaption>
      </figure>
    </section>
  )
}
