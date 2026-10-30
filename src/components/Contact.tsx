import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site.ts'
import { useInView, useReducedMotion } from '../lib/motion.ts'
import { ContactForm } from './ContactForm.tsx'
import { PixelText, SleepingFox } from './Pixel.tsx'
import { SectionTitle } from './SectionTitle.tsx'

export function Contact() {
  return (
    <section className="section" aria-labelledby="contact">
      <SectionTitle id="contact" label="Contact" pixel="Me contacter" seed={105} />
      <div className="contact">
        <div className="contact__aside" data-reveal="wipe">
          <p className="lead">
            Vous recrutez un alternant en Bac+5 full stack, ou vous voulez parler d'un projet ? Laissez-moi un message ici, ou
            écrivez-moi directement.
          </p>
          <a className="contact__mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
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
        <ContactForm />
      </div>
    </section>
  )
}

/** Pied de page : le renard dort… et se réveille quand on arrive jusqu'à lui. */
export function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { threshold: 0.8 })
  const reduced = useReducedMotion()
  const [awake, setAwake] = useState(false)

  useEffect(() => {
    if (reduced) return
    const t = window.setTimeout(() => setAwake(inView), inView ? 700 : 1500)
    return () => window.clearTimeout(t)
  }, [inView, reduced])

  return (
    <footer className="site-footer">
      <div className="site-footer__scene" ref={ref} data-awake={awake ? '' : undefined}>
        <div className="sleeper" aria-hidden="true">
          <span className="zz">
            <PixelText text="z" />
            <PixelText text="z" />
            <PixelText text="z" />
          </span>
          <span className="sleeper__alert">
            <PixelText text="!" />
          </span>
          <SleepingFox className="sleeper__fox" awake={awake} />
          <span className="sleeper__mound" />
        </div>
        <p className="site-footer__thanks">
          <span className="sr-only">Merci de votre visite !</span>
          <PixelText text="Merci de votre visite !" className="site-footer__thanks-px" />
        </p>
      </div>
      <p className="site-footer__meta">
        © {new Date().getFullYear()} Ethan Houziaux. Fait avec React, TypeScript et beaucoup de pixels.{' '}
        <a href="#top">Retour en haut</a>
      </p>
    </footer>
  )
}
