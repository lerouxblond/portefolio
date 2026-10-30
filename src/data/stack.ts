export type StackGroup = {
  title: string
  /** Identifiants skillicons.dev (https://skillicons.dev). */
  icons: string[]
  /** Noms lisibles, dans le même ordre (texte alternatif + liste). */
  names: string[]
}

export const stack: StackGroup[] = [
  { title: 'Langages', icons: ['ts', 'js', 'go', 'cs', 'rust', 'py'], names: ['TypeScript', 'JavaScript', 'Go', 'C#', 'Rust', 'Python'] },
  {
    title: 'Front',
    icons: ['react', 'vite', 'tailwind', 'html', 'css'],
    names: ['React', 'Vite / Rsbuild', 'Tailwind CSS', 'HTML', 'CSS'],
  },
  {
    title: 'Back et données',
    icons: ['supabase', 'postgres', 'sqlite', 'dotnet'],
    names: ['Supabase', 'PostgreSQL', 'SQLite', '.NET / EF Core'],
  },
  { title: 'DevOps', icons: ['docker', 'git', 'github', 'githubactions'], names: ['Docker', 'Git', 'GitHub', 'GitHub Actions'] },
  { title: 'Game', icons: ['unity', 'cs'], names: ['Unity', 'C#'] },
]

export const skillIcons = (icons: string[], theme: 'light' | 'dark') =>
  `https://skillicons.dev/icons?i=${icons.join(',')}&theme=${theme}`
