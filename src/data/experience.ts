export type Highlight = {
  title: string
  /** Chiffre clé mis en avant, avec sa légende. */
  figure: { value: string; label: string }
  points: string[]
}

export const experience = {
  role: 'Développeur Full Stack (alternance)',
  company: "Eureka Fripe — Les Chiffonniers d'Eureka Fripe",
  place: 'Rouen',
  start: 'sept. 2025',
  end: 'nov. 2026',
  intro:
    "« La Console » est l'application web interne qui remplace tableurs et e-mails pour toute l'entreprise (commerciaux, entrepôt, direction) : 38 modules dont le CRM, le stock et les arrivages, une messagerie chiffrée de bout en bout, un wiki, des tickets et des analytics. Autour gravitent une CI/CD auto-hébergée écrite en Go, des services de newsletter et d'e-mails, et une PWA installable sur mobile. Une équipe de trois alternants, une méthode agile maison (sprints, kanban) et de la revue de code.",
  rex:
    "Faire évoluer une application utilisée chaque jour par toute l'entreprise, sans service informatique en appui, m'a appris à partir des besoins des utilisateurs, à livrer par petites étapes sans casser l'existant et à documenter mon travail (notes à la direction, guides utilisateurs, conventions d'équipe) pour que toute l'équipe puisse s'en servir.",
  highlights: [
    {
      title: "Design system et socle d'interface",
      figure: { value: '459 → 0', label: 'couleurs codées en dur' },
      points: [
        'Atomic Design, tokens CSS et trois thèmes, avec un script anti-flash au chargement.',
        'Migration de 44 fichiers : 911 imports réécrits dans 353 fichiers, sans aucune régression.',
        'Règles ESLint verrouillées par une quality gate « à cliquet » : le compteur ne peut que baisser.',
      ],
    },
    {
      title: 'Module Stock',
      figure: { value: 'mai 2026', label: 'mise en production' },
      points: [
        'Suivi des arrivages de conteneurs maritimes, avec la logistique, la comptabilité et la direction.',
        'Recueil du besoin : 13 exigences fonctionnelles traduites en user stories.',
        'Architecture en vertical slices, tableau groupé sur 12 colonnes, alertes de facture manquante.',
        'Export tableur, impression A4 et gardes de permissions.',
      ],
    },
    {
      title: 'Base de données',
      figure: { value: '14', label: 'migrations versionnées' },
      points: [
        'Schéma PostgreSQL sur Supabase, modélisé en Merise et UML.',
        "Triggers : statut automatique, journal d'activité en JSONB, notifications.",
        'Row Level Security par opération, combinée à la double authentification (MFA).',
      ],
    },
    {
      title: 'Qualité et déploiement',
      figure: { value: '92', label: 'tests automatisés' },
      points: [
        'Tests avec rstest et Testing Library.',
        'Ajout de l’étape qualité à la CI auto-hébergée (service Go, conteneurs Docker node:22).',
        'Diagnostic d’un incident de production : webhook newsletter perdu, recréé en migration versionnée.',
      ],
    },
  ] satisfies Highlight[],
  stack: ['React 19', 'TypeScript', 'Rsbuild', 'Tailwind CSS 4', 'shadcn/Radix', 'TanStack Query', 'Supabase', 'PostgreSQL', 'Go', 'Docker'],
}
