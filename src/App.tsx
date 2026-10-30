import { About } from './components/About.tsx'
import { Contact, Footer } from './components/Contact.tsx'
import { Experience } from './components/Experience.tsx'
import { Header } from './components/Header.tsx'
import { Hero } from './components/Hero.tsx'
import { Projects } from './components/Projects.tsx'
import { Stack } from './components/Stack.tsx'
import { Intro } from './components/Intro.tsx'
import { useScrollReveal } from './lib/motion.ts'
import { useScenes } from './lib/scenes.ts'
import { useTheme } from './lib/useTheme.ts'

export default function App() {
  const { theme, toggle } = useTheme()
  useScrollReveal()
  useScenes()
  return (
    <>
      <Intro />
      <a className="skip" href="#main">
        Aller au contenu
      </a>
      <Header theme={theme} onToggle={toggle} />
      <main id="main" tabIndex={-1}>
        <Hero />
        <div className="page">
          <About />
          <Experience />
          <Projects />
          <Stack />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  )
}
