import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Volume2, VolumeX, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const NeuralPulse = () => {
    const [phase, setPhase] = useState('Inhale');
    const [seconds, setSeconds] = useState(4);
    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Neural Audio Synthesis (Procedural Breathing)
    const playNeuralWhoosh = (type) => {
        if (isMuted) return;
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const noise = ctx.createBufferSource();
        const bufferSize = ctx.sampleRate * 8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);

        if (type === 'Inhale') {
            filter.frequency.setValueAtTime(100, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 4);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 4);
        } else if (type === 'Exhale') {
            filter.frequency.setValueAtTime(2000, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 8);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 8);
        }

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        setTimeout(() => ctx.close(), 9000);
    };

    // Voice & Whoosh Guidance Trigger
    useEffect(() => {
        if (isActive) {
            playNeuralWhoosh(phase);
            if (!isMuted) {
                const utterance = new SpeechSynthesisUtterance(phase);
                utterance.rate = 1.2;
                window.speechSynthesis.speak(utterance);
            }
        }
    }, [phase, isActive, isMuted]);

    // 4-7-8 Timer Logic
    useEffect(() => {
        let interval = null;
        if (isActive) {
            if (seconds > 0) {
                interval = setInterval(() => {
                    setSeconds(seconds - 1);
                }, 1000);
            } else if (seconds === 0) {
                if (phase === 'Inhale') {
                    setPhase('Hold');
                    setSeconds(7);
                } else if (phase === 'Hold') {
                    setPhase('Exhale');
                    setSeconds(8);
                } else {
                    setPhase('Inhale');
                    setSeconds(4);
                }
            }
        } else {
            clearInterval(interval);
            window.speechSynthesis.cancel();
        }
        return () => {
            clearInterval(interval);
        };
    }, [isActive, seconds]);

    const getCircleScale = () => {
        if (!isActive) return 1;
        if (phase === 'Inhale') return 1.5;
        if (phase === 'Hold') return 1.5;
        return 1;
    };

    const getPulseColor = () => {
        if (phase === 'Inhale') return '#8b5cf6';
        if (phase === 'Hold') return '#3b82f6';
        return '#10b981';
    };

    // Concentric ripple configuration generator
    const getRippleVariants = (delay) => ({
        Inhale: {
            scale: [1, 2.4],
            opacity: [0.5, 0],
            transition: {
                duration: 4,
                ease: "easeOut",
                repeat: Infinity,
                delay
            }
        },
        Hold: {
            scale: [2.2, 2.3, 2.2],
            opacity: [0.15, 0.25, 0.15],
            transition: {
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                delay
            }
        },
        Exhale: {
            scale: [2.2, 3.6],
            opacity: [0.4, 0],
            transition: {
                duration: 8,
                ease: "easeOut",
                repeat: Infinity,
                delay
            }
        }
    });

    return (
        <div className="pulse-container">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap');
                
                .pulse-container {
                    min-height: 100vh;
                    background: #020617;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Outfit', sans-serif;
                    overflow: hidden;
                    position: relative;
                }

                .bg-layer {
                    position: absolute; inset: 0;
                    opacity: 0;
                    transition: opacity 3s ease-in-out;
                    z-index: 0;
                    pointer-events: none;
                }
                .bg-layer.active {
                    opacity: 0.45;
                }
                .bg-idle { background: radial-gradient(circle at center, #0f172a 0%, #020617 100%); }
                .bg-inhale { background: radial-gradient(circle at center, #2e1065 0%, #020617 100%); }
                .bg-hold { background: radial-gradient(circle at center, #0c4a6e 0%, #020617 100%); }
                .bg-exhale { background: radial-gradient(circle at center, #022c22 0%, #020617 100%); }

                .back-link {
                    position: absolute; top: 4rem; left: 4vw;
                    color: #64748b; text-decoration: none; font-weight: 800;
                    font-size: 0.75rem; letter-spacing: 3px; display: flex; align-items: center; gap: 1rem;
                    transition: 0.3s; z-index: 10;
                }
                .back-link:hover { color: white; transform: translateX(-5px); }

                .orb-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 6rem; /* Shifted downwards */
                    margin-bottom: 2rem;
                    z-index: 5;
                }

                .pulse-orb {
                    width: min(260px, 50vw); height: min(260px, 50vw);
                    border-radius: 50%;
                    background: radial-gradient(circle, var(--pulse-color) 0%, transparent 70%);
                    display: flex; align-items: center; justify-content: center;
                    position: relative;
                    transition: all 4s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 6;
                }

                .inner-orb {
                    width: min(130px, 25vw); height: min(130px, 25vw);
                    border-radius: 50%;
                    background: white;
                    box-shadow: 0 0 50px var(--pulse-color);
                    z-index: 7;
                }

                .ripple-ring {
                    position: absolute;
                    width: min(260px, 50vw);
                    height: min(260px, 50vw);
                    border-radius: 50%;
                    border: 1px solid var(--pulse-color);
                    box-shadow: 0 0 20px var(--pulse-color);
                    pointer-events: none;
                    opacity: 0;
                    z-index: 3;
                }

                .instruction-text {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(3rem, 7vh, 5rem);
                    margin: 1.5rem 0 0.5rem;
                    height: 5.5rem;
                    z-index: 5;
                }

                .timer-text {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #64748b;
                    letter-spacing: 5px;
                    z-index: 5;
                }

                .controls {
                    margin-top: 3.5rem;
                    display: flex;
                    gap: 3rem;
                    align-items: center;
                    z-index: 5;
                }

                .play-btn {
                    width: 70px; height: 70px;
                    border-radius: 50%;
                    background: white;
                    color: black;
                    border: none;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: 0.4s;
                }
                .play-btn:hover { transform: scale(1.1); }

                .neural-lines {
                    position: absolute; inset: 0;
                    background: url('/grid.png') repeat;
                    opacity: 0.05; pointer-events: none;
                    z-index: 1;
                }
            `}</style>

            {/* Premium background transition layers */}
            <div className={`bg-layer bg-idle ${!isActive ? 'active' : ''}`} />
            <div className={`bg-layer bg-inhale ${isActive && phase === 'Inhale' ? 'active' : ''}`} />
            <div className={`bg-layer bg-hold ${isActive && phase === 'Hold' ? 'active' : ''}`} />
            <div className={`bg-layer bg-exhale ${isActive && phase === 'Exhale' ? 'active' : ''}`} />

            <div className="neural-lines" />

            <Link to="/dashboard" className="back-link">
                <ArrowLeft size={16} /> EXIT NEURAL SYNC
            </Link>

            <div className="orb-wrapper">
                {/* Concentric expanding ripples */}
                {isActive && (
                    <>
                        <motion.div 
                            className="ripple-ring"
                            variants={getRippleVariants(0)}
                            animate={phase}
                            style={{ '--pulse-color': getPulseColor() }}
                        />
                        <motion.div 
                            className="ripple-ring"
                            variants={getRippleVariants(1.3)}
                            animate={phase}
                            style={{ '--pulse-color': getPulseColor() }}
                        />
                        <motion.div 
                            className="ripple-ring"
                            variants={getRippleVariants(2.6)}
                            animate={phase}
                            style={{ '--pulse-color': getPulseColor() }}
                        />
                    </>
                )}

                <motion.div 
                    className="pulse-orb"
                    animate={{ scale: getCircleScale() }}
                    transition={{ duration: phase === 'Inhale' ? 4 : (phase === 'Hold' ? 7 : 8), ease: "easeInOut" }}
                    style={{ '--pulse-color': getPulseColor() }}
                >
                    <motion.div 
                        className="inner-orb"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                </motion.div>
            </div>

            <h1 className="instruction-text">{isActive ? phase : 'Ready?'}</h1>
            <div className="timer-text">{isActive ? `${seconds}s` : 'INITIALIZE PULSE'}</div>

            <div className="controls">
                <button onClick={() => setIsMuted(!isMuted)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                
                <button className="play-btn" onClick={() => setIsActive(!isActive)}>
                    {isActive ? <RefreshCw size={32} /> : <Wind size={32} />}
                </button>

                <div style={{ width: '24px' }} />
            </div>

            <div style={{ marginTop: '2.5rem', color: '#64748b', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '4px', zIndex: 5 }}>
                4 SEC INHALE • 7 SEC HOLD • 8 SEC EXHALE
            </div>
        </div>
    );
};

export default NeuralPulse;
