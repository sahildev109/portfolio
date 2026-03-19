import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 80

export const GlobalParticles = () => {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) {
      return undefined
    }

    const initializeParticles = (width, height) => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.2 + Math.random() * 0.8,
        radius: 0.6 + Math.random() * 1.8,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.6 ? 'rgba(0,255,135,0.35)' : 'rgba(241,245,249,0.28)',
      }))
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      initializeParticles(width, height)
    }

    const tick = (time) => {
      const width = window.innerWidth
      const height = window.innerHeight

      context.clearRect(0, 0, width, height)

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX * particle.z
        particle.y += particle.speedY * particle.z

        const drift = Math.sin(time * 0.0007 + particle.phase) * 0.18
        particle.y += drift * particle.z

        if (particle.x < -20) particle.x = width + 20
        if (particle.x > width + 20) particle.x = -20
        if (particle.y < -20) particle.y = height + 20
        if (particle.y > height + 20) particle.y = -20

        context.beginPath()
        context.fillStyle = particle.color
        context.arc(particle.x, particle.y, particle.radius * particle.z, 0, Math.PI * 2)
        context.fill()
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    resize()
    rafRef.current = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="global-particles" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
