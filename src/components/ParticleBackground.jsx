import { useState, useEffect } from 'react'

export default function ParticleBackground({ celebration = false }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const count = 35
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 18 + 10,
      delay: Math.random() * 18,
      opacity: Math.random() * 0.4 + 0.1,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            background: celebration
              ? `rgba(236, 72, 153, ${p.opacity})`
              : `rgba(236, 72, 153, ${p.opacity * 0.6})`,
          }}
        />
      ))}
    </div>
  )
}
