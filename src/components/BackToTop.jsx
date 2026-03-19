import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const BackToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="back-to-top"
          className="back-to-top"
          initial={{ opacity: 0, y: 18, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          aria-label="Back to top"
        >
          ↑
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
