import { useState, useCallback, useRef } from 'react'
import TypewriterText from './TypewriterText'

export default function LandingPage({ onStart }) {
    const [showButton, setShowButton] = useState(false)
    const btnRef = useRef(null)

    const handleTypingDone = useCallback(() => {
        setShowButton(true)
    }, [])

    const handleClick = (e) => {
        // Ripple effect
        const btn = btnRef.current
        if (btn) {
            const rect = btn.getBoundingClientRect()
            const ripple = document.createElement('span')
            ripple.className = 'ripple'
            ripple.style.left = `${e.clientX - rect.left}px`
            ripple.style.top = `${e.clientY - rect.top}px`
            btn.appendChild(ripple)
            setTimeout(() => ripple.remove(), 600)
        }
        setTimeout(() => onStart(), 300)
    }

    return (
        <div className="page-container">
            {/* Ambient glow blobs */}
            <div className="glow-blob" style={{
                width: '300px', height: '300px',
                top: '20%', left: '10%',
                background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
            }} />
            <div className="glow-blob" style={{
                width: '250px', height: '250px',
                bottom: '15%', right: '8%',
                background: 'radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%)',
                animationDelay: '3s',
            }} />

            <div style={{ textAlign: 'center', maxWidth: '520px', position: 'relative', zIndex: 1 }}>
                {/* Tag */}
                <div className="bounce-in delay-1">
                    <span className="tag">Encrypted Transmission</span>
                </div>

                {/* Main headline */}
                <h1 className="fade-in-up delay-2" style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: 'clamp(1.8rem, 6vw, 3rem)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    marginTop: 'var(--space-lg)',
                    marginBottom: 'var(--space-md)',
                }}>
                    <span className="text-gradient">A hidden message</span>
                    <br />
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.55em' }}>
                        has been encoded for you.
                    </span>
                </h1>

                {/* Typewriter */}
                <div className="fade-in delay-4" style={{
                    marginBottom: 'var(--space-2xl)',
                    minHeight: '3rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.7,
                }}>
                    <TypewriterText
                        text="Someone put together a series of puzzles — just for you. Solve all three to decode the secret. Think you can crack it?"
                        speed={28}
                        delay={700}
                        onComplete={handleTypingDone}
                    />
                </div>

                {/* CTA */}
                {showButton && (
                    <div className="bounce-in">
                        <button
                            ref={btnRef}
                            className="btn btn-primary btn-glow"
                            onClick={handleClick}
                            style={{ fontSize: '0.9375rem', padding: '14px 36px' }}
                        >
                            Start decoding
                            <span style={{ fontSize: '1.1em', transition: 'transform 0.3s', display: 'inline-block' }}>→</span>
                        </button>
                        <p style={{
                            marginTop: 'var(--space-md)',
                            fontSize: '0.6875rem',
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                        }}>
                            3 puzzles remaining
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
