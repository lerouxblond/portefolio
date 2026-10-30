import dividerLight from '../assets/github/divider-light.svg'
import dividerDark from '../assets/github/divider-dark.svg'
import { site } from '../data/site.ts'
import { PixelText, SleepingFox } from './Pixel.tsx'
import { SectionTitle } from './SectionTitle.tsx'

export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <img className="only-light" src={dividerLight} alt="" width="1200" height="48" />
      <img className="only-dark" src={dividerDark} alt="" width="1200" height="48" />
    </div>
  )
}

export function Contact() {
  return (
    <section className="section" aria-labelledby="contact">
      <SectionTitle id="contact" label="Contact" pixel="Me contacter" seed={105} />
      <div className="contact">
        <div>
          <p className="lead">
            Vous recrutez un alternant en Bac+5 full stack, ou vous voulez parler d'un projet ? Le plus simple est de m'écrire.
          </p>
          <a className="contact__mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <ul className="contact__links">
          <li>
            <a className="btn btn--primary" href={site.cv} download>
              Télécharger le CV
            </a>
          </li>
          <li>
            <a className="btn" href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a className="btn" href={site.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__scene">
        <div className="sleeper" aria-hidden="true">
          <span className="zz">
            <PixelText text="z" />
            <PixelText text="z" />
            <PixelText text="z" />
          </span>
          <SleepingFox className="sleeper__fox" />
          <span className="sleeper__mound" />
        </div>
        <p className="site-footer__thanks">
          <span className="sr-only">Merci de votre visite !</span>
          <PixelText text="Merci de votre visite !" />
        </p>
      </div>
      <p className="site-footer__meta">
        © {new Date().getFullYear()} Ethan Houziaux. Fait avec React, TypeScript et beaucoup de pixels.{' '}
        <a href="#top">Retour en haut</a>
      </p>
    </footer>
  )
}
