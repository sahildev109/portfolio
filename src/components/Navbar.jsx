import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const navItems = [
  { label: 'Work', href: '#work', number: '01' },
  { label: 'Arsenal', href: '#skills', number: '02' },
  { label: 'Experience', href: '#experience', number: '03' },
  { label: 'Contact', href: '#contact', number: '04' },
]

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <a href="#top" className="site-logo" aria-label="Go to top">
          <span className="logo-bracket logo-bracket--left">[</span>
          <span className="logo-text">SS</span>
          <span className="logo-bracket logo-bracket--right">]</span>
          <span className="logo-cursor" aria-hidden="true">
            |
          </span>
        </a>

        <nav aria-label="Primary navigation" className="site-nav-center">
          <ul className="site-nav-links">
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href}>
                  <span className="nav-number">{item.number}.</span> {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-status" aria-label="Availability status">
          <span className="site-status-dot" aria-hidden="true" />
          AVAILABLE FOR HIRE
        </div>

        <button
          className="nav-menu-toggle"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <button
              className="mobile-nav-close"
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation menu"
            >
              ×
            </button>

            <nav className="mobile-nav-links" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
