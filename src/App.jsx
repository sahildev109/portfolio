import { Suspense, lazy, useState } from 'react'
import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ScrollProgress'
import { GlobalParticles } from './components/GlobalParticles'
import { HeroSection } from './components/HeroSection'
import { BackToTop } from './components/BackToTop'
import { Footer } from './components/Footer'
import { PagePreloader } from './components/PagePreloader'
import './globals.css'
import './App.css'
import './styles/sections.css'
import './styles/site-ui.css'
import './styles/statsbar.css'

const CursorFX = lazy(() => import('./components/CursorFX').then((module) => ({ default: module.CursorFX })))
const StatsBar = lazy(() => import('./components/StatsBar').then((module) => ({ default: module.StatsBar })))
const Arsenal = lazy(() => import('./components/SkillsSection').then((module) => ({ default: module.SkillsSection })))
const ExperienceSection = lazy(() => import('./components/ExperienceSection').then((module) => ({ default: module.ExperienceSection })))
const ProjectsSection = lazy(() => import('./components/ProjectsSection').then((module) => ({ default: module.ProjectsSection })))
const ContactSection = lazy(() => import('./components/ContactSection').then((module) => ({ default: module.ContactSection })))

function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <main className="main-layout" id="top">
      {!loaded && <PagePreloader onComplete={() => setLoaded(true)} />}

      <div
        style={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <GlobalParticles />
        <ScrollProgress />
        <Navbar />

        <HeroSection />

        <Suspense fallback={null}>
          {loaded ? <CursorFX /> : null}
          <StatsBar />
          <Arsenal />
          <ExperienceSection />
          <ProjectsSection />
          <ContactSection />
          <Footer />
          <BackToTop />
        </Suspense>
      </div>
    </main>
  )
}

export default App
