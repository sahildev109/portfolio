import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const projects = [
  {
    id: '01',
    title: 'Real-Time Location Tracker',
    accent: 'var(--accent)',
    description:
      'Role-based delivery tracking system with live location sharing for vendors, delivery partners, and customers. JWT auth, real-time map updates.',
    stack: ['Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Socket.IO', 'Leaflet.js'],
    github: '#',
    live: '#',
  },
  {
    id: '02',
    title: 'Nexus — Discussion Forum',
    accent: 'var(--accent2)',
    description:
      'Full-featured discussion forum with auth, post creation, tagging, real-time chat, friend requests, and AI-based auto-tagging via OpenRouter API.',
    stack: ['React.js', 'Node.js', 'Firebase', 'Zustand', 'Cloudinary'],
    github: '#',
    live: '#',
  },
]

const fieldVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const ProjectsSection = () => {
  const cardsRef = useRef([])

  useEffect(() => {
    const disposers = []

    cardsRef.current.forEach((card) => {
      if (!card) {
        return
      }

      const onMove = (event) => {
        const rect = card.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateY = ((x - centerX) / centerX) * 8
        const rotateX = ((centerY - y) / centerY) * 8

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
      }

      const onLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
      }

      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)

      disposers.push(() => {
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => {
      disposers.forEach((dispose) => dispose())
    }
  }, [])

  return (
    <section className="projects-section" id="work">
      <div className="projects-inner">
        <div className="section-head">
          <h2 className="section-title section-title-glitch" data-text="BUILDS">
            BUILDS
          </h2>
          <motion.span
            className="section-underline arsenal-underline"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5, margin: '-80px 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        <motion.div
          className="projects-grid"
          variants={fieldVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '-80px 0px' }}
        >
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              className="project-card"
              style={{ '--card-accent': project.accent }}
              variants={cardVariants}
              ref={(node) => {
                cardsRef.current[index] = node
              }}
            >
              <span className="project-number">// {project.id}</span>

              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>

              <div className="project-links">
                <a href={project.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href={project.live} target="_blank" rel="noreferrer">
                  Live
                </a>
              </div>

              <div className="project-stack">
                {project.stack.map((tech) => (
                  <span key={`${project.title}-${tech}`} className="project-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
