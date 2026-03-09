import { useState, useEffect, useRef } from 'react'

export default function TypewriterText({ text, speed = 50, delay = 0, onComplete, className = '' }) {
    const [displayed, setDisplayed] = useState('')
    const [started, setStarted] = useState(false)
    const [done, setDone] = useState(false)
    const indexRef = useRef(0)

    useEffect(() => {
        const startTimer = setTimeout(() => setStarted(true), delay)
        return () => clearTimeout(startTimer)
    }, [delay])

    useEffect(() => {
        if (!started) return

        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                indexRef.current++
                setDisplayed(text.slice(0, indexRef.current))
            } else {
                clearInterval(interval)
                setDone(true)
                onComplete?.()
            }
        }, speed)

        return () => clearInterval(interval)
    }, [started, text, speed, onComplete])

    return (
        <span className={className}>
            {displayed}
            {!done && started && <span className="typewriter-cursor" />}
        </span>
    )
}
