import type { CSSProperties } from 'react'
import sceneLight from '../assets/scene-light.svg'
import sceneDark from '../assets/scene-dark.svg'
import { site } from '../data/site.ts'
import { PixelText } from './Pixel.tsx'

const GREETING = "> salut, moi c'est ethan"

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__scene" aria-hidden="true">
        <img className="only-light" src={sceneLight} alt="" width="1200" height="420" />
        <img className="only-dark" src={sceneDark} alt="" width="1200" height="420" />
      </div>

      <div className="hero__content">
        <p className="hero__term">
          <span className="sr-only">Salut, moi c'est Ethan.</span>
          <span className="hero__typed" style={{ '--chars': GREETING.length } as CSSProperties}>
            <PixelText text={GREETING} className="hero__typed-text" />
          </span>
          <span className="hero__cursor" aria-hidden="true" />
        </p>

        <h1 id="hero-title" className="hero__title">
          <span className="sr-only">{site.name}, </span>
          <PixelText text="Ethan" className="hero__name" shadow />
          <PixelText text="Houziaux" className="hero__name" shadow />
          <span className="hero__role">{site.role}</span>
        </h1>

        <p className="hero__tagline">
          Entre jeux vidéo et web. J'ai appris à coder en construisant des systèmes de gameplay sous Unity ; aujourd'hui je
          livre des outils web que des équipes utilisent tous les jours.
        </p>
        <p className="hero__status">
          <span className="hero__status-dot" aria-hidden="true" />
          Je cherche une alternance en Bac+5 développement full stack.
        </p>

        <div className="hero__actions">
          <a className="btn btn--primary" href="#projets">
            Voir les projets
          </a>
          <a className="btn" href={site.cv} download>
            Télécharger le CV
          </a>
          <a className="btn btn--ghost" href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
