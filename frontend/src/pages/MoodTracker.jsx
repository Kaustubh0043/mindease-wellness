import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Sparkles, Heart, Zap, Brain, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MoodTracker = () => {
    const { updateBaselines, baselines } = useAuth();
    const [selectedMood, setSelectedMood] = useState(null);
    const [intensity, setIntensity] = useState(50);

    const handleSubmit = () => {
        // Direct mapping for a more reactive experience
        const newEnergy = parseInt(intensity);
        let stabilityLabel = 'Stable';
        
        if (newEnergy > 90) stabilityLabel = 'Elite';
        else if (newEnergy > 75) stabilityLabel = 'Optimal';
        else if (newEnergy > 50) stabilityLabel = 'Resonant';
        
        updateBaselines({
            energy: newEnergy,
            stability: stabilityLabel
        });
        
        alert(`NEURAL FREQUENCY LOGGED: Resonance set to ${newEnergy}% (${stabilityLabel}).`);
    };

    const moods = [
        { id: 'vibrant', label: 'VIBRANT', icon: <Zap size={24} />, color: '#8b5cf6', desc: 'High energy, high focus.' },
        { id: 'resonant', label: 'RESONANT', icon: <Sparkles size={24} />, color: '#ec4899', desc: 'Balanced emotional state.' },
        { id: 'stable', label: 'STABLE', icon: <Shield size={24} />, color: '#3b82f6', desc: 'Calm and steady baseline.' },
        { id: 'muted', label: 'MUTED', icon: <Brain size={24} />, color: '#64748b', desc: 'Lower energy, reflective.' }
    ];

    return (
        <div className="dashboard-space">
            <style>{`
                .dashboard-space { 
                    min-height: 100vh; background: #020617; color: white; 
                    font-family: 'Outfit', sans-serif; position: relative;
                }
                .liquid-bg { 
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    backdrop-filter: blur(10px);
                    background: url('/liquid.png') no-repeat center center/cover;
                    opacity: 1; z-index: 0;
                }
                .liquid-bg::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(to bottom, rgba(2, 6, 23, 0.6) 0%, #020617 100%);
                }
                .content-area { 
                    position: relative; z-index: 10; padding: 6rem 2rem; 
                }
                .massive-title { font-family: 'Playfair Display'; font-size: 5rem; margin-bottom: 4rem; letter-spacing: -2px; }
                
                .sensor-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; margin-top: 4rem; }
                
                .luxury-card { 
                    background: rgba(255, 255, 255, 0.03); 
                    backdrop-filter: blur(10px); 
                    border: 1px solid rgba(255, 255, 255, 0.05); 
                    border-radius: 3rem; padding: 3rem; transition: 0.4s;
                }
                .sensor-card {
                    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 3rem 2rem; border-radius: 2.5rem; cursor: pointer;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    text-align: center;
                }
                .sensor-card.active {
                    background: rgba(139, 92, 246, 0.1); border-color: #8b5cf6;
                    transform: translateY(-10px);
                }
                .sensor-card:hover:not(.active) { background: rgba(255, 255, 255, 0.06); }
                
                .sensor-label { font-weight: 800; font-size: 0.7rem; letter-spacing: 3px; color: #64748b; margin-top: 2rem; display: block; }
                .sensor-card.active .sensor-label { color: #8b5cf6; }

                .intensity-slider { margin-top: 6rem; max-width: 600px; }
                .luxury-range {
                    width: 100%; -webkit-appearance: none; background: rgba(255,255,255,0.05);
                    height: 2px; border-radius: 5px; outline: none; margin-top: 2rem;
                }
                .luxury-range::-webkit-slider-thumb {
                    -webkit-appearance: none; width: 20px; height: 20px;
                    background: #8b5cf6; border-radius: 50%; cursor: pointer;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
                }

                .submit-sensor {
                    margin-top: 4rem; background: rgba(255, 255, 255, 0.03); 
                    color: white; padding: 1.5rem 0; width: 100%; 
                    border: 1px solid rgba(255, 255, 255, 0.1); 
                    backdrop-filter: blur(10px);
                    font-weight: 800; letter-spacing: 6px; 
                    font-size: 0.8rem; cursor: pointer; display: flex; 
                    align-items: center; justify-content: center; gap: 1.5rem; 
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    text-transform: uppercase;
                }
                .submit-sensor:hover { 
                    background: #8b5cf6; color: white;
                    border-color: #8b5cf6;
                    box-shadow: 0 0 40px rgba(139, 92, 246, 0.4);
                    letter-spacing: 8px;
                }
            `}</style>

            <div className="liquid-bg" />
            
            <div className="content-area">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="status-tag" style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.7rem', marginBottom: '1.5rem' }}>CALIBRATION MODE</div>
                    <h1 className="massive-title">Sensory<br/><span style={{ fontStyle: 'italic', fontWeight: 400 }}>Mapping</span>.</h1>
                    
                    <p style={{ color: '#64748b', fontSize: '1.5rem', fontFamily: 'Playfair Display', maxWidth: '600px' }}>
                        Identify your current emotional frequency to synchronize the neural engine.
                    </p>

                    <div className="sensor-grid">
                        {moods.map((mood) => (
                            <div 
                                key={mood.id} 
                                className={`sensor-card ${selectedMood === mood.id ? 'active' : ''}`}
                                onClick={() => setSelectedMood(mood.id)}
                            >
                                <div style={{ color: selectedMood === mood.id ? '#8b5cf6' : '#1e293b', transition: '0.3s' }}>
                                    {mood.icon}
                                </div>
                                <span className="sensor-label">{mood.label}</span>
                                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '1rem', display: selectedMood === mood.id ? 'block' : 'none' }}>
                                    {mood.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {selectedMood && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="intensity-slider">
                            <div className="status-tag">RESONANCE INTENSITY: {intensity}%</div>
                            <input 
                                type="range" 
                                className="luxury-range" 
                                value={intensity} 
                                onChange={(e) => setIntensity(e.target.value)} 
                            />
                            <button className="submit-sensor" onClick={handleSubmit}>LOG RESONANCE <ArrowRight size={14} style={{ marginLeft: '10px' }} /></button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default MoodTracker;
