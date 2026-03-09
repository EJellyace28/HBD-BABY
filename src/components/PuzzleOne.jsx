import { useState, useEffect, useRef } from 'react'

const CARD_IMAGES = [
    '/photos/photo1.png',
    '/photos/photo2.jpg',
    '/photos/photo3.png',
    '/photos/photo4.jpg',
]

function shuffleArray(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

export default function PuzzleOne({ onComplete }) {
    const [cards, setCards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [matched, setMatched] = useState([])
    const [solved, setSolved] = useState(false)
    const [moves, setMoves] = useState(0)
    const [showCards, setShowCards] = useState(false)
    const lockRef = useRef(false)

    useEffect(() => {
        const pairs = [...CARD_IMAGES, ...CARD_IMAGES]
        setCards(shuffleArray(pairs).map((img, i) => ({ id: i, img })))
        setTimeout(() => setShowCards(true), 300)
    }, [])

    const handleFlip = (index) => {
        if (lockRef.current) return
        if (flipped.includes(index) || matched.includes(index)) return

        const newFlipped = [...flipped, index]
        setFlipped(newFlipped)

        if (newFlipped.length === 2) {
            lockRef.current = true
            setMoves((m) => m + 1)

            const [first, second] = newFlipped
            if (cards[first].img === cards[second].img) {
                const newMatched = [...matched, first, second]
                setMatched(newMatched)
                setFlipped([])
                lockRef.current = false

                if (newMatched.length === cards.length) {
                    setTimeout(() => setSolved(true), 700)
                }
            } else {
                setTimeout(() => {
                    setFlipped([])
                    lockRef.current = false
                }, 900)
            }
        }
    }

    return (
        <div className="page-container" style={{ paddingTop: '72px' }}>
            {/* Ambient blobs */}
            <div className="glow-blob" style={{
                width: '250px', height: '250px',
                top: '30%', right: '5%',
                background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
            }} />

            <div style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 1 }}>
                <div className="puzzle-header fade-in-up">
                    <span className="tag">Puzzle 01</span>
                    <h2 className="puzzle-title" style={{ marginTop: '12px' }}>Memory Match</h2>
                    <p className="puzzle-desc">
                        Find all matching pairs to unlock the first fragment.
                    </p>
                    <p style={{
                        marginTop: '8px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.05em',
                    }}>
                        MOVES: {moves} • PAIRS: {matched.length / 2}/{CARD_IMAGES.length}
                    </p>
                </div>

                <div className="memory-grid">
                    {cards.map((card, i) => (
                        <div
                            key={card.id}
                            className={`memory-card ${flipped.includes(i) ? 'flipped' : ''
                                } ${matched.includes(i) ? 'matched' : ''}`}
                            onClick={() => handleFlip(i)}
                            style={{
                                opacity: showCards ? 1 : 0,
                                transform: showCards ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                                transition: `opacity 0.4s ease ${i * 0.06}s, transform 0.4s var(--ease-spring) ${i * 0.06}s`,
                            }}
                        >
                            <div className="memory-card-inner">
                                <div className="memory-card-face memory-card-front" />
                                <div className="memory-card-face memory-card-back">
                                    <img src={card.img} alt="memory card" draggable={false} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {solved && (
                    <div className="fragment-reveal">
                        <p className="fragment-label">Fragment 01 — decoded</p>
                        <p className="fragment-text">
                            "Every moment with you feels like a gift that keeps on giving..."
                        </p>
                        <div className="continue-wrapper">
                            <button className="btn btn-primary" onClick={onComplete}>
                                Next puzzle →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
