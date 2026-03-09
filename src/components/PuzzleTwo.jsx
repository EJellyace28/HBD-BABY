import { useState, useEffect } from 'react'

const WORDS = [
    { word: 'PINK', hint: 'Fave mo na color' },
    { word: 'EUPHROSYNE', hint: 'Name ng Baby natin' },
    { word: 'MATCHA', hint: 'Fave mo yannnn' },
]

function shuffleWord(word) {
    const arr = word.split('')
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    if (arr.join('') === word) {
        ;[arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]]
    }
    return arr
}

export default function PuzzleTwo({ onComplete }) {
    const [currentWord, setCurrentWord] = useState(0)
    const [scrambledLetters, setScrambledLetters] = useState([])
    const [selectedIndices, setSelectedIndices] = useState([])
    const [solved, setSolved] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [isWrong, setIsWrong] = useState(false)
    const [wordsCompleted, setWordsCompleted] = useState(0)
    const [showLetters, setShowLetters] = useState(false)

    const target = WORDS[currentWord]

    useEffect(() => {
        setShowLetters(false)
        const letters = shuffleWord(target.word).map((l, i) => ({ letter: l, id: `${currentWord}-${i}` }))
        setScrambledLetters(letters)
        setSelectedIndices([])
        setShowHint(false)
        setIsCorrect(false)
        setTimeout(() => setShowLetters(true), 200)
    }, [currentWord])

    const handleLetterClick = (index) => {
        if (isCorrect) return

        if (selectedIndices.includes(index)) {
            setSelectedIndices(selectedIndices.filter((i) => i !== index))
            return
        }

        const newSelected = [...selectedIndices, index]
        setSelectedIndices(newSelected)

        if (newSelected.length === target.word.length) {
            const attempt = newSelected.map((i) => scrambledLetters[i].letter).join('')
            if (attempt === target.word) {
                setIsCorrect(true)
                const completed = wordsCompleted + 1
                setWordsCompleted(completed)

                setTimeout(() => {
                    if (completed >= WORDS.length) {
                        setSolved(true)
                    } else {
                        setCurrentWord((c) => c + 1)
                    }
                }, 1400)
            } else {
                setIsWrong(true)
                setTimeout(() => {
                    setSelectedIndices([])
                    setIsWrong(false)
                }, 600)
            }
        }
    }

    const currentAttempt = selectedIndices.map((i) => scrambledLetters[i].letter)

    // Progress dots
    const progressDots = WORDS.map((_, i) => {
        if (i < wordsCompleted) return 'completed'
        if (i === currentWord && !solved) return 'active'
        return 'pending'
    })

    return (
        <div className="page-container" style={{ paddingTop: '72px' }}>
            {/* Ambient blobs */}
            <div className="glow-blob" style={{
                width: '280px', height: '280px',
                top: '25%', left: '5%',
                background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
            }} />

            <div className="scramble-container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="puzzle-header fade-in-up">
                    <span className="tag">Puzzle 02</span>
                    <h2 className="puzzle-title" style={{ marginTop: '12px' }}>Word Cipher</h2>
                    <p className="puzzle-desc">
                        Unscramble the hidden words. Tap letters in the correct order.
                    </p>

                    {/* Progress dots */}
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center',
                        marginTop: '16px',
                    }}>
                        {progressDots.map((status, i) => (
                            <div key={i} style={{
                                width: status === 'active' ? '24px' : '8px',
                                height: '8px',
                                borderRadius: 'var(--radius-full)',
                                background: status === 'completed'
                                    ? 'var(--success)'
                                    : status === 'active'
                                        ? 'var(--accent)'
                                        : 'var(--border)',
                                transition: 'all 0.4s var(--ease-out)',
                                boxShadow: status === 'active' ? '0 0 8px var(--accent-glow)' : 'none',
                            }} />
                        ))}
                    </div>
                </div>

                {!solved && (
                    <>
                        {/* Answer slots */}
                        <div className={`letter-slots ${isWrong ? 'shake' : ''}`}>
                            {target.word.split('').map((_, i) => (
                                <div
                                    key={`slot-${currentWord}-${i}`}
                                    className={`letter-slot ${currentAttempt[i] ? 'filled' : ''
                                        } ${isCorrect ? 'correct' : ''}`}
                                    style={{
                                        animationDelay: isCorrect ? `${i * 0.05}s` : undefined,
                                    }}
                                >
                                    {currentAttempt[i] || ''}
                                </div>
                            ))}
                        </div>

                        {/* Available letters */}
                        <div className="available-letters">
                            {scrambledLetters.map((item, i) => (
                                <div
                                    key={item.id}
                                    className={`letter-tile ${selectedIndices.includes(i) ? 'used' : ''}`}
                                    onClick={() => handleLetterClick(i)}
                                    style={{
                                        opacity: showLetters ? 1 : 0,
                                        transform: showLetters
                                            ? 'translateY(0) scale(1)'
                                            : 'translateY(15px) scale(0.85)',
                                        transition: `opacity 0.3s ease ${i * 0.04}s, transform 0.3s var(--ease-spring) ${i * 0.04}s`,
                                    }}
                                >
                                    {item.letter}
                                </div>
                            ))}
                        </div>

                        {/* Hint */}
                        <p
                            className="hint-text"
                            onClick={() => setShowHint(true)}
                            style={{ cursor: showHint ? 'default' : 'pointer' }}
                        >
                            {showHint ? `💡 ${target.hint}` : '💡 Need a hint?'}
                        </p>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            {selectedIndices.length > 0 && !isCorrect && (
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setSelectedIndices([])}
                                    style={{ padding: '8px 20px', fontSize: '0.8125rem' }}
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {isCorrect && (
                            <div className="bounce-in" style={{
                                marginTop: 'var(--space-md)',
                                color: 'var(--success)',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                            }}>
                                ✓ Correct!
                            </div>
                        )}
                    </>
                )}

                {solved && (
                    <div className="fragment-reveal">
                        <p className="fragment-label">Fragment 02 — decoded</p>
                        <p className="fragment-text">
                            "...and today, the universe celebrates the day you were born..."
                        </p>
                        <div className="continue-wrapper">
                            <button className="btn btn-primary" onClick={onComplete}>
                                Final puzzle →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
