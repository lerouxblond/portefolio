import type { CSSProperties } from 'react'
import { experience } from '../data/experience.ts'
import { CountUp } from './CountUp.tsx'
import { SectionTitle } from './SectionTitle.tsx'

const MODULES = ['Tableau de bord', 'CRM', 'Stock', 'Messagerie', 'Analytics', 'Newsletter']

/** Illustration schématique de La Console (outil interne : ni capture ni code réels). */
function ConsoleIllustration() {
  return (
    <figure className="console" data-reveal="dissolve">
      <div className="console__window" aria-hidden="true">
        <div className="console__bar">
          <span />
          <span />
          <span />
          <b>La Console</b>
        </div>
        <div className="console__body">
          <ul className="console__side">
            {MODULES.map((m) => (
              <li key={m} className={m === 'Stock' ? 'is-active' : undefined}>
                {m}
              </li>
            ))}
            <li className="console__more">+ 32 modules</li>
          </ul>
          <div className="console__main">
            <p className="console__heading">Arrivages de conteneurs</p>
            {[0, 1].map((g) => (
              <div key={g} className="console__group">
                <div className="console__group-head">
                  <i style={{ width: g ? '38%' : '52%' }} />
                  {g === 0 && <em className="console__alert">Facture manquante</em>}
                </div>
                {[0, 1, 2].map((r) => (
                  <div key={r} className="console__row">
                    {[24, 14, 18, 10, 16].map((w, c) => (
                      <i key={c} style={{ width: `${w + ((r + c + g) % 3) * 3}%` }} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ol className="layers" aria-label="Architecture simplifiée">
        <li>
          <strong>Interface</strong>
          <span>React 19, TypeScript, design system maison, TanStack Query</span>
        </li>
        <li>
          <strong>Données</strong>
          <span>Supabase, PostgreSQL, triggers, Row Level Security + MFA</span>
        </li>
        <li>
          <strong>Services et CI</strong>
          <span>Go, Docker, quality gate et tests à chaque push</span>
        </li>
      </ol>
      <figcaption>Illustration : La Console est un outil interne, ses écrans et son code sont privés.</figcaption>
    </figure>
  )
}

export function Experience() {
  const e = experience
  return (
    <section className="section" aria-labelledby="experience">
      <SectionTitle id="experience" label="Expérience" seed={101} />
      <article className="job">
        <header className="job__head">
          <h3 className="job__role">{e.role}</h3>
          <p className="job__company">{e.company}</p>
          <p className="job__meta">
            {e.place}, <time>{e.start}</time> à <time>{e.end}</time>
          </p>
        </header>

        <div className="job__grid">
          <div className="job__intro">
            <p className="lead">{e.intro}</p>
            <ul className="tags" aria-label="Stack utilisée">
              {e.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <ConsoleIllustration />
        </div>

        <div className="highlights">
          {e.highlights.map((h, i) => (
            <section
              key={h.title}
              className="highlight"
              aria-label={h.title}
              data-reveal="dissolve"
              style={{ '--i': i % 2 } as CSSProperties}
            >
              <p className="highlight__figure">
                <strong>
                  <CountUp value={h.figure.value} />
                </strong>
                <span>{h.figure.label}</span>
              </p>
              <h4 className="highlight__title">{h.title}</h4>
              <ul className="highlight__list">
                {h.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="rex" aria-label="Retour d'expérience" data-reveal="wipe">
          <h4 className="rex__title">Retour d'expérience</h4>
          <p>{e.rex}</p>
        </aside>
      </article>
    </section>
  )
}
