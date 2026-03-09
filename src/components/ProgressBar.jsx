export default function ProgressBar({ currentStep, totalSteps = 3 }) {
    const labels = ['Memory', 'Cipher', 'Code']

    return (
        <div className="progress-container">
            <span className="progress-label">Progress</span>
            {Array.from({ length: totalSteps }, (_, i) => (
                <div
                    key={i}
                    className={`progress-step ${i < currentStep ? 'completed' : i === currentStep ? 'active' : ''
                        }`}
                    title={labels[i]}
                />
            ))}
            <span className="progress-label">{currentStep}/{totalSteps}</span>
        </div>
    )
}
