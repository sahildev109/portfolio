import { motion } from 'framer-motion'

export const ContactSection = () => {
  const contacts = [
    {
      label: 'Email',
      value: 'sahilsalap75@gmail.com',
      href: 'mailto:sahilsalap75@gmail.com',
    },
    {
      label: 'GitHub',
      value: '@sahildev109',
      href: 'https://github.com/sahildev109',
    },
    {
      label: 'LinkedIn',
      value: 'Sahil Salap',
      href: 'https://www.linkedin.com/',
    },
    {
      label: 'Location',
      value: 'Mira-Bhayander, India',
      href: 'https://maps.google.com/?q=Mira-Bhayander,India',
    },
  ]

  return (
    <motion.section
      className="contact-section section-shell"
      id="contact"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: '-80px 0px' }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      <div className="contact-grid">
        <div className="contact-left">
          <h2 className="contact-title">
            <span className="contact-title-line section-title-glitch" data-text="OPEN">
              OPEN
            </span>
            <span className="contact-title-line section-title-glitch" data-text="TO">
              TO
            </span>
            <span className="contact-title-line section-title-glitch" data-text="CONNECT">
              CONNECT
            </span>
          </h2>
          <p className="contact-status">
            Currently available for internships, freelance & collabs.
          </p>
        </div>

        <ul className="contact-list" aria-label="Contact links">
          {contacts.map((contact) => (
            <li key={contact.label}>
              <a href={contact.href} target="_blank" rel="noreferrer" className="contact-link">
                <span className="contact-link-label">{contact.label}</span>
                <span className="contact-link-value">{contact.value}</span>
                <span className="contact-link-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  )
}
