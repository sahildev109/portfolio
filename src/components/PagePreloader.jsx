import { useEffect, useMemo, useRef, useState } from 'react'
import '../styles/preloader.css'

const TYPE_SPEED = 28

const BOOT_LINES = [
  { text: '> INITIALIZING SAHIL_OS...', color: 'rgba(0,255,135,0.5)', delayAfter: 100, bold: false, size: 13 },
  { text: '> LOADING CORE MODULES.......... OK', color: 'rgba(0,255,135,0.5)', delayAfter: 80, bold: false, size: 13 },
  { text: '> MOUNTING SKILL STACK........... OK', color: 'rgba(0,255,135,0.5)', delayAfter: 80, bold: false, size: 13 },
  { text: '> CONNECTING TO INTERNET......... OK', color: 'rgba(0,255,135,0.5)', delayAfter: 80, bold: false, size: 13 },
  { text: '> VERIFYING IDENTITY............. OK', color: 'rgba(0,255,135,0.5)', delayAfter: 80, bold: false, size: 13 },
  { text: '> WELCOME. PROFILE: SAHIL SALAP', color: '#00ff87', delayAfter: 200, bold: true, size: 13 },
  { text: '> B.E. COMPUTER ENGINEERING | CGPA: 9.09', color: 'rgba(0,255,135,0.6)', delayAfter: 150, bold: false, size: 13 },
  { text: '> STATUS: AVAILABLE FOR HIRE', color: 'rgba(0,255,135,0.6)', delayAfter: 150, bold: false, size: 13 },
  { text: '> LAUNCHING PORTFOLIO...', color: '#00ff87', delayAfter: 400, bold: true, size: 15 },
]

const formatDateTime = (value) => {
  const date = value.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
  const time = value.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  return `${date} ${time}`
}

export const PagePreloader = ({ onComplete }) => {
  const [renderedLines, setRenderedLines] = useState(() => BOOT_LINES.map(() => ''))
  const [cursorLine, setCursorLine] = useState(0)
  const [progress, setProgress] = useState(0)
  const [progressVisible, setProgressVisible] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)
  const [now, setNow] = useState(() => new Date())

  const timeoutIdsRef = useRef([])
  const intervalIdsRef = useRef([])
  const rafIdsRef = useRef([])
  const completeTriggeredRef = useRef(false)
  const destroyedRef = useRef(false)

  const addTimeout = (callback, delay) => {
    const id = window.setTimeout(callback, delay)
    timeoutIdsRef.current.push(id)
    return id
  }

  const addInterval = (callback, delay) => {
    const id = window.setInterval(callback, delay)
    intervalIdsRef.current.push(id)
    return id
  }

  const addRaf = (callback) => {
    const id = window.requestAnimationFrame(callback)
    rafIdsRef.current.push(id)
    return id
  }

  const clearAllAsync = () => {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id))
    intervalIdsRef.current.forEach((id) => window.clearInterval(id))
    rafIdsRef.current.forEach((id) => window.cancelAnimationFrame(id))
    timeoutIdsRef.current = []
    intervalIdsRef.current = []
    rafIdsRef.current = []
  }

  const beginComplete = () => {
    if (completeTriggeredRef.current || destroyedRef.current) {
      return
    }

    completeTriggeredRef.current = true
    setFadingOut(true)

    addTimeout(() => {
      if (!destroyedRef.current) {
        onComplete()
      }
    }, 500)
  }

  useEffect(() => {
    const onSkip = () => {
      beginComplete()
    }

    window.addEventListener('keydown', onSkip, { once: true })
    window.addEventListener('click', onSkip, { once: true })

    return () => {
      window.removeEventListener('keydown', onSkip)
      window.removeEventListener('click', onSkip)
    }
  }, [])

  useEffect(() => {
    destroyedRef.current = false

    addInterval(() => {
      setNow(new Date())
    }, 1000)

    const typeLine = (lineIndex) => {
      if (destroyedRef.current || completeTriggeredRef.current) {
        return
      }

      if (lineIndex >= BOOT_LINES.length) {
        addTimeout(() => {
          if (destroyedRef.current || completeTriggeredRef.current) {
            return
          }

          setProgressVisible(true)

          addTimeout(() => {
            if (destroyedRef.current || completeTriggeredRef.current) {
              return
            }

            const start = performance.now()
            const animateProgress = (time) => {
              if (destroyedRef.current || completeTriggeredRef.current) {
                return
              }

              const elapsed = time - start
              const ratio = Math.min(1, elapsed / 800)
              setProgress(ratio * 100)

              if (ratio < 1) {
                addRaf(animateProgress)
              } else {
                addTimeout(() => {
                  beginComplete()
                }, 300)
              }
            }

            addRaf(animateProgress)
          }, 600)
        }, 0)

        return
      }

      const currentLine = BOOT_LINES[lineIndex]
      setCursorLine(lineIndex)

      const writeChar = (charIndex) => {
        if (destroyedRef.current || completeTriggeredRef.current) {
          return
        }

        const partial = currentLine.text.slice(0, charIndex + 1)
        setRenderedLines((prev) => {
          const next = [...prev]
          next[lineIndex] = partial
          return next
        })

        if (charIndex + 1 < currentLine.text.length) {
          addTimeout(() => writeChar(charIndex + 1), TYPE_SPEED)
        } else {
          addTimeout(() => typeLine(lineIndex + 1), currentLine.delayAfter)
        }
      }

      writeChar(0)
    }

    addTimeout(() => typeLine(0), 120)

    return () => {
      destroyedRef.current = true
      clearAllAsync()
    }
  }, [])

  const dateTimeText = useMemo(() => formatDateTime(now), [now])

  return (
    <div className={`preloader-overlay ${fadingOut ? 'is-fading' : ''}`}>
      <div className="preloader-scanlines" aria-hidden="true" />

      <p className="preloader-corner preloader-corner-top">SAHIL_OS v1.0.0</p>
      <p className="preloader-corner preloader-corner-bottom">{dateTimeText}</p>

      <div className="preloader-terminal">
        {BOOT_LINES.map((line, index) => {
          const isFullyTyped = renderedLines[index].length === line.text.length
          const showCursor = cursorLine === index && isFullyTyped && !completeTriggeredRef.current

          return (
            <p
              key={line.text}
              className="preloader-line"
              style={{
                color: line.color,
                fontWeight: line.bold ? 700 : 400,
                fontSize: `${line.size}px`,
              }}
            >
              {renderedLines[index]}
              {showCursor ? <span className="preloader-cursor">█</span> : null}
            </p>
          )
        })}

        <div className={`preloader-progress-wrap ${progressVisible ? 'is-visible' : ''}`}>
          <div className="preloader-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <button type="button" className="preloader-skip" onClick={beginComplete}>
        [ PRESS ANY KEY TO SKIP ]
      </button>
    </div>
  )
}
