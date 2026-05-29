import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BrandLoader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const duration = 1600; // 1.6 seconds total
        const intervalTime = 15;
        const steps = duration / intervalTime;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const nextProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
            setProgress(nextProgress);

            if (nextProgress >= 100) {
                clearInterval(timer);
                setTimeout(() => {
                    setIsVisible(false);
                    setTimeout(() => {
                        onComplete();
                    }, 500);
                }, 300);
            }
        }, intervalTime);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: '#020617',
                        zIndex: 99999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Pulsing SVG Logo */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Outer dashed ring rotating */}
                            <circle cx="32" cy="32" r="28" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4">
                                <animateTransform 
                                    attributeName="transform" 
                                    type="rotate" 
                                    from="0 32 32" 
                                    to="360 32 32" 
                                    dur="12s" 
                                    repeatCount="indefinite" 
                                />
                            </circle>
                            {/* Middle static ring */}
                            <circle cx="32" cy="32" r="20" stroke="#8b5cf6" strokeWidth="2" opacity="0.6" />
                            {/* Center pulsing bubble */}
                            <circle cx="32" cy="32" r="8" fill="#8b5cf6">
                                <animate 
                                    attributeName="r" 
                                    values="6;9;6" 
                                    dur="2s" 
                                    repeatCount="indefinite" 
                                />
                            </circle>
                            {/* Top accent dot */}
                            <circle cx="32" cy="4" r="3.5" fill="#f97316" />
                        </svg>
                    </div>

                    {/* Brand Name */}
                    <h1 style={{
                        fontFamily: 'Outfit',
                        fontWeight: 300,
                        fontSize: '1.75rem',
                        letterSpacing: '10px',
                        color: 'white',
                        margin: '0 0 0.5rem 0',
                        textTransform: 'uppercase'
                    }}>
                        MINDEASE
                    </h1>
                    
                    {/* Subtitle */}
                    <p style={{
                        fontFamily: 'Outfit',
                        fontWeight: 800,
                        fontSize: '0.65rem',
                        letterSpacing: '3px',
                        color: '#64748b',
                        margin: '0',
                        textTransform: 'uppercase'
                    }}>
                        NEURAL WELLNESS PORTAL
                    </p>

                    {/* Progress Bar Container */}
                    <div style={{
                        width: '240px',
                        height: '2px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        margin: '3rem 0 1rem 0',
                        position: 'relative',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        {/* Progress Bar Active state */}
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #8b5cf6, #f97316)',
                            transition: 'width 0.05s ease-out'
                        }} />
                    </div>

                    {/* Progress Percentage Counter */}
                    <div style={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#8b5cf6',
                        letterSpacing: '2px'
                    }}>
                        {progress}%
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BrandLoader;
