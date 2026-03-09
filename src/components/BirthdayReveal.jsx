import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

const PHOTOS = [
    '/photos/photo1.png',
    '/photos/photo2.jpg',
    '/photos/photo3.png',
    '/photos/photo4.jpg',
]

const HeartSVG = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="var(--accent)" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-light)' }}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
)

const SparkleSVG = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-light)' }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" />
    </svg>
)

export default function BirthdayReveal() {
    // 0 = Dark overlay fading
    // 1 = Envelope on screen
    // 2 = Envelope opening / exploding confetti
    // 3 = Message + photos visible
    const [phase, setPhase] = useState(0)
    const [heartsVisible, setHeartsVisible] = useState(false)
    const confettiFired = useRef(false)
    const btnRef = useRef(null)

    useEffect(() => {
        // Fade out overlay and slide in the envelope
        const introTimer = setTimeout(() => setPhase(1), 1600)
        return () => clearTimeout(introTimer)
    }, [])

    const handleOpenEnvelope = (e) => {
        if (phase !== 1) return;

        // Button ripple on the envelope
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

        setPhase(2)

        // Wait for envelope to slide down before showing content
        setTimeout(() => {
            setPhase(3)
            setHeartsVisible(true)
        }, 1200)
    }

    // Handle Confetti when phase switches to 2
    useEffect(() => {
        if (phase === 2 && !confettiFired.current) {
            confettiFired.current = true
            const end = Date.now() + 5000

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 60,
                    origin: { x: 0, y: 0.6 },
                    colors: ['#ec4899', '#f472b6', '#fda4af', '#fbbf24', '#ffffff'],
                })
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 60,
                    origin: { x: 1, y: 0.6 },
                    colors: ['#ec4899', '#f472b6', '#fda4af', '#fbbf24', '#ffffff'],
                })
                if (Date.now() < end) requestAnimationFrame(frame)
            }

            // Big initial burst directly from the envelope
            confetti({
                particleCount: 150,
                spread: 140,
                origin: { x: 0.5, y: 0.6 },
                colors: ['#ec4899', '#f472b6', '#fda4af', '#fbbf24', '#ffffff'],
                startVelocity: 55,
            })

            // Secondary burst
            setTimeout(() => {
                confetti({
                    particleCount: 80,
                    spread: 100,
                    origin: { x: 0.3, y: 0.5 },
                    colors: ['#ec4899', '#f472b6', '#ffffff'],
                })
                confetti({
                    particleCount: 80,
                    spread: 100,
                    origin: { x: 0.7, y: 0.5 },
                    colors: ['#ec4899', '#f472b6', '#ffffff'],
                })
            }, 500)

            frame()
        }
    }, [phase])

    const hearts = Array.from({ length: 22 }, (_, i) => ({
        id: i,
        Icon: [HeartSVG, SparkleSVG][i % 2],
        left: Math.random() * 100,
        duration: Math.random() * 7 + 5,
        delay: Math.random() * 12,
        size: Math.random() * 1.3 + 0.7,
    }))

    return (
        <div className="page-container celebration-bg" style={{
            background: phase >= 2
                ? 'radial-gradient(ellipse at 50% 25%, #2a0a20 0%, #1a0515 45%, #0c0810 100%)'
                : '#000',
            transition: 'background 2s var(--ease-out)',
            paddingTop: '40px',
            paddingBottom: '80px',
        }}>
            {phase === 0 && <div className="dark-overlay" />}

            {heartsVisible && (
                <div className="floating-hearts">
                    {hearts.map((h) => (
                        <div
                            key={h.id}
                            className="floating-heart"
                            style={{
                                left: `${h.left}%`,
                                animationDuration: `${h.duration}s`,
                                animationDelay: `${h.delay}s`,
                                fontSize: `${h.size}rem`,
                            }}
                        >
                            {<h.Icon />}
                        </div>
                    ))}
                </div>
            )}

            {/* Ambient glow blobs */}
            {phase >= 1 && (
                <>
                    <div className="glow-blob" style={{
                        width: '400px', height: '400px',
                        top: '10%', left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 60%)',
                    }} />
                    <div className="glow-blob" style={{
                        width: '200px', height: '200px',
                        bottom: '20%', left: '20%',
                        background: 'radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%)',
                        animationDelay: '2s',
                    }} />
                </>
            )}

            {/* Interactive Envelope */}
            {phase >= 1 && phase < 3 && (
                <div className="fade-in-up" style={{ zIndex: 100, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', transition: 'all 0.8s var(--ease-out)' }}>
                    <div className="bounce-in delay-2" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                        <span className="tag" style={{
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            borderColor: 'var(--border)',
                            fontSize: '0.75rem',
                            padding: '6px 18px',
                            fontFamily: 'var(--font-cursive)',
                            textTransform: 'none',
                            letterSpacing: '1px'
                        }}>
                            For you...
                        </span>
                    </div>

                    <div
                        ref={btnRef}
                        className={`envelope-container ${phase === 2 ? 'opened' : ''} btn`}
                        onClick={handleOpenEnvelope}
                        style={{ padding: 0, borderRadius: '4px', overflow: 'visible', width: '280px', height: '180px' }}
                    >
                        <div className="envelope-flap"></div>
                        <div className="envelope-body">
                            <div className="envelope-wax">
                                <HeartSVG style={{ color: 'white', width: '18px', height: '18px' }} />
                            </div>
                        </div>
                        <div className="envelope-letter"></div>
                    </div>

                    {phase === 1 && (
                        <p className="fade-in delay-5" style={{ textAlign: 'center', marginTop: 'var(--space-lg)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Tap to open
                        </p>
                    )}
                </div>
            )}

            {/* Final Revealed Content */}
            {phase === 3 && (
                <div className="reveal-container">
                    {/* Tag */}
                    <div className="bounce-in">
                        <span className="tag" style={{
                            background: 'rgba(236, 72, 153, 0.15)',
                            color: '#f472b6',
                            borderColor: 'rgba(236, 72, 153, 0.25)',
                            fontSize: '0.75rem',
                            padding: '6px 18px',
                        }}>
                            ✦ Surprise ✦
                        </span>
                    </div>

                    {/* Main title */}
                    <h1 className="fade-in-up delay-1" style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: 'clamp(2.2rem, 8vw, 4.5rem)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.05,
                        marginTop: 'var(--space-lg)',
                        marginBottom: 'var(--space-sm)',
                    }}>
                        <span className="text-gold-gradient">Happy Birthday!</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="fade-in-up delay-2" style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.875rem, 2vw, 1.05rem)',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-xl)',
                    }}>
                        This was never just a game — it was always about you.
                    </p>

                    {/* Photo gallery with animations */}
                    <div className="photo-gallery">
                        {PHOTOS.map((src, i) => (
                            <div key={i} className={`photo-item photo-float-${i + 1}`}>
                                <img src={src} alt={`us ${i + 1}`} draggable={false} />
                            </div>
                        ))}
                    </div>

                    {/* Message card */}
                    <div className="fade-in-up delay-4" style={{
                        background: 'rgba(236, 72, 153, 0.04)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(236, 72, 153, 0.12)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-2xl)',
                        maxWidth: '480px',
                        margin: 'var(--space-xl) auto 0',
                        textAlign: 'left',
                        position: 'relative'
                    }}>
                        {/* Little decorative tape corners */}
                        <div style={{ position: 'absolute', top: '-10px', left: '20px', width: '40px', height: '12px', background: 'rgba(255,255,255,0.1)', transform: 'rotate(-5deg)', backdropFilter: 'blur(4px)' }} />
                        <div style={{ position: 'absolute', top: '-10px', right: '20px', width: '40px', height: '12px', background: 'rgba(255,255,255,0.1)', transform: 'rotate(5deg)', backdropFilter: 'blur(4px)' }} />

                        <p className="fade-in-up delay-5" style={{
                            fontSize: '0.9375rem',
                            color: 'rgba(253,242,248,0.85)',
                            lineHeight: 1.85,
                            marginBottom: 'var(--space-lg)',
                        }}>
                            Hi Baabyy ko!!!! Happy 22nd Birthdayyy hayss bilis ng panahon dati teens palang us tas now parehas na tayong 22. HHAHAHAH tanda na natin hehehehe joke lang. As your poging Boyfriend want ko lang sana malaman mo na im so PROUD OF YOU!! sa dinami dami nating pinag daanan together eh nanatili ka pading matatag.
                        </p>
                        <p className="fade-in-up delay-6" style={{
                            fontSize: '0.9375rem',
                            color: 'rgba(253,242,248,0.85)',
                            lineHeight: 1.85,
                            marginBottom: 'var(--space-lg)',
                        }}>
                            Sa lahat ng nangayayri sating dalawa nandiyan ka padin for me kaya sobrang proud ako sayoo!! kung wala ka for sure wlaa ako ngyaon, Hindi ako yung taong may Emotional intelligence na iniisp lang kundi yung sarili nya.
                            Mahal na mahal kita baby sana kung ano man tayo ngayon eh ganyan padin tayo hanggang sa pag dating ng panahon na bu,uo us ng sarili nating Family.
                            Mahal na mahal kita baby SUPPEER LOVE NA LOVEE KITAAA.
                        </p>
                        <p className="fade-in-up delay-7" style={{
                            fontSize: '0.9375rem',
                            color: 'rgba(253,242,248,0.85)',
                            lineHeight: 1.85,
                        }}>
                            Alam kong nag kulang ako sayo lately pero i know sa sarili ko na hindi na mauulit yun, Dahil ayong mawala ka sakin at mahal na mahal kita. Naiiyak tuloy ako parang ewan naman toh HAHAHAH I lovee youuuuu HAPPY BIRTHDAYY ULIT BABYYYYY, SANA MAGUSTUHAN MO itong gawa ko para sayo kasi hindi ako artistic na tao pero kaya ko naamn iexpress yung pag mamahal ko sa ibang way magagawa ko din yung want mo wait mo lang.
                        </p>
                        <p className="fade-in-up delay-8" style={{
                            fontFamily: 'var(--font-cursive)',
                            fontSize: '2rem',
                            color: 'var(--accent-light)',
                            marginTop: 'var(--space-xl)',
                            textAlign: 'right',
                            paddingRight: 'var(--space-md)'
                        }}>
                            I LOVE YOUUUUUUU <HeartSVG />
                        </p>
                    </div>

                    {/* Bottom emojis */}
                    <div className="fade-in delay-9" style={{
                        marginTop: 'var(--space-2xl)',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
                    }}>
                        {[0, 1, 2, 3, 4].map((i) => {
                            const Icon = i % 2 === 0 ? HeartSVG : SparkleSVG;
                            return (
                                <span key={i} className="float" style={{
                                    fontSize: '1.5rem',
                                    animationDelay: `${i * 0.5}s`,
                                    opacity: 0,
                                    animation: `fadeInScale 0.4s var(--ease-spring) ${1.5 + i * 0.12}s forwards, float 3s ease-in-out ${2 + i * 0.4}s infinite`,
                                }}>
                                    <Icon />
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
