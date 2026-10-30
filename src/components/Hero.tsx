import { useEffect, useRef, type CSSProperties } from 'react'
import darkFar from '../assets/scene-dark-far.svg'
import darkMid from '../assets/scene-dark-mid.svg'
import darkNear from '../assets/scene-dark-near.svg'
import darkSky from '../assets/scene-dark-sky.svg'
import lightFar from '../assets/scene-light-far.svg'
import lightMid from '../assets/scene-light-mid.svg'
import lightNear from '../assets/scene-light-near.svg'
import lightSky from '../assets/scene-light-sky.svg'
import { site } from '../data/site.ts'
import { HeroFox } from './HeroFox.tsx'
import { PixelText } from './Pixel.tsx'

const GREETING = "> salut, moi c'est ethan"

/** Calques de profondeur de la scène (tools/generate.mjs) : ciel, forêt lointaine, forêt proche, sol + renard. */
const LAYERS = [
  { depth: 'sky', light: lightSky, dark: darkSky },
  { depth: 'far', light: lightFar, dark: darkFar },
  { depth: 'mid', light: lightMid, dark: darkMid },
  { depth: 'near', light: lightNear, dark: darkNear },
] as const

function SceneImg({ light, dark }: { light: string; dark: string }) {
  return (
    <>
      <img className="only-light" src={light} alt="" width="1200" height="420" />
      <img className="only-dark" src={dark} alt="" width="1200" height="420" />
    </>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  // Hors écran (y compris recouvert par la section suivante à la fin de la plongée) :
  // les calques animés ne sont plus peints et les animations CSS se mettent en pause.
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-offscreen', !e.isIntersecting), {
      rootMargin: '-64px 0px 0px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-title">
      {/* Le renard (bouton) vit sur le calque proche : pas d'aria-hidden sur la scène, les images ont alt="". */}
      <div className="hero__scene">
        {LAYERS.map((l) => (
          <div key={l.depth} className={`hero__layer hero__layer--${l.depth}`} data-depth={l.depth}>
            <SceneImg light={l.light} dark={l.dark} />
            {l.depth === 'near' && <HeroFox />}
          </div>
        ))}
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
