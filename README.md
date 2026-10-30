# portefolio

Portfolio d'Ethan Houziaux, développeur full stack ([@lerouxblond](https://github.com/lerouxblond)).
Vite + React + TypeScript, CSS « maison » (custom properties), même univers renard / pixel art que le profil GitHub.

## Développement

```bash
npm install
npm run dev        # http://localhost:5173/portefolio/
```

## Build et prévisualisation

```bash
npm run build      # tsc -b puis vite build → dist/
npm run preview    # http://localhost:4173/portefolio/
```

## Déploiement (GitHub Pages)

Le site est servi sous `https://lerouxblond.github.io/portefolio/` (d'où `base: '/portefolio/'` dans `vite.config.ts`).

1. Créer le dépôt `lerouxblond/portefolio` sur GitHub et pousser la branche `main`.
2. Dans **Settings › Pages**, choisir **Source : GitHub Actions**.
3. Chaque push sur `main` lance `.github/workflows/deploy.yml` (build, `upload-pages-artifact`, `deploy-pages`).
   Le workflow peut aussi être relancé à la main depuis l'onglet **Actions**.

Si le dépôt change de nom, mettre à jour `base` dans `vite.config.ts`.

## Contenu

| Quoi | Où |
|---|---|
| Liens (email, GitHub, LinkedIn, CV) | `src/data/site.ts` |
| Expérience Eureka Fripe | `src/data/experience.ts` |
| Projets | `src/data/projects.ts` |
| Stack (icônes [skillicons.dev](https://skillicons.dev)) | `src/data/stack.ts` |
| CV PDF | `public/cv/EthanHouziaux_CV_2026.pdf` (à déposer) |

## Visuels

- `src/assets/github/` : SVG copiés depuis le dépôt de profil `lerouxblond/lerouxblond` (séparateur, calendrier 3D…).
- `src/lib/pixelFont.ts` et `src/lib/sprites.ts` : police bitmap 5×7 et sprites du renard, repris du profil
  (la police gagne les capitales accentuées). Les titres de section et le pied de page sont rendus en SVG
  inline à partir de ces données, en `currentColor`, donc ils suivent le thème clair / sombre.
- `src/assets/scene-*.svg` et `public/favicon.svg` sont générés par `npm run generate:svg`
  (`tools/generate.mjs`, Node ≥ 22.18 pour l'import direct des fichiers `.ts`).

## Thème et accessibilité

- Thème clair / sombre selon `prefers-color-scheme`, bouton de bascule mémorisé dans `localStorage`
  (script inline dans `index.html` pour éviter le flash au chargement).
- `prefers-reduced-motion` coupe toutes les animations (y compris dans les SVG).
- Lien d'évitement, titres hiérarchisés, texte alternatif, focus visible, pas de défilement horizontal dès 360 px.

Captures : `docs/screenshots/`.
