import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const STATS = [
  { value: 9.09, label: 'CGPA', suffix: '', decimal: true, duration: 1800 },
  { value: 4, label: 'PROJECTS BUILT', suffix: '+', decimal: false, duration: 1200 },
  { value: 2, label: 'INTERNSHIPS', suffix: '', decimal: false, duration: 1000 },
  { value: 2, label: 'YEARS CODING', suffix: '+', decimal: false, duration: 1400 },
]

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

const formatValue = (stat, value, isComplete) => {
  if (stat.decimal) {
    return value.toFixed(2)
  }

  if (isComplete) {
    return String(stat.value)
  }

  return String(Math.floor(value))
}

export const StatsBar = () => {
  const rootRef = useRef(null)
  const observerRef = useRef(null)
  const rafRef = useRef(0)
  const startedRef = useRef(false)

  const [entered, setEntered] = useState(false)
  const [displayValues, setDisplayValues] = useState(() => STATS.map(() => '0'))

  useEffect(() => {
    const root = rootRef.current
    if (!root) {
      return undefined
    }

    const startAnimation = () => {
      if (startedRef.current) {
        return
      }

      startedRef.current = true
      setEntered(true)

      const start = performance.now()

      const animate = (time) => {
        const next = STATS.map((stat, index) => {
          const delay = index * 100
          const elapsed = Math.max(0, time - start - delay)
          const progress = Math.min(1, elapsed / stat.duration)
          const eased = easeOutQuart(progress)
          const currentValue = stat.value * eased
          return formatValue(stat, currentValue, progress >= 1)
        })

        setDisplayValues(next)

        const done = STATS.every((stat, index) => {
          const delay = index * 100
          return time - start - delay >= stat.duration
        })

        if (!done) {
          rafRef.current = requestAnimationFrame(animate)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation()
            observerRef.current?.disconnect()
          }
        })
      },
      {
        threshold: 0.25,
      },
    )

    observerRef.current.observe(root)

    return () => {
      observerRef.current?.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const statItems = useMemo(
    () =>
      STATS.map((stat, index) => ({
        ...stat,
        display: displayValues[index] || (stat.decimal ? '0.00' : '0'),
        delay: index * 100,
      })),
    [displayValues],
  )

  return (
    <motion.section
      className="statsbar"
      ref={rootRef}
      aria-label="Highlights"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3, margin: '-80px 0px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="statsbar-inner">
        {statItems.map((item, index) => (
          <article
            key={item.label}
            className={`statsbar-item ${index === statItems.length - 1 ? 'is-last' : ''} ${entered ? 'is-entered' : ''}`}
            style={{ transitionDelay: `${item.delay}ms` }}
          >
            <div className="statsbar-glow" aria-hidden="true" />
            <h3 className="statsbar-number-wrap">
              <span className="statsbar-number">{item.display}</span>
              {item.suffix ? <span className="statsbar-suffix">{item.suffix}</span> : null}
            </h3>
            <p className="statsbar-label">{item.label}</p>
          </article>
        ))}
      </div>
    </motion.section>
  )
}
