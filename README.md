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
  (`tools/generate.mjs`, Node ≥ 22.18 pour l'import direct des fichiers `.ts`). La scène existe en entier
  (`scene-<thème>.svg`, aperçu) et en 4 calques de profondeur (`scene-<thème>-{sky,far,mid,near}.svg`) utilisés par le hero.

La scène du hero ne contient plus le renard : il est rendu en direct par `src/components/HeroFox.tsx`
(mêmes coordonnées), pour pouvoir cligner, suivre le curseur et sauter.

## Animations

Deux étages :

- **Transitions au défilement** (phase 3) : GSAP + ScrollTrigger et défilement adouci Lenis, construits en un seul
  endroit, dans l'ordre de la page, dans `src/lib/scenes.ts` (réglages regroupés dans `TUNING` en tête de fichier).
  Mise en page associée : `src/scroll.css`.
- **Le renard et les éléments pixel** : CSS (`src/motion.css`) et petits hooks React (`src/lib/motion.ts`),
  en paliers (`steps()`), déplacements en pixels entiers, `crispEdges`.

Règle « deux vitesses » : textes et blocs en courbes fluides (expo / power), paliers réservés au pixel art
(renards, titres pixel, empreintes, poussière, nom tapé de l'intro).

| Quoi | Où / quand | Code |
|---|---|---|
| Intro : tête du renard, clignement, nom tapé, rideau qui descend (bord en lisière de sapins), forêt et textes qui se posent | à chaque arrivée, ~1,8 s ; clic / Échap / Entrée / Espace pour passer | `index.html` (rideau), `Intro.tsx` |
| Plongée dans l'en-tête : hero épinglé, ciel / forêt lointaine / forêt proche / sol à des vitesses différentes, le titre grossit et s'efface | haut de page (épinglé dès 768 px) | `scenes.ts` (`heroDive`), calques `src/assets/scene-*-{sky,far,mid,near}.svg` |
| Lisière pixel : ligne de sapins à la couleur de la section, qui monte en parallaxe | haut de chaque section (fonds alternés) | `Edge.tsx`, `lib/treeline.ts` |
| Galerie horizontale des projets + renard au trot (4 images, rebond, demi-tour, poussière, empreintes, arrêt net) | ordinateur ≥ 768 px, si les cartes tiennent en hauteur ; sinon grille verticale | `Projects.tsx`, `scenes.ts` (`setupGallery`) |
| Textes ligne par ligne derrière un masque (texte complet lu par les lecteurs d'écran) ; blocs en fondu + montée | `[data-lines]`, `[data-rise]` | `scenes.ts` |
| Renard du hero : queue, clignement, regard qui suit la souris, saut + cœur au clic ou avec Entrée | hero, en continu (en pause hors écran) | `HeroFox.tsx` |
| Tête qui dépasse derrière une carte, pattes posées sur le bord | cartes projets : selon la position dans la galerie, au survol / focus | `Peek.tsx` |
| Renard qui trotte et laisse des empreintes | bas de la section Projets, mobile et grille verticale | `TrotLane.tsx` |
| Oreilles au-dessus du formulaire, puis réaction contente / triste | formulaire : focus, envoi, résultat | `ContactForm.tsx` |
| Renard endormi qui se réveille (« ! », yeux ouverts) | pied de page, quand on l'atteint | `Contact.tsx` (`Footer`) |
| Titres de section : patte tamponnée, libellé tapé, traînée posée pixel par pixel | à l'apparition | `SectionTitle.tsx` |
| Compteurs (459 → 0, 14, 92), décélération power2.out | chiffres clés de l'expérience | `CountUp.tsx` |

Les sprites ajoutés (renard de profil qui trotte en 4 images, yeux contents / tristes, pattes) sont dans
`src/lib/sprites.ts`, dans la même palette que ceux du profil.

## Formulaire de contact

`src/lib/contact.ts` expose `sendContactMessage({ name, email, subject, message })`, qui fait un `POST` JSON
vers `VITE_CONTACT_ENDPOINT` (voir `.env.example`). Ce point d'entrée doit être un relais (Cloudflare Worker
ou équivalent) qui transmet à Discord : **l'URL du webhook Discord ne doit jamais être dans le front**,
toute variable `VITE_*` est publiée en clair. Le relais doit revalider les champs et limiter le débit.

- Sans variable : envoi simulé en dev (`npm run dev`) ; en production, le formulaire propose un lien
  `mailto:` prérempli avec le message.
- En production : fournir la variable au build, par exemple dans `deploy.yml` sur l'étape `npm run build` :
  `env: { VITE_CONTACT_ENDPOINT: ${{ vars.VITE_CONTACT_ENDPOINT }} }` (variable de dépôt GitHub).
- Anti-robots : champ piège `website` invisible ; s'il est rempli, rien n'est envoyé (succès simulé).

## Thème et accessibilité

- Thème clair / sombre selon `prefers-color-scheme`, bouton de bascule mémorisé dans `localStorage`
  (script inline dans `index.html` pour éviter le flash au chargement).
- `prefers-reduced-motion` coupe toutes les animations (y compris dans les SVG) : pas d'intro, pas de Lenis,
  ni épingle ni parallaxe, galerie en grille, contenu visible d'emblée, renards immobiles, compteurs à leur
  valeur finale, empreintes affichées sans renard.
- Lien d'évitement, titres hiérarchisés, texte alternatif, focus visible, pas de défilement horizontal dès 360 px.

Captures : `docs/screenshots/`.
