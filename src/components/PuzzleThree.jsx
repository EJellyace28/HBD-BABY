import { useState, useEffect, useRef } from 'react'

const SECRET_CODE = [0, 3, 1, 0]

export default function PuzzleThree({ onComplete }) {
    const [digits, setDigits] = useState([0, 0, 0, 0])
    const [checking, setChecking] = useState(false)
    const [wrong, setWrong] = useState(false)
    const [solved, setSolved] = useState(false)
    const [hintLevel, setHintLevel] = useState(0)
    const [showContent, setShowContent] = useState(false)
    const btnRef = useRef(null)

    useEffect(() => {
        setTimeout(() => setShowContent(true), 200)
    }, [])

    const hints = [
        "Think of a date that's extremely special — one worth celebrating.",
        "It's formatted as MM/DD — try entering those 4 digits.",
        "The month is March... and the day? That's the day you came into this world.",
    ]

    const handleDigitChange = (index, delta) => {
        if (solved || checking) return
        setDigits((prev) => {
            const next = [...prev]
            next[index] = (next[index] + delta + 10) % 10
            return next
        })
    }

    const handleCheck = (e) => {
        // Ripple
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

        setChecking(true)
        setWrong(false)

        const isCorrect = digits.every((d, i) => d === SECRET_CODE[i])

        setTimeout(() => {
            if (isCorrect) {
                setSolved(true)
            } else {
                setWrong(true)
                setTimeout(() => {
                    setChecking(false)
                    setWrong(false)
                }, 700)
            }
        }, 300)
    }

    return (
        <div className="page-container" style={{ paddingTop: '72px' }}>
            {/* Ambient blobs */}
            <div className="glow-blob" style={{
                width: '320px', height: '320px',
                top: '20%', left: '50%',
                transform: 'translateX(-50%)',
                background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)',
            }} />

            <div style={{ textAlign: 'center', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
                <div className="puzzle-header fade-in-up">
                    <span className="tag" style={{
                        background: 'rgba(251,191,36,0.12)',
                        color: '#fbbf24',
                        borderColor: 'rgba(251,191,36,0.2)',
                    }}>Final Puzzle</span>
                    <h2 className="puzzle-title" style={{ marginTop: '12px' }}>The Secret Code</h2>
                    <p className="puzzle-desc">
                        Enter the 4-digit code to unlock the final secret. This one is personal.
                    </p>
                </div>

                {!solved && (
                    <>
                        <div className={`code-lock ${wrong ? 'shake' : ''}`} style={{
                            opacity: showContent ? 1 : 0,
                            transform: showContent ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'opacity 0.6s var(--ease-out) 0.3s, transform 0.6s var(--ease-out) 0.3s',
                        }}>
                            {digits.map((digit, i) => (
                                <div className="code-digit" key={i}
                                    style={{
                                        opacity: showContent ? 1 : 0,
                                        transform: showContent ? 'translateY(0)' : 'translateY(15px)',
                                        transition: `opacity 0.4s ease ${0.3 + i * 0.08}s, transform 0.4s var(--ease-spring) ${0.3 + i * 0.08}s`,
                                    }}
                                >
                                    <button onClick={() => handleDigitChange(i, 1)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
                                    </button>
                                    <div className={`code-value ${solved ? 'correct' : ''}`}>{digit}</div>
                                    <button onClick={() => handleDigitChange(i, -1)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="fade-in-up delay-5" style={{ marginTop: 'var(--space-xl)' }}>
                            <button
                                ref={btnRef}
                                className="btn btn-primary"
                                onClick={handleCheck}
                                disabled={checking}
                                style={{ minWidth: '160px' }}
                            >
                                {checking ? '...' : 'Unlock →'}
                            </button>
                        </div>

                        {/* Hints */}
                        <div style={{ marginTop: 'var(--space-xl)' }}>
                            {hintLevel > 0 && (
                                <div className="slide-in-left" style={{
                                    padding: 'var(--space-md)',
                                    background: 'var(--accent-dim)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--space-md)',
                                    textAlign: 'left',
                                }}>
                                    {hints.slice(0, hintLevel).map((hint, i) => (
                                        <p key={i} style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.8125rem',
                                            lineHeight: 1.6,
                                            marginBottom: i < hintLevel - 1 ? '8px' : 0,
                                        }}>
                                            {hint}
                                        </p>
                                    ))}
                                </div>
                            )}
                            {hintLevel < hints.length && (
                                <p
                                    className="hint-text"
                                    onClick={() => setHintLevel((h) => h + 1)}
                                >
                                    💡 {hintLevel === 0 ? 'Need a hint?' : 'Another hint?'}
                                </p>
                            )}
                        </div>

                        {wrong && (
                            <p className="bounce-in" style={{
                                color: 'var(--error)',
                                marginTop: 'var(--space-md)',
                                fontSize: '0.8125rem',
                                fontFamily: 'var(--font-mono)',
                            }}>
                                Incorrect. Try again.
                            </p>
                        )}
                    </>
                )}

                {solved && (
                    <div className="fragment-reveal">
                        <p className="fragment-label" style={{ color: 'var(--success)' }}>
                            All fragments decoded
                        </p>
                        <p className="fragment-text">
                            "...because you are the most beautiful thing that ever happened to this world."
                        </p>
                        <div className="continue-wrapper">
                            <button
                                className="btn btn-primary btn-glow"
                                onClick={onComplete}
                                style={{ fontSize: '0.9375rem', padding: '14px 36px' }}
                            >
                                Reveal the secret →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
