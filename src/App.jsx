import { useState, useEffect, useRef } from 'react'
import './index.css'
import ParticleBackground from './components/ParticleBackground'
import ProgressBar from './components/ProgressBar'
import LandingPage from './components/LandingPage'
import PuzzleOne from './components/PuzzleOne'
import PuzzleTwo from './components/PuzzleTwo'
import PuzzleThree from './components/PuzzleThree'
import BirthdayReveal from './components/BirthdayReveal'

const STAGES = ['landing', 'puzzle1', 'puzzle2', 'puzzle3', 'reveal']
const LOADING_MESSAGES = [
  "Decrypting your smile...",
  "Bypassing your cute firewall...",
  "Running heart.exe...",
  "Unlocking the next stage..."
]

export default function App() {
  const [stage, setStage] = useState('landing')
  const [transitionState, setTransitionState] = useState('active') // 'active' | 'exit' | 'enter'
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0])

  // Global spark cursor effect
  useEffect(() => {
    let lastTime = 0;
    const handleMouseMove = (e) => {
      const now = Date.now();
      // Throttle slightly to ensure performance, but spawn rapidly (every 20ms)
      if (now - lastTime < 20) return;
      lastTime = now;

      // Ensure high spawn rate so it's very noticeable
      if (Math.random() > 0.8) return;

      const spark = document.createElement('div')
      spark.className = 'cursor-sparkle'
      spark.style.left = `${e.clientX}px`
      spark.style.top = `${e.clientY}px`
      // random size
      const size = Math.random() * 5 + 4
      spark.style.width = `${size}px`
      spark.style.height = `${size}px`
      // random color between pink and gold
      spark.style.background = Math.random() > 0.5 ? 'var(--accent-light)' : 'var(--cel-gold)'
      // random drift direction
      spark.style.setProperty('--sparkle-x', `${(Math.random() - 0.5) * 60}px`)

      document.body.appendChild(spark)
      setTimeout(() => spark.remove(), 800)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const isCelebration = stage === 'reveal'
  const showProgress = ['puzzle1', 'puzzle2', 'puzzle3'].includes(stage) && !isLoading

  const goToStage = (nextStage) => {
    setTransitionState('exit')

    setTimeout(() => {
      // Show loading screen randomly picking a message
      if (nextStage !== 'reveal') {
        const randomMsg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
        setLoadingMsg(randomMsg)
      } else {
        setLoadingMsg("Preparing something special...")
      }
      setIsLoading(true)

      // Keep loading screen up for 2 seconds
      setTimeout(() => {
        setIsLoading(false)
        setStage(nextStage)
        setTransitionState('enter')

        requestAnimationFrame(() => {
          setTimeout(() => setTransitionState('active'), 50)
        })
      }, 2000)
    }, 400)
  }

  const transitionClass =
    transitionState === 'exit' ? 'page-transition-exit' :
      transitionState === 'enter' ? 'page-transition-enter' :
        'page-transition-active'

  return (
    <>
      <ParticleBackground celebration={isCelebration} />

      {showProgress && <ProgressBar currentStep={STAGES.indexOf(stage) - 1} />}

      {isLoading && (
        <div className="loading-screen" style={{ opacity: 1, transition: 'opacity 0.5s' }}>
          <div className="loading-spinner"></div>
          <p className="loading-text" style={{ fontFamily: 'var(--font-cursive)', fontSize: '1.5rem', textTransform: 'none', letterSpacing: 'normal' }}>
            {loadingMsg}
          </p>
        </div>
      )}

      {!isLoading && (
        <div className={transitionClass}>
          {stage === 'landing' && <LandingPage onStart={() => goToStage('puzzle1')} />}
          {stage === 'puzzle1' && <PuzzleOne onComplete={() => goToStage('puzzle2')} />}
          {stage === 'puzzle2' && <PuzzleTwo onComplete={() => goToStage('puzzle3')} />}
          {stage === 'puzzle3' && <PuzzleThree onComplete={() => goToStage('reveal')} />}
          {stage === 'reveal' && <BirthdayReveal />}
        </div>
      )}
    </>
  )
}
