import { About } from './components/About.tsx'
import { Contact, Divider, Footer } from './components/Contact.tsx'
import { Experience } from './components/Experience.tsx'
import { Header } from './components/Header.tsx'
import { Hero } from './components/Hero.tsx'
import { Projects } from './components/Projects.tsx'
import { Stack } from './components/Stack.tsx'
import { useTheme } from './lib/useTheme.ts'

export default function App() {
  const { theme, toggle } = useTheme()
  return (
    <>
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
          <Divider />
          <Stack />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  )
}
