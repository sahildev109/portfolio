import { useEffect, useRef } from 'react'

const TRAIL_COUNT = 12
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [draggable="true"]'

const getDistance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)
const lerp = (start, end, factor) => start + (end - start) * factor

export const CursorFX = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const crossRef = useRef(null)
  const labelRef = useRef(null)
  const trailRefs = useRef([])

  const rafRef = useRef(0)
  const idleTimerRef = useRef(null)
  const interactiveRef = useRef(null)
  const labelTextRef = useRef('')

  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const ringRefPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const ringScaleRef = useRef(1)
  const ringScaleTargetRef = useRef(1)
  const pressFactorRef = useRef(1)
  const pressFactorTargetRef = useRef(1)
  const idleRef = useRef(false)

  const historyRef = useRef(Array.from({ length: TRAIL_COUNT }, () => ({ x: mouseRef.current.x, y: mouseRef.current.y })))
  const trailPosRef = useRef(Array.from({ length: TRAIL_COUNT }, () => ({ x: mouseRef.current.x, y: mouseRef.current.y })))
  const magneticTargetRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const cross = crossRef.current
    const label = labelRef.current

    if (!dot || !ring || !cross || !label) {
      return undefined
    }

    const setIdle = (value) => {
      idleRef.current = value
      if (value) {
        ring.classList.add('cursorfx-ring-idle')
      } else {
        ring.classList.remove('cursorfx-ring-idle')
      }
    }

    const queueIdle = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }

      idleTimerRef.current = setTimeout(() => {
        setIdle(true)
      }, 2000)
    }

    const setLabelForElement = (element) => {
      if (!element) {
        interactiveRef.current = null
        labelTextRef.current = ''
        ringScaleTargetRef.current = 1
        label.style.opacity = '0'
        return
      }

      interactiveRef.current = element

      if (element.matches('[draggable="true"]')) {
        labelTextRef.current = 'DRAG'
      } else if (element.matches('button, [role="button"]')) {
        labelTextRef.current = 'EXECUTE'
      } else {
        labelTextRef.current = 'OPEN'
      }

      label.textContent = labelTextRef.current
      label.style.opacity = '1'
      ringScaleTargetRef.current = 2.2
    }

    const findMagneticTarget = (x, y) => {
      const nodes = document.querySelectorAll(INTERACTIVE_SELECTOR)
      let closest = null
      let closestDist = Infinity

      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) {
          return
        }

        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dist = getDistance(x, y, cx, cy)

        if (dist < 60 && dist < closestDist) {
          closest = { x: cx, y: cy }
          closestDist = dist
        }
      })

      magneticTargetRef.current = closest
    }

    const positionDot = (x, y) => {
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      cross.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }

    const onMouseMove = (event) => {
      const x = event.clientX
      const y = event.clientY

      mouseRef.current.x = x
      mouseRef.current.y = y
      setIdle(false)
      queueIdle()

      positionDot(x, y)

      const interactiveElement = event.target.closest(INTERACTIVE_SELECTOR)
      setLabelForElement(interactiveElement)
      findMagneticTarget(x, y)
    }

    const onMouseDown = () => {
      pressFactorRef.current = 0.7
      pressFactorTargetRef.current = 1
    }

    const spawnClickBurst = (x, y) => {
      const wrapper = document.createElement('div')
      wrapper.style.position = 'fixed'
      wrapper.style.left = `${x}px`
      wrapper.style.top = `${y}px`
      wrapper.style.width = '0'
      wrapper.style.height = '0'
      wrapper.style.pointerEvents = 'none'
      wrapper.style.zIndex = '10000'
      document.body.appendChild(wrapper)

      for (let i = 0; i < 8; i += 1) {
        const particle = document.createElement('div')
        const angle = (Math.PI * 2 * i) / 8
        const distance = 40 + Math.random() * 20
        const dx = Math.cos(angle) * distance
        const dy = Math.sin(angle) * distance

        particle.style.position = 'absolute'
        particle.style.left = '0'
        particle.style.top = '0'
        particle.style.width = '3px'
        particle.style.height = '3px'
        particle.style.borderRadius = '50%'
        particle.style.background = Math.random() > 0.5 ? '#00ff87' : '#ffffff'
        particle.style.transform = 'translate(-50%, -50%)'
        particle.style.opacity = '1'
        particle.style.transition = 'transform 400ms ease-out, opacity 400ms ease-out'
        particle.style.boxShadow = '0 0 8px rgba(0,255,135,0.5)'

        wrapper.appendChild(particle)

        requestAnimationFrame(() => {
          particle.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`
          particle.style.opacity = '0'
        })
      }

      setTimeout(() => {
        wrapper.remove()
      }, 430)
    }

    const onClick = (event) => {
      spawnClickBurst(event.clientX, event.clientY)
    }

    const onMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 }
      magneticTargetRef.current = null
      setLabelForElement(null)
    }

    const onMouseEnter = (event) => {
      mouseRef.current = { x: event.clientX, y: event.clientY }
      positionDot(event.clientX, event.clientY)
      queueIdle()
    }

    positionDot(mouseRef.current.x, mouseRef.current.y)
    queueIdle()

    const tick = () => {
      const mouse = mouseRef.current
      historyRef.current.unshift({ x: mouse.x, y: mouse.y })
      historyRef.current.length = TRAIL_COUNT

      let targetX = mouse.x
      let targetY = mouse.y

      if (magneticTargetRef.current) {
        targetX = lerp(targetX, magneticTargetRef.current.x, 0.15)
        targetY = lerp(targetY, magneticTargetRef.current.y, 0.15)
      }

      ringRefPos.current.x = lerp(ringRefPos.current.x, targetX, 0.12)
      ringRefPos.current.y = lerp(ringRefPos.current.y, targetY, 0.12)

      ringScaleRef.current = lerp(ringScaleRef.current, ringScaleTargetRef.current, 0.2)
      pressFactorRef.current = lerp(pressFactorRef.current, pressFactorTargetRef.current, 0.22)
      const computedScale = ringScaleRef.current * pressFactorRef.current

      ring.style.transform = `translate3d(${ringRefPos.current.x}px, ${ringRefPos.current.y}px, 0) translate(-50%, -50%) scale(${computedScale})`
      ring.style.borderColor = ringScaleTargetRef.current > 1 ? 'rgba(0,255,135,1)' : 'rgba(0,255,135,0.6)'

      label.style.transform = `translate3d(${ringRefPos.current.x}px, ${ringRefPos.current.y - 30}px, 0) translate(-50%, -50%)`

      for (let i = 0; i < TRAIL_COUNT; i += 1) {
        const trailNode = trailRefs.current[i]
        if (!trailNode) {
          continue
        }

        const target = historyRef.current[i] || historyRef.current[historyRef.current.length - 1]
        const lerpFactor = Math.max(0.08, 0.35 - i * 0.02)
        const current = trailPosRef.current[i]

        current.x = lerp(current.x, target.x, lerpFactor)
        current.y = lerp(current.y, target.y, lerpFactor)

        const ratio = 1 - i / TRAIL_COUNT
        const size = 4 * ratio
        const opacity = 0.5 * ratio
        const color = Math.floor(i / 3) % 2 === 0 ? '#00ff87' : '#7c3aed'

        trailNode.style.width = `${size}px`
        trailNode.style.height = `${size}px`
        trailNode.style.opacity = `${opacity}`
        trailNode.style.background = color
        trailNode.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('click', onClick)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('mouseenter', onMouseEnter)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('click', onClick)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseenter', onMouseEnter)

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      <style>
        {`
          @keyframes cursorfx-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes cursorfx-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }

          .cursorfx-ring-idle::before {
            animation: cursorfx-spin 3s linear infinite;
          }

          .cursorfx-ring-idle {
            animation: cursorfx-pulse 3s ease-in-out infinite;
          }
        `}
      </style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
        aria-hidden="true"
      >
        <div
          ref={dotRef}
          style={{
            position: 'fixed',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 0 10px rgba(255,255,255,0.5)',
            willChange: 'transform',
          }}
        />

        <div
          ref={ringRef}
          style={{
            position: 'fixed',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid rgba(0,255,135,0.6)',
            willChange: 'transform, border-color, opacity',
          }}
        />

        {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
          <div
            key={`trail-${i}`}
            ref={(node) => {
              trailRefs.current[i] = node
            }}
            style={{
              position: 'fixed',
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              opacity: 0,
              willChange: 'transform, opacity, width, height',
            }}
          />
        ))}

        <div
          ref={crossRef}
          style={{
            position: 'fixed',
            width: '60px',
            height: '60px',
            willChange: 'transform',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              width: '60px',
              height: '1px',
              background: 'rgba(0,255,135,0.15)',
              transform: 'translateY(-50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              width: '1px',
              height: '60px',
              background: 'rgba(0,255,135,0.15)',
              transform: 'translateX(-50%)',
            }}
          />
        </div>

        <div
          ref={labelRef}
          style={{
            position: 'fixed',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: '#00ff87',
            opacity: 0,
            transition: 'opacity 180ms ease',
            whiteSpace: 'nowrap',
            willChange: 'transform, opacity',
          }}
        >
          OPEN
        </div>
      </div>
    </>
  )
}
