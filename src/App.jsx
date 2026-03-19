import { useAnimatedCursor } from './hooks/useAnimatedCursor'
import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ScrollProgress'
import { HeroSection } from './components/HeroSection'
import { SkillsSection } from './components/SkillsSection'
import { ExperienceSection } from './components/ExperienceSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ContactSection } from './components/ContactSection'
import { BackToTop } from './components/BackToTop'
import { Footer } from './components/Footer'
import './globals.css'
import './App.css'
import './styles/sections.css'
import './styles/site-ui.css'

function App() {
  // Initialize custom animated cursor
  useAnimatedCursor()

  return (
    <main className="main-layout" id="top">
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
    </main>
  )
}

export default App
