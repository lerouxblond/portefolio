export type ProjectLink = { label: string; href: string }

export type SubProject = {
  name: string
  summary: string
  /** URL du dépôt public. Absent = code privé. */
  repo?: string
}

export type Project = {
  id: string
  title: string
  /** Contexte affiché sur la carte. */
  context: 'Alternance' | 'Projet perso' | 'Jeux vidéo'
  /** État d'avancement, s'il ne s'agit pas d'un projet abouti. */
  status?: 'En production' | 'En cours' | 'Démarrage'
  summary: string
  points: string[]
  tags: string[]
  /** URL du dépôt public. Absent = code privé. */
  repo?: string
  /** Liens secondaires (dépôt associé, démo…). */
  links?: ProjectLink[]
  /** Projets regroupés dans la même carte. */
  children?: SubProject[]
  size: 'wide' | 'regular'
}

const GH = 'https://github.com/lerouxblond'

export const projects: Project[] = [
  {
    id: 'la-console',
    title: 'La Console',
    context: 'Alternance',
    status: 'En production',
    summary:
      "L'application web de gestion interne d'Eureka Fripe : 38 modules (CRM, stock, messagerie, analytics…) développés à trois alternants, en sprints de deux semaines avec revue de code.",
    points: [
      "Socle d'interface en Atomic Design : tokens CSS, 3 thèmes, migration de 911 imports sans régression.",
      'Module Stock de bout en bout, du recueil du besoin à la mise en production.',
      'Schéma PostgreSQL sur Supabase : 14 migrations versionnées, triggers, Row Level Security.',
      '92 tests et une étape qualité ajoutée à la CI auto-hébergée.',
    ],
    tags: ['React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'Go', 'Docker'],
    size: 'wide',
  },
  {
    id: 'do-verlay',
    title: 'do-verlay',
    context: 'Projet perso',
    summary:
      "Overlay de stream Dofus modulaire et son panel de contrôle. Le streamer règle ses modules dans le panel, l'overlay (source navigateur OBS) les affiche en direct par-dessus le jeu.",
    points: [
      'Serveur Go : sert le front et synchronise panel et overlay par WebSocket.',
      'Lecture anonyme du chat Twitch (IRC) : les commandes !guilde, !almanax… déclenchent les modules.',
      '5 modules, placement libre au glisser-déposer, profils et dispositions exportables en JSON.',
      'Almanax du jour lu sur l’API publique DofusDude.',
    ],
    tags: ['React', 'TypeScript', 'Go', 'WebSocket', 'Twitch IRC', 'Vitest'],
    repo: `${GH}/do-verlay`,
    children: [
      {
        name: 'do-stuff',
        summary:
          "Éditeur de builds Dofus : équipements, caractéristiques et stats finales calculées, exportés en JSON que do-verlay sait afficher. Données de jeu via l'API DofusDude.",
      },
    ],
    size: 'wide',
  },
  {
    id: 'kitsuyakko',
    title: 'Kitsuyakko',
    context: 'Projet perso',
    status: 'En cours',
    summary:
      "Une « île » Windows habitée par un renard : une petite fenêtre ancrée en haut de l'écran qui s'ouvre sur des outils rapides (stats système, historique du presse-papiers, alimentation).",
    points: [
      'Application de bureau Go + Wails v3 avec une interface React.',
      'Service de statistiques CPU testé, premier module en place.',
      "Vision, architecture, design system et choix techniques documentés (ADR) avant d'écrire le code.",
    ],
    tags: ['Go', 'Wails', 'React', 'TypeScript', 'Windows'],
    size: 'regular',
  },
  {
    id: 'muldo-tracker',
    title: 'muldo-tracker',
    context: 'Projet perso',
    status: 'Démarrage',
    summary:
      "Un outil de suivi pour l'élevage de montures dans Dofus (muldos) : objets d'élevage, carburants et filets au même endroit.",
    points: ['Front React 19 + Rsbuild + Tailwind CSS 4, API en Go.', 'Projet tout juste initialisé : la structure est posée, les écrans arrivent.'],
    tags: ['React 19', 'Rsbuild', 'Tailwind CSS 4', 'Go'],
    size: 'regular',
  },
  {
    id: 'unity',
    title: 'Jeux et outils Unity / C#',
    context: 'Jeux vidéo',
    summary:
      "Là où tout a commencé : des systèmes de gameplay réutilisables, des petits jeux et un launcher de bureau. Architecture MVC et ScriptableObjects d'un projet à l'autre.",
    points: [],
    tags: ['Unity', 'C#', '.NET', 'EF Core', 'SQLite'],
    children: [
      {
        name: 'Universal Game System',
        summary: "Inventaire, santé et objets réutilisables pour Unity (joueur, coffres, marchands), en ScriptableObjects et MVC, avec glisser-échanger dans l'UI.",
        repo: `${GH}/universal_inventory_project`,
      },
      {
        name: 'GameLauncher',
        summary: 'Launcher de jeux en C# .NET WinForms : comptes, bibliothèque personnelle, notes et avis, base SQLite via EF Core.',
        repo: `${GH}/GameLauncher`,
      },
      {
        name: 'Platformer 2D',
        summary: 'Plateformer 2D : déplacements et saut, plateformes traversables, caméra bornée, zones mortelles.',
        repo: `${GH}/platformer_2d`,
      },
      {
        name: 'Rolex Clicker',
        summary: 'Jeu de game jam fait contre la montre : un clicker avec bâtiments, améliorations et atelier.',
        repo: `${GH}/RolexClickerGJ`,
      },
      {
        name: 'Cycle jour / nuit',
        summary: 'Gestion du temps en jeu : cycle jour/nuit, calendrier avec saisons, mois et semaines, fond en parallaxe.',
        repo: `${GH}/Day_Night_cycle_project`,
      },
    ],
    size: 'wide',
  },
]
