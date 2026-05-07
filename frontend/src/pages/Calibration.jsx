import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Zap, Shield, Target, Brain, Waves, Activity, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Calibration = () => {
    const [step, setStep] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();
    
    const questions = [
        {
            id: 'energy',
            title: 'Neural Energy',
            question: 'How would you describe your current cognitive drive?',
            options: [
                { label: 'HIGH VIBRATION', desc: 'Alert, focused, ready for complexity.', value: 90 },
                { label: 'STEADY RESONANCE', desc: 'Functional, balanced, stable.', value: 70 },
                { label: 'LOW FREQUENCY', desc: 'Foggy, requiring recalibration.', value: 40 }
            ],
            icon: <Zap size={32} />
        },
        {
            id: 'stability',
            title: 'Emotional Baseline',
            question: 'How resilient has your emotional state been lately?',
            options: [
                { label: 'IRONCLAD', desc: 'Unshakable focus and calm.', value: 95 },
                { label: 'FLUID', desc: 'Responsive to environment.', value: 65 },
                { label: 'VOLATILE', desc: 'Frequent shifts in resonance.', value: 30 }
            ],
            icon: <Shield size={32} />
        },
        {
            id: 'sleep',
            title: 'Restorative Cycle',
            question: 'Rate the quality of your recent sleep cycles.',
            options: [
                { label: 'DEEP REM', desc: 'Waking up fully restored.', value: 90 },
                { label: 'INTERRUPTED', desc: 'Sleep is light or inconsistent.', value: 55 },
                { label: 'DEPLETED', desc: 'Chronic lack of restorative rest.', value: 25 }
            ],
            icon: <Waves size={32} />
        },
        {
            id: 'social',
            title: 'Social Battery',
            question: 'How does social interaction affect your energy?',
            options: [
                { label: 'AMPLIFIED', desc: 'Connection fuels my resonance.', value: 85 },
                { label: 'NEUTRAL', desc: 'I balance solitude and connection.', value: 60 },
                { label: 'DRAINING', desc: 'Currently requiring isolation.', value: 30 }
            ],
            icon: <Brain size={32} />
        },
        {
            id: 'vitality',
            title: 'Physical Resonance',
            question: 'How connected do you feel to your physical body?',
            options: [
                { label: 'SYNCHRONIZED', desc: 'Vitality is high and stable.', value: 90 },
                { label: 'MODERATE', desc: 'Occasional fatigue or tension.', value: 60 },
                { label: 'DISCORDANT', desc: 'Feeling physically disconnected.', value: 25 }
            ],
            icon: <Activity size={32} />
        },
        {
            id: 'pressure',
            title: 'Environmental Load',
            question: 'Rate the current weight of external responsibilities.',
            options: [
                { label: 'WEIGHTLESS', desc: 'Managing tasks with ease.', value: 95 },
                { label: 'HEAVY', desc: 'Managing, but feeling the load.', value: 50 },
                { label: 'CRITICAL', desc: 'Overwhelmed by external pressure.', value: 15 }
            ],
            icon: <Target size={32} />
        },
        {
            id: 'creativity',
            title: 'Creative Output',
            question: 'How vibrant is your "Inner Vision" right now?',
            options: [
                { label: 'LUCID', desc: 'Ideas are flowing effortlessly.', value: 90 },
                { label: 'STAGNANT', desc: 'Waiting for a creative wave.', value: 50 },
                { label: 'BLOCKED', desc: 'Vision feels foggy or absent.', value: 20 }
            ],
            icon: <Sparkles size={32} />
        },
        {
            id: 'outlook',
            title: 'Future Frequency',
            question: 'How optimistic is your current trajectory?',
            options: [
                { label: 'EXPANSIVE', desc: 'Seeing massive potential ahead.', value: 95 },
                { label: 'LINEAR', desc: 'Moving forward steadily.', value: 65 },
                { label: 'UNCERTAIN', desc: 'Frequency feels cautious.', value: 35 }
            ],
            icon: <TrendingUp size={32} />
        }
    ];

    const { updateBaselines } = useAuth();
    const [answers, setAnswers] = useState([]);

    const handleNext = (value) => {
        const newAnswers = [...answers, value];
        setAnswers(newAnswers);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setIsAnalyzing(true);
            
            // Calculate Baseline Results
            const avgEnergy = Math.round(newAnswers.reduce((a, b) => a + b, 0) / newAnswers.length);
            const stabilityLabel = avgEnergy > 80 ? 'Optimal' : avgEnergy > 50 ? 'Stable' : 'Volatile';
            
            setTimeout(async () => {
                try {
                    const token = JSON.parse(localStorage.getItem('user'))?.token;
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    
                    // Beam data to the Master Database
                    await axios.post(`${import.meta.env.VITE_API_URL}/moods`, {
                        mood: stabilityLabel.toUpperCase() === 'OPTIMAL' ? 'HAPPY' : (stabilityLabel.toUpperCase() === 'STABLE' ? 'NEUTRAL' : 'STRESS'),
                        note: `Neural Calibration Complete: ${avgEnergy}% Energy detected.`,
                        intensity: Math.round(avgEnergy / 10)
                    }, config);

                    updateBaselines({
                        energy: avgEnergy,
                        stability: stabilityLabel,
                        resonance: Math.round(avgEnergy * 0.8),
                        calibrationComplete: true
                    });
                    navigate('/dashboard');
                } catch (error) {
                    console.error("Neural Sync Failed:", error);
                    // Fallback to local only if database is unreachable
                    navigate('/dashboard');
                }
            }, 4000);
        }
    };

    return (
        <div className="calibration-container">
            <style>{`
                .calibration-container { min-height: 100vh; background: #020617; color: white; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; font-family: 'Outfit', sans-serif; }
                .liquid-bg { position: absolute; inset: 0; background: url('/liquid.png') no-repeat center center/cover; opacity: 0.6; }
                .liquid-bg::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 0%, #020617 100%); }
                
                .calibration-stage { position: relative; z-index: 10; max-width: 800px; width: 100%; padding: 4rem; text-align: center; }
                .step-indicator { font-weight: 800; color: #8b5cf6; letter-spacing: 5px; font-size: 0.75rem; margin-bottom: 2rem; display: block; }
                .quest-title { font-family: 'Playfair Display'; font-size: 4rem; margin-bottom: 1rem; letter-spacing: -2px; }
                .quest-desc { color: #64748b; font-size: 1.25rem; margin-bottom: 4rem; }

                .options-grid { display: grid; gap: 1.5rem; }
                .option-card {
                    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 2rem; border-radius: 2rem; cursor: pointer; transition: 0.5s;
                    text-align: left; backdrop-filter: blur(20px);
                }
                .option-card:hover { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); transform: translateX(10px); }
                
                .option-label { font-weight: 800; letter-spacing: 3px; font-size: 0.75rem; color: #8b5cf6; display: block; margin-bottom: 0.5rem; }
                .option-desc { color: #94a3b8; font-size: 1rem; }

                /* Loading State */
                .analyzing-view { text-align: center; }
                .scanner-icon { color: #8b5cf6; margin-bottom: 2rem; }
                .analyze-title { font-family: 'Playfair Display'; font-size: 3rem; letter-spacing: -1px; }
            `}</style>

            <div className="liquid-bg" />

            <AnimatePresence mode="wait">
                {!isAnalyzing ? (
                    <motion.div 
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="calibration-stage"
                    >
                        <span className="step-indicator">CALIBRATION STEP 0{step + 1} / 08</span>
                        <div style={{ color: '#8b5cf6', marginBottom: '2rem' }}>{questions[step].icon}</div>
                        <h1 className="quest-title">{questions[step].title}</h1>
                        <p className="quest-desc">{questions[step].question}</p>

                        <div className="options-grid">
                            {questions[step].options.map((opt, i) => (
                                <div key={i} className="option-card" onClick={() => handleNext(opt.value)}>
                                    <span className="option-label">{opt.label}</span>
                                    <p className="option-desc">{opt.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="analyzing-view"
                    >
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="scanner-icon"
                        >
                            <Waves size={100} />
                        </motion.div>
                        <h1 className="analyze-title">Analyzing Neural Baseline...</h1>
                        <p style={{ color: '#64748b', letterSpacing: '4px', fontWeight: 800, marginTop: '1rem', fontSize: '0.7rem' }}>CALIBRATING RESONANCE MAP v1.0</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Calibration;
