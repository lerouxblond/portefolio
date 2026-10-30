// Copié depuis lerouxblond/tools/sprites.mjs (profil GitHub) : même renard, même palette.
// Pixel sprites as character grids. Each letter maps to a palette role
// (see THEMES in generate.mjs); "." is transparent.
//   O roux  D roux foncé  L orange clair  W blanc crème  K contour
//   E yeux  N truffe  P chaussettes noires

// Renard assis, de face — 20 × 27.
export const FOX_SITTING = [
  '.KK..............KK.',
  '.KOK............KOK.',
  '.KOOK..........KOOK.',
  '.KOWOK........KOWOK.',
  '.KOWWOKKKKKKKKOWWOK.',
  '.KOOWOOLLLLLLOOWOOK.',
  'KOOOOOOLLLLLLOOOOOOK',
  'KOOOOOOOOOOOOOOOOOOK',
  'KOOOEEOOOOOOOOEEOOOK',
  'KOOOEEOOOOOOOOEEOOOK',
  'KWOOOOOOOOOOOOOOOOWK',
  'KWWOOOOOOOOOOOOOOWWK',
  '.KWWWWOOOOOOOOWWWWK.',
  '..KWWWWWOOOOWWWWWK..',
  '...KWWWWWNNWWWWWK...',
  '....KWWWWWWWWWWK....',
  '.....KKWWWWWWKK.....',
  '....KOOWWWWWWOOK....',
  '...KOOOWWWWWWOOOK...',
  '...KDOOWWWWWWOODK...',
  '..KDOOOWWWWWWOOODK..',
  '..KDOOOOWWWWOOOODK..',
  '..KDOOOOWWWWOOOODK..',
  '..KDOOOOOWWOOOOODK..',
  '..KDOOOPPOOPPOOODK..',
  '..KDOOOPPOOPPOOODK..',
  '..KKKKPPPKKPPPKKKK..',
]

// Paupières fermées : remplace les yeux pendant le clignement.
export const FOX_EYES_CLOSED: [number, number][] = [
  // [col, row] des pixels de paupière
  [4, 9], [5, 9], [14, 9], [15, 9],
]

// Queue — 3 frames de 12 × 12, ancrées en (col 15, row 15) du renard.
export const TAIL_FRAMES = [
  [
    '......KK....',
    '.....KWWK...',
    '....KWWWWK..',
    '....KWWWWK..',
    '...KOOOOOK..',
    '...KOOOOOK..',
    '..KOOOOODK..',
    '..KOOOOODK..',
    '.KOOOOODK...',
    'KOOOOODK....',
    'KOOOODK.....',
    'KKKKKK......',
  ],
  [
    '.........KK.',
    '........KWWK',
    '.......KWWWK',
    '......KWWWK.',
    '.....KOOOOK.',
    '....KOOOOK..',
    '...KOOOODK..',
    '..KOOOODK...',
    '.KOOOOODK...',
    'KOOOOODK....',
    'KOOOODK.....',
    'KKKKKK......',
  ],
  [
    '....KK......',
    '...KWWK.....',
    '..KWWWWK....',
    '..KWWWWK....',
    '..KOOOOOK...',
    '..KOOOOOK...',
    '..KOOOOODK..',
    '...KOOOOODK.',
    '..KOOOOOODK.',
    'KOOOOOODK...',
    'KOOOODDK....',
    'KKKKKKK.....',
  ],
]
export const TAIL_ANCHOR: [number, number] = [15, 15]

// Renard endormi, enroulé, queue devant le museau.
export const FOX_SLEEPING = [
  '..K',
  '.KOK',
  '.KOOK.KKKKKKKKKK',
  'KOOOOKOOOOOOOOOOKK',
  'KOOOOOOOOOOOOOOOOOK',
  'KOEEOOOOOODOOOOOOOOK',
  'KWOOOOOOOODOOOOOOOOK',
  'KWWWOOOOOOODOOOOOOOOK',
  '.KKWWKKKKKKKKKKKOOOOK',
  '..KWWWWWOOOOOOOOKOOOK',
  '..KWWWWOOOOOOOOOOKOK',
  '...KKKKKKKKKKKKKKKK',
]

// Empreinte de patte — 9 × 8.
export const PAW = [
  '..OO.OO..',
  '..OO.OO..',
  'OO.....OO',
  'OO.OOO.OO',
  '..OOOOO..',
  '.OOOOOOO.',
  '.OOOOOOO.',
  '..OO.OO..',
]

// ─── Ajouts portfolio (même palette, même échelle de pixels) ───────────────

// Renard de profil qui trotte, tourné vers la droite — 24 × 14.
// Le corps est commun ; seules les 3 dernières lignes (pattes) changent.
export const FOX_TROT_BODY = [
  '................K..K....',
  '...............KOKKOK...',
  '..............KOOOOOOOK.',
  '..............KOOOOOEOOK',
  '..KK.........KOOOOOOWWWN',
  '.KOOK...KKKKKOOOOOWWWWK.',
  'KOOOOOKOOOOOOOOOOOWWWK..',
  'KWOOOOOOOOOOOOOOOOWWK...',
  'KWWOOODOOOOOOOOOOOWK....',
  '.KWWKKDOOOOOOOOOOOK.....',
  '......KDOOOOOOOOODK.....',
]

// Cycle de trot : A (pattes proches écartées), B (passage), C (pattes lointaines écartées), B.
// P = pattes du côté visible (chaussettes noires), K = pattes du côté opposé.
export const FOX_TROT_LEGS = [
  ['.......PP......KPP......', '......PPKK....KK.PP.....', '.....PP..KK..KK...PP....'],
  ['.......PP......PP.......', '.......PPK.....PPK......', '.......PPK.....PPK......'],
  ['.......PP......PPK......', '......KKPP....PP.KK.....', '.....KK..PP..PP...KK....'],
  ['.......PP......PP.......', '.......PPK.....PPK......', '.......PPK.....PPK......'],
]

/** Tête du renard assis (oreilles → joues), pour les apparitions derrière les cartes. */
export const FOX_HEAD = FOX_SITTING.slice(0, 17)

/** Pixels des deux yeux du renard assis (2 × 2 chacun). */
export const FOX_EYES: [number, number][] = [
  [4, 8], [5, 8], [4, 9], [5, 9],
  [14, 8], [15, 8], [14, 9], [15, 9],
]

/** Yeux « contents » en accent circonflexe (^ ^). */
export const FOX_EYES_HAPPY: [number, number][] = [
  [3, 9], [4, 8], [5, 8], [6, 9],
  [13, 9], [14, 8], [15, 8], [16, 9],
]

/** Yeux tristes (petits, baissés) + une larme. */
export const FOX_EYES_SAD: [number, number][] = [
  [3, 8], [4, 9], [5, 9],
  [16, 8], [15, 9], [14, 9],
]
export const FOX_TEAR: [number, number][] = [[5, 10], [5, 11]]

/** Pattes posées sur un bord (4 × 3). */
export const PAW_GRIP = ['.KK.', 'KOOK', 'KOOK']

/** Yeux ouverts du renard endormi (au réveil) : la ligne fermée devient un bloc 2 × 2. */
export const FOX_SLEEPING_AWAKE_EYES: [number, number][] = [
  [2, 4], [3, 4], [2, 5], [3, 5],
]
