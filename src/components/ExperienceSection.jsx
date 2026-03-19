import { motion } from 'framer-motion'

const experiences = [
  {
    role: 'Backend Developer Intern',
    company: 'Arthlete Motions Pvt. Ltd',
    duration: 'Jun 2025 – Jul 2025',
    points: [
      'Built RESTful APIs (login, exercise logging, data storage) with Node.js, Express, MongoDB.',
      'Integrated backend services with React Native frontend.',
      'Tested API workflows using Thunder Client.',
    ],
  },
  {
    role: 'Software Developer Engineer (Web) Intern',
    company: 'COMPOZENT',
    duration: 'Dec 2024 – Jan 2025',
    points: [
      'Contributed to frontend web development tasks.',
      'Worked on real-world project deployment.',
      'Collaborated in Agile workflows.',
    ],
  },
]

const cardVariants = {
  hidden: { opacity: 0, x: 44 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
}

export const ExperienceSection = () => {
  return (
    <section className="experience-section section-shell" id="experience">
      <div className="section-head">
        <h2
          className="section-title section-title-exp section-title-glitch"
          data-text="DEPLOYED IN THE FIELD"
        >
          DEPLOYED IN THE FIELD
        </h2>
        <motion.span
          className="section-underline arsenal-underline"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5, margin: '-80px 0px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <div className="timeline-wrap">
        <svg
          className="timeline-svg"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d="M1 0 L1 100"
            stroke="var(--accent)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3, margin: '-80px 0px' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </svg>

        <motion.div
          className="timeline-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '-80px 0px' }}
          transition={{ staggerChildren: 0.16 }}
        >
          {experiences.map((exp) => (
            <motion.article
              key={`${exp.role}-${exp.company}`}
              className="exp-card"
              variants={cardVariants}
            >
              <p className="exp-duration">{exp.duration}</p>
              <h3 className="exp-role">{exp.role}</h3>
              <p className="exp-company">{exp.company}</p>
              <ul className="exp-points">
                {exp.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
