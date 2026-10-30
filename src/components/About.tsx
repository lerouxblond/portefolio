import { Edge } from './Edge.tsx'
import { SectionTitle } from './SectionTitle.tsx'

const steps = [
  {
    when: 'Les débuts',
    title: 'Unity et C#',
    text: 'Inventaires, cycles jour/nuit, plateformers, game jams : je découvre le code en construisant des systèmes de gameplay.',
  },
  {
    when: '2023 – 2026',
    title: 'Zone01 Rouen',
    text: "Titre Concepteur Développeur d'Applications (RNCP 37873, niveau 6). Pédagogie par les pairs, sans cours magistraux : Rust, Go, JavaScript, avec des projets comme Social Network, Lem-in, Smart Road et un hackathon IA.",
  },
  {
    when: '2025 – 2026',
    title: 'Alternance chez Eureka Fripe',
    text: "Plus d'un an à livrer des outils web utilisés au quotidien par les équipes : interface, base de données, tests et mise en production.",
  },
  {
    when: 'La suite',
    title: 'Alternance Bac+5',
    text: 'Je cherche une poursuite d’études en alternance, en développement full stack.',
    next: true,
  },
]

export function About() {
  return (
    <section className="section" aria-labelledby="a-propos">
      <Edge seed={13} />
      <SectionTitle id="a-propos" label="À propos" pixel="Qui suis-je" seed={100} />
      <div className="about">
        <div className="about__text">
          <p className="lead" data-lines>
            Je m'appelle Ethan, je vis à Rouen et je suis développeur full stack. J'aime les outils petits et précis, le code qui
            se relit facilement, et tout ce qui a un peu de pixel art dedans.
          </p>
          <p data-lines>
            Le jeu vidéo m'a appris à penser en systèmes : un inventaire, une jauge de vie ou un calendrier en jeu, c'est un modèle
            de données, des règles et une interface qui doit réagir tout de suite. Je retrouve les mêmes questions dans les
            applications métier, avec de vrais utilisateurs en face.
          </p>
          <dl className="sheet" aria-label="Fiche résumé" data-rise>
            <div>
              <dt>Classe</dt>
              <dd>Développeur Full Stack</dd>
            </div>
            <div>
              <dt>Base</dt>
              <dd>Rouen</dd>
            </div>
            <div>
              <dt>Formation</dt>
              <dd>Zone01 Rouen, titre RNCP niveau 6</dd>
            </div>
            <div>
              <dt>Quête en cours</dt>
              <dd>Alternance Bac+5 en développement full stack</dd>
            </div>
          </dl>
        </div>

        <div className="about__path">
          <h3 className="h3">Parcours</h3>
          <ol className="timeline">
            {steps.map((s) => (
              <li
                key={s.title}
                className={s.next ? 'timeline__step timeline__step--next' : 'timeline__step'}
                data-rise
              >
                <p className="timeline__when">{s.when}</p>
                <h4 className="timeline__title">{s.title}</h4>
                <p className="timeline__text">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
