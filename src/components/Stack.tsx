import contribLight from '../assets/github/profile-fox-light.svg'
import contribDark from '../assets/github/profile-fox-dark.svg'
import { site } from '../data/site.ts'
import { skillIcons, stack } from '../data/stack.ts'
import { SectionTitle } from './SectionTitle.tsx'

export function Stack() {
  return (
    <section className="section" aria-labelledby="stack">
      <SectionTitle id="stack" label="Stack" pixel="Stack technique" seed={103} />
      <div className="stack">
        {stack.map((g) => (
          <div key={g.title} className="stack__group">
            <h3 className="stack__title">{g.title}</h3>
            <img
              className="stack__icons only-light"
              src={skillIcons(g.icons, 'light')}
              alt=""
              loading="lazy"
              width={g.icons.length * 50}
              height="48"
            />
            <img
              className="stack__icons only-dark"
              src={skillIcons(g.icons, 'dark')}
              alt=""
              loading="lazy"
              width={g.icons.length * 50}
              height="48"
            />
            <p className="stack__names">{g.names.join(', ')}</p>
          </div>
        ))}
      </div>

      <figure className="contrib">
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
