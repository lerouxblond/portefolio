import { projects, type Project } from '../data/projects.ts'
import { FOX_TROT_BODY, FOX_TROT_LEGS } from '../lib/sprites.ts'
import { Edge } from './Edge.tsx'
import { Peek } from './Peek.tsx'
import { SpritePaths } from './Pixel.tsx'
import { SectionTitle } from './SectionTitle.tsx'
import { TrotLane } from './TrotLane.tsx'

function Lock() {
  return (
    <svg viewBox="0 0 7 8" shapeRendering="crispEdges" aria-hidden="true" focusable="false" className="ico">
      <path d="M2 0h3v1H2zM1 1h1v2H1zM5 1h1v2H5zM0 3h7v5H0z" fill="currentColor" />
      <path d="M3 5h1v1H3z" fill="var(--surface)" />
    </svg>
  )
}

function RepoLink({ href, name }: { href?: string; name: string }) {
  if (!href)
    return (
      <span className="repo repo--private">
        <Lock /> Code privé
      </span>
    )
  return (
    <a className="repo" href={href} target="_blank" rel="noreferrer" aria-label={`Voir le code de ${name} sur GitHub`}>
      Voir le code sur GitHub
    </a>
  )
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <Peek className={`project-slot project-slot--${p.size}`} side={index % 2 ? 'left' : 'right'} autoPeek={2600} autoDelay={900}>
    <article className={`project project--${p.id}`} aria-labelledby={`p-${p.id}`}>
      <header className="project__head">
        <p className="project__context">
          {p.context}
          {p.status && <span className="badge">{p.status}</span>}
        </p>
        <h3 id={`p-${p.id}`} className="project__title">
          {p.title}
        </h3>
      </header>
      <p className="project__summary">{p.summary}</p>
      {p.points.length > 0 && (
        <ul className="project__points">
          {p.points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>
      )}
      {p.children && (
        <ul className={p.id === 'unity' ? 'subprojects subprojects--grid' : 'subprojects'}>
          {p.children.map((c) => (
            <li key={c.name} className="subproject">
              <h4 className="subproject__name">{c.name}</h4>
              <p>{c.summary}</p>
              <RepoLink href={c.repo} name={c.name} />
            </li>
          ))}
        </ul>
      )}
      <footer className="project__foot">
        <ul className="tags" aria-label="Technologies">
          {p.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {p.id !== 'unity' && <RepoLink href={p.repo} name={p.title} />}
      </footer>
    </article>
    </Peek>
  )
}

/** Renard de la galerie : 4 images superposées, une seule affichée (classe .on, pilotée au défilement). */
function GalleryFox() {
  return (
    <svg className="runner__fox" viewBox={`0 0 24 ${FOX_TROT_BODY.length + 3}`} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {FOX_TROT_LEGS.map((legs, i) => (
        <g key={i} className={i === 1 ? 'on' : undefined}>
          <SpritePaths grid={FOX_TROT_BODY} />
          <SpritePaths grid={legs} y={FOX_TROT_BODY.length} />
        </g>
      ))}
    </svg>
  )
}

/**
 * Projets. Sur ordinateur (≥ 768 px, animations autorisées, hauteur suffisante), la section est épinglée
 * et les cartes défilent à l'horizontale, suivies par le renard au trot sur sa piste (src/lib/scenes.ts).
 * Sinon : grille verticale classique, et le renard traverse la bande du bas une fois.
 */
export function Projects() {
  return (
    <section className="section section--projects" aria-labelledby="projets" data-gallery-section>
      <Edge seed={37} />
      <SectionTitle id="projets" label="Projets" seed={102} />
      <p className="section__intro" data-lines>
        Des outils pro, des projets perso autour de Dofus et de Windows, et les jeux Unity par lesquels j'ai commencé.
      </p>
      <div className="gallery">
        <div className="gallery__pin" data-gallery>
          <div className="projects" data-track>
            {projects.map((p, i) => (
              <ProjectCard key={p.id} p={p} index={i} />
            ))}
          </div>
          <div className="lane" data-lane aria-hidden="true">
            <span className="lane__ground" />
            <div className="runner" data-runner>
              <GalleryFox />
              <span className="runner__shadow" />
            </div>
          </div>
        </div>
      </div>
      <TrotLane direction="right" />
    </section>
  )
}
