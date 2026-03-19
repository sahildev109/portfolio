import { motion } from 'framer-motion'

const skillsByCategory = [
  {
    category: 'Languages',
    accent: '#00ff87',
    slug: 'languages',
    skills: ['Python', 'JavaScript', 'C'],
  },
  {
    category: 'Frontend',
    accent: '#38bdf8',
    slug: 'frontend',
    skills: ['React.js', 'Tailwind CSS', 'Chakra-UI', 'Zustand', 'Firebase'],
  },
  {
    category: 'Backend',
    accent: '#7c3aed',
    slug: 'backend',
    skills: [
      'Node.js',
      'Express.js',
      'Socket.IO',
      'MongoDB',
      'Firebase Firestore',
      'SQL',
    ],
  },
  {
    category: 'Tools',
    accent: '#f59e0b',
    slug: 'tools',
    skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'Cloudinary'],
  },
]

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

const getSkillPrefix = (index) => {
  const prefixes = ['>', 'λ', '#']
  return prefixes[index % prefixes.length]
}

export const SkillsSection = () => {
  return (
    <section className="skills-section section-shell" id="skills">
      <div className="section-head section-head-arsenal">
        <p className="skills-meta-label">// 003 SKILLS</p>
        <h2 className="section-title arsenal-title" data-text="ARSENAL">
          ARSENAL
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
        className="skills-stage"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="skills-grid">
          {skillsByCategory.map(({ category, skills, accent, slug }) => (
            <motion.article
              key={category}
              className={`skills-card skills-card--${slug}`}
              style={{ '--card-accent': accent }}
              variants={cardVariants}
            >
              <span className="skills-corner-glow" aria-hidden="true" />
              <p className="skills-label">{category}</p>
              <div className="skills-pills">
                {skills.map((skill, index) => (
                  <span key={`${category}-${skill}`} className="skill-pill">
                    <span className="skill-prefix" aria-hidden="true">
                      {getSkillPrefix(index)}
                    </span>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
