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

                .back-link {
                    position: absolute; top: 4rem; left: 4vw;
                    color: #64748b; text-decoration: none; font-weight: 800;
                    font-size: 0.75rem; letter-spacing: 3px; display: flex; align-items: center; gap: 1rem;
                    transition: 0.3s; z-index: 10;
                }
                .back-link:hover { color: white; transform: translateX(-5px); }

                .pulse-orb {
                    width: 300px; height: 300px;
                    border-radius: 50%;
                    background: radial-gradient(circle, var(--pulse-color) 0%, transparent 70%);
                    display: flex; align-items: center; justify-content: center;
                    position: relative;
                    transition: all 4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .inner-orb {
                    width: 150px; height: 150px;
                    border-radius: 50%;
                    background: white;
                    box-shadow: 0 0 50px var(--pulse-color);
                }

                .instruction-text {
                    font-family: 'Playfair Display', serif;
                    font-size: 5rem;
                    margin: 4rem 0 1rem;
                    height: 6rem;
                }

                .timer-text {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #64748b;
                    letter-spacing: 5px;
                }

                .controls {
                    margin-top: 6rem;
                    display: flex;
                    gap: 3rem;
                    align-items: center;
                }

                .play-btn {
                    width: 80px; height: 80px;
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
                }
            `}</style>

            <div className="neural-lines" />

            <Link to="/dashboard" className="back-link">
                <ArrowLeft size={16} /> EXIT NEURAL SYNC
            </Link>

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

            <div style={{ marginTop: '4rem', color: '#1e293b', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '4px' }}>
                4 SEC INHALE • 7 SEC HOLD • 8 SEC EXHALE
            </div>
        </div>
    );
};

export default NeuralPulse;
