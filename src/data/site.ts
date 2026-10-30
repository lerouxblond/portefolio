export const site = {
  name: 'Ethan Houziaux',
  role: 'Développeur Full Stack',
  email: 'ethanh.pro@hotmail.com',
  github: 'https://github.com/lerouxblond',
  linkedin: 'https://www.linkedin.com/in/ethan-houziaux/',
  /** Le PDF est à déposer dans public/cv/ (voir public/cv/LISEZMOI.txt). */
  cv: `${import.meta.env.BASE_URL}cv/EthanHouziaux_CV_2026.pdf`,
}

export const nav = [
  { id: 'a-propos', label: 'À propos' },
  { id: 'experience', label: 'Expérience' },
  { id: 'projets', label: 'Projets' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
] as const
