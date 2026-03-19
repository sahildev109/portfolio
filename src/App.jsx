import { useState } from 'react'
import { CursorFX } from './components/CursorFX'
import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ScrollProgress'
import { HeroSection } from './components/HeroSection'
import { SkillsSection } from './components/SkillsSection'
import { ExperienceSection } from './components/ExperienceSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ContactSection } from './components/ContactSection'
import { BackToTop } from './components/BackToTop'
import { Footer } from './components/Footer'
import { PagePreloader } from './components/PagePreloader'
import './globals.css'
import './App.css'
import './styles/sections.css'
import './styles/site-ui.css'

function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <main className="main-layout" id="top">
      {!loaded && <PagePreloader onComplete={() => setLoaded(true)} />}

      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 600ms ease',
        }}
      >
        {loaded ? <CursorFX /> : null}
        <ScrollProgress />
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
        <Footer />
        <BackToTop />
      </div>
    </main>
  )
}

export default App
