import { projects, type Project } from '../data/projects.ts'
import { SectionTitle } from './SectionTitle.tsx'

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

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className={`project project--${p.size} project--${p.id}`} aria-labelledby={`p-${p.id}`}>
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
  )
}

export function Projects() {
  return (
    <section className="section" aria-labelledby="projets">
      <SectionTitle id="projets" label="Projets" seed={102} />
      <p className="section__intro">
        Des outils pro, des projets perso autour de Dofus et de Windows, et les jeux Unity par lesquels j'ai commencé.
      </p>
      <div className="projects">
        {projects.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  )
}
