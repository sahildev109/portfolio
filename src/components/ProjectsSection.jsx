import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'

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

const ParticleField = () => {
  const pointsRef = useRef(null)

  const { positions, colors } = useMemo(() => {
    const count = 260
    const positionsArray = new Float32Array(count * 3)
    const colorsArray = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const x = (Math.random() - 0.5) * 28
      const y = (Math.random() - 0.5) * 16
      const z = (Math.random() - 0.5) * 18

      positionsArray[index * 3] = x
      positionsArray[index * 3 + 1] = y
      positionsArray[index * 3 + 2] = z

      const isGreen = Math.random() > 0.55
      colorsArray[index * 3] = isGreen ? 0.0 : 0.96
      colorsArray[index * 3 + 1] = isGreen ? 1.0 : 0.98
      colorsArray[index * 3 + 2] = isGreen ? 0.53 : 0.99
    }

    return { positions: positionsArray, colors: colorsArray }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) {
      return
    }

    pointsRef.current.rotation.y = clock.elapsedTime * 0.025
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.03
    pointsRef.current.position.y = Math.sin(clock.elapsedTime * 0.35) * 0.25
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
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
      <div className="projects-particles" aria-hidden="true">
        <Canvas
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          camera={{ position: [0, 0, 12], fov: 60 }}
        >
          <ParticleField />
        </Canvas>
      </div>

      <div className="projects-inner">
        <div className="section-head">
          <h2 className="section-title section-title-glitch" data-text="BUILDS">
            BUILDS
          </h2>
          <motion.span
            className="section-underline arsenal-underline"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        <motion.div
          className="projects-grid"
          variants={fieldVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
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
