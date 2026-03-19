import { useEffect, useRef } from 'react'

const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]<>/\\|;:ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const FONT_SIZE = 14
const TRAIL_LENGTH = 20
const NAME_BLEND_FRAMES = 30
const EXPLODE_FRAMES = 46

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)]

const makeTrail = () => Array.from({ length: TRAIL_LENGTH }, () => randomChar())

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export const CodeRainIdentity = () => {
  const canvasRef = useRef(null)
  const animationRef = useRef(0)
  const modeRef = useRef('rain')
  const hoverActiveRef = useRef(false)
  const mouseRef = useRef({ x: -999, y: -999 })
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 })
  const columnsRef = useRef([])
  const particlesRef = useRef([])
  const targetPointsRef = useRef([])
  const blendFramesRef = useRef(0)
  const explodeFramesRef = useRef(0)
  const settlePulseFramesRef = useRef(0)
  const settlePulseTriggeredRef = useRef(false)
  const resizeObserverRef = useRef(null)
  const autoCycleStopRef = useRef(null)
  const cycleTimerRef = useRef(null)
  const cycleTimerNameRef = useRef(null)
  const leaveTimerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) {
      return undefined
    }

    let mounted = true

    const initializeRain = (width, height) => {
      const cols = Math.max(1, Math.floor(width / FONT_SIZE))
      columnsRef.current = Array.from({ length: cols }, () => ({
        y: -Math.random() * height,
        speed: 1.2 + Math.random() * 2.3,
        chars: makeTrail(),
        tick: 0,
      }))
    }

    const computeTargetPoints = (width, height) => {
      const offscreen = document.createElement('canvas')
      offscreen.width = width
      offscreen.height = height
      const offscreenCtx = offscreen.getContext('2d')

      if (!offscreenCtx) {
        targetPointsRef.current = []
        return
      }

      offscreenCtx.clearRect(0, 0, width, height)
      const nameSize = Math.min(width / 5, 80)
      offscreenCtx.font = `bold ${nameSize}px monospace`
      offscreenCtx.textAlign = 'center'
      offscreenCtx.textBaseline = 'middle'
      offscreenCtx.fillStyle = '#ffffff'
      offscreenCtx.fillText('SAHIL SALAP', width / 2, height / 2)

      const image = offscreenCtx.getImageData(0, 0, width, height)
      const points = []

      for (let y = 0; y < height; y += 6) {
        for (let x = 0; x < width; x += 6) {
          const alpha = image.data[(y * width + x) * 4 + 3]
          if (alpha > 128) {
            points.push({ x, y })
          }
        }
      }

      targetPointsRef.current = points
    }

    const createParticles = (width, height, useRainSpawn = false) => {
      const points = targetPointsRef.current
      const cols = columnsRef.current

      particlesRef.current = points.map((point) => {
        const colIndex = clamp(Math.floor(point.x / FONT_SIZE), 0, Math.max(0, cols.length - 1))
        const drop = cols[colIndex]

        const spawnFromRain = useRainSpawn && drop
        const startX = spawnFromRain
          ? colIndex * FONT_SIZE + (Math.random() - 0.5) * FONT_SIZE * 0.8
          : Math.random() * width
        const startY = spawnFromRain
          ? drop.y + (Math.random() - 0.5) * FONT_SIZE * 4
          : Math.random() * height

        return {
          x: startX,
          y: startY,
        tx: point.x,
        ty: point.y,
        vx: 0,
        vy: 0,
          spring: 0.04 + Math.random() * 0.02,
          damping: 0.78 + Math.random() * 0.04,
          delay: Math.floor(Math.random() * 49),
        char: randomChar(),
          tick: Math.floor(Math.random() * 6),
          settled: false,
        }
      })

      settlePulseTriggeredRef.current = false
      settlePulseFramesRef.current = 0
    }

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) {
        return
      }

      const width = Math.max(1, Math.floor(parent.clientWidth))
      const height = Math.max(1, Math.floor(parent.clientHeight))
      const dpr = window.devicePixelRatio || 1

      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = '100%'
      canvas.style.height = '100%'

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)

      dimensionsRef.current = { width, height, dpr }
      initializeRain(width, height)
      computeTargetPoints(width, height)
      createParticles(width, height, false)
    }

    const setMode = (nextMode, options = {}) => {
      const { prepareName = false } = options

      modeRef.current = nextMode

      if (nextMode === 'name') {
        blendFramesRef.current = NAME_BLEND_FRAMES
        if (prepareName) {
          const { width, height } = dimensionsRef.current
          createParticles(width, height, true)
        }
      }

      if (nextMode === 'rain') {
        explodeFramesRef.current = 0
      }

      if (nextMode === 'explode') {
        explodeFramesRef.current = EXPLODE_FRAMES
      }
    }

    const clearAutoTimers = () => {
      if (cycleTimerRef.current) {
        clearTimeout(cycleTimerRef.current)
      }
      if (cycleTimerNameRef.current) {
        clearTimeout(cycleTimerNameRef.current)
      }
    }

    const drawRain = () => {
      const { width, height } = dimensionsRef.current
      context.fillStyle = 'rgba(3,7,18,0.18)'
      context.fillRect(0, 0, width, height)

      context.font = `${FONT_SIZE}px monospace`
      context.textAlign = 'left'
      context.textBaseline = 'top'

      const cols = columnsRef.current
      cols.forEach((drop, colIndex) => {
        drop.tick += 1

        if (drop.tick % 4 === 0) {
          const randomIndex = Math.floor(Math.random() * drop.chars.length)
          drop.chars[randomIndex] = randomChar()
        }

        const x = colIndex * FONT_SIZE

        for (let j = 0; j < drop.chars.length; j += 1) {
          const y = drop.y - j * FONT_SIZE
          if (y < -FONT_SIZE || y > height + FONT_SIZE) {
            continue
          }

          if (j === 0) {
            context.fillStyle = 'rgba(220,255,240,1)'
          } else if (j === 1 || j === 2) {
            context.fillStyle = 'rgba(0,255,135,0.9)'
          } else {
            const alpha = Math.max(0.03, (1 - j / drop.chars.length) * 0.35)
            context.fillStyle = `rgba(0,255,135,${alpha})`
          }

          context.fillText(drop.chars[j], x, y)
        }

        drop.y += drop.speed

        if (drop.y > height + drop.chars.length * FONT_SIZE) {
          drop.y = -Math.random() * height * 0.8
          drop.speed = 1.2 + Math.random() * 2.3
          drop.chars = makeTrail()
          drop.tick = 0
        }
      })

      if (mouseRef.current.x > -900 && mouseRef.current.y > -900) {
        const glow = context.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          90,
        )
        glow.addColorStop(0, 'rgba(0,255,135,0.07)')
        glow.addColorStop(1, 'rgba(0,255,135,0)')
        context.fillStyle = glow
        context.beginPath()
        context.arc(mouseRef.current.x, mouseRef.current.y, 90, 0, Math.PI * 2)
        context.fill()
      }
    }

    const updateAndDrawParticles = ({ springEnabled, repelEnabled, fillAlpha }) => {
      const { width, height } = dimensionsRef.current
      const particles = particlesRef.current

      context.fillStyle = `rgba(3,7,18,${fillAlpha})`
      context.fillRect(0, 0, width, height)

      context.font = `bold ${FONT_SIZE}px monospace`
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      let settledCount = 0

      particles.forEach((particle) => {
        const toTargetX = particle.tx - particle.x
        const toTargetY = particle.ty - particle.y
        const distToTarget = Math.hypot(toTargetX, toTargetY)

        if (springEnabled && particle.delay > 0) {
          particle.delay -= 1
        }

        const canSpring = springEnabled && particle.delay <= 0
        if (canSpring) {
          particle.vx += toTargetX * particle.spring
          particle.vy += toTargetY * particle.spring
        }

        if (repelEnabled) {
          const mouseDx = particle.x - mouseRef.current.x
          const mouseDy = particle.y - mouseRef.current.y
          const mouseDist = Math.hypot(mouseDx, mouseDy)

          if (mouseDist < 80 && mouseDist > 0.001) {
            const force = ((80 - mouseDist) / 80) * 3
            particle.vx += (mouseDx / mouseDist) * force
            particle.vy += (mouseDy / mouseDist) * force
          }
        }

        particle.vx *= particle.damping
        particle.vy *= particle.damping
        particle.x += particle.vx
        particle.y += particle.vy

        particle.tick += 1

        if (distToTarget > 8) {
          const flickerRate = particle.tick % (3 + (particle.tick % 2))
          if (flickerRate === 0) {
            particle.char = randomChar()
          }
        }

        if (distToTarget < 4) {
          particle.settled = true
          settledCount += 1
          context.fillStyle = '#00ff87'
          context.fillText('█', particle.x, particle.y)
        } else {
          particle.settled = false
          const alpha = Math.max(0.15, 1 - distToTarget / 200)
          context.fillStyle = `rgba(0,255,135,${alpha})`
          context.fillText(particle.char, particle.x, particle.y)
        }
      })

      return {
        settledRatio: particles.length > 0 ? settledCount / particles.length : 0,
      }
    }

    const drawNameAssembly = () => {
      const { width, height } = dimensionsRef.current
      if (blendFramesRef.current > 0) {
        drawRain()
        blendFramesRef.current -= 1
      }

      const result = updateAndDrawParticles({
        springEnabled: true,
        repelEnabled: true,
        fillAlpha: blendFramesRef.current > 0 ? 0.16 : 0.25,
      })

      if (!settlePulseTriggeredRef.current && result.settledRatio >= 0.9) {
        settlePulseTriggeredRef.current = true
        settlePulseFramesRef.current = 60
      }

      let centerGlowAlpha = 0.04
      if (settlePulseFramesRef.current > 0) {
        const progress = settlePulseFramesRef.current / 60
        centerGlowAlpha = 0.03 + 0.05 * progress
        settlePulseFramesRef.current -= 1
      }

      const identityGlow = context.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width * 0.3,
      )
      identityGlow.addColorStop(0, `rgba(0,255,135,${centerGlowAlpha})`)
      identityGlow.addColorStop(1, 'rgba(0,255,135,0)')
      context.fillStyle = identityGlow
      context.fillRect(0, 0, width, height)
    }

    const drawExplode = () => {
      drawRain()

      updateAndDrawParticles({
        springEnabled: false,
        repelEnabled: false,
        fillAlpha: 0.2,
      })

      explodeFramesRef.current -= 1
      if (explodeFramesRef.current <= 0 && !hoverActiveRef.current) {
        setMode('rain')
      }
    }

    const loop = () => {
      if (!mounted) {
        return
      }

      if (modeRef.current === 'name') {
        drawNameAssembly()
      } else if (modeRef.current === 'explode') {
        drawExplode()
      } else {
        drawRain()
      }

      animationRef.current = requestAnimationFrame(loop)
    }

    const startAutoCycle = () => {
      clearAutoTimers()

      const cycle = () => {
        if (hoverActiveRef.current) {
          cycleTimerRef.current = setTimeout(cycle, 350)
          return
        }

        setMode('rain')

        cycleTimerRef.current = setTimeout(() => {
          if (!hoverActiveRef.current) {
            setMode('name', { prepareName: true })
          }
          cycleTimerNameRef.current = setTimeout(cycle, 5000)
        }, 4000)
      }

      cycle()

      autoCycleStopRef.current = () => {
        clearAutoTimers()
      }
    }

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }

    const handleMouseEnter = () => {
      hoverActiveRef.current = true
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current)
      }
      setMode('name', { prepareName: true })
    }

    const handleMouseLeave = () => {
      hoverActiveRef.current = false
      mouseRef.current = { x: -999, y: -999 }

      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current)
      }

      particlesRef.current.forEach((particle) => {
        const burstX = (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 4)
        const burstY = (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 4)
        particle.vx += burstX
        particle.vy += burstY
      })

      setMode('explode')

      leaveTimerRef.current = setTimeout(() => {
        if (!hoverActiveRef.current) {
          setMode('rain')
        }
      }, 1200)
    }

    resizeCanvas()
    startAutoCycle()
    animationRef.current = requestAnimationFrame(loop)

    resizeObserverRef.current = new ResizeObserver(() => {
      resizeCanvas()
    })

    const parent = canvas.parentElement
    if (parent) {
      resizeObserverRef.current.observe(parent)
    }

    window.addEventListener('resize', resizeCanvas)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseenter', handleMouseEnter)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      mounted = false
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }

      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current)
      }

      if (autoCycleStopRef.current) {
        autoCycleStopRef.current()
      }

      hoverActiveRef.current = false
      mouseRef.current = { x: -999, y: -999 }
    }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}
