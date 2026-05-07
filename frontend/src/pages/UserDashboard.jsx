import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
    Activity, Brain, MessageSquare, Heart, 
    TrendingUp, Calendar, Zap, Sparkles, ArrowUpRight, Waves, X, Globe
} from 'lucide-react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

import { generateNeuralRevelation } from '../services/aiService';

const UserDashboard = () => {
    const { user, baselines } = useAuth();
    const [userData, setUserData] = useState(null);
    const [showCalibrationModal, setShowCalibrationModal] = useState(false);
    const [aiInsight, setAiInsight] = useState('SCANNING NEURAL GRID...');
    const [systemStats, setSystemStats] = useState({ totalIdentities: 0, systemStatus: 'INITIALIZING...' });
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (user) {
            setUserData({ 
                name: user.name, 
                energy: baselines.energy, 
                resonance: baselines.stability 
            });

            const getAIInsight = async () => {
                const insight = await generateNeuralRevelation(baselines, user.name);
                setAiInsight(insight);
            };
            
            const getSystemStats = async () => {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/public/stats`);
                    setSystemStats(res.data);
                } catch (e) {
                    console.error("Pulse Failed", e);
                }
            };
            
            getAIInsight();
            getSystemStats();

            // Show modal if energy is the default 88 (simulating uncalibrated)
            if (!baselines.calibrationComplete) {
                const timer = setTimeout(() => setShowCalibrationModal(true), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [user, baselines]);

    const toggleAudio = () => {
        const audio = document.getElementById('neural-audio-driver');
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            // Using a very reliable, high-availability MP3 link
            audio.src = baselines.energy < 70 
                ? "/audio/lofi.mp3" 
                : "/audio/rain.mp3";
            
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch(e => {
                console.error("Neural Handshake Failed", e);
            });
        }
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: { x: { display: false }, y: { display: false } },
        elements: {
            line: { tension: 0.4, borderWidth: 3, borderColor: '#8b5cf6', fill: true, backgroundColor: 'rgba(139, 92, 246, 0.1)' },
            point: { radius: 0 }
        }
    };

    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ data: [65, 78, 66, 89, 75, 92, 88] }]
    };

    return (
        <div className="dashboard-space">
            <audio id="neural-audio-driver" loop crossOrigin="anonymous" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap');
                
                .dashboard-space { 
                    min-height: 100vh; background: #020617; color: white; 
                    font-family: 'Outfit', sans-serif; position: relative;
                }
                .liquid-bg { 
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: url('/liquid.png') no-repeat center center/cover;
                    opacity: 1; z-index: 0;
                }
                .liquid-bg::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(to bottom, rgba(2, 6, 23, 0.6) 0%, #020617 100%);
                }

                .dashboard-content { 
                    position: relative; z-index: 10; padding: 6rem 4vw; 
                    max-width: 1600px; margin: 0 auto;
                }

                .welcome-header { margin-bottom: 8rem; text-align: left; }
                .massive-greeting { 
                    font-family: 'Playfair Display', serif; font-size: clamp(3rem, 8vw, 6rem); 
                    line-height: 0.9; letter-spacing: -3px; margin-bottom: 2rem;
                }
                .status-tag { 
                    font-weight: 800; color: #8b5cf6; letter-spacing: 4px; 
                    font-size: 0.75rem; text-transform: uppercase; margin-bottom: 1rem; display: block;
                }

                .bento-grid-luxury {
                    display: grid; 
                    grid-template-columns: repeat(12, 1fr);
                    grid-auto-rows: minmax(280px, auto);
                    gap: 2.5rem;
                }

                .luxury-card {
                    background: rgba(255, 255, 255, 0.03); 
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 4rem; padding: 3.5rem;
                    display: flex; flex-direction: column; justify-content: space-between;
                    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
                    overflow: hidden;
                    position: relative;
                }
                .luxury-card:hover { 
                    background: rgba(255, 255, 255, 0.06); 
                    border-color: rgba(139, 92, 246, 0.3);
                    transform: translateY(-10px);
                    box-shadow: 0 40px 80px rgba(0,0,0,0.5);
                }

                .span-large { grid-column: span 8; grid-row: span 2; }
                .span-small { grid-column: span 4; }
                .span-wide { grid-column: span 8; }

                .card-title { 
                    font-weight: 800; font-size: 0.7rem; color: #8b5cf6; 
                    letter-spacing: 4px; text-transform: uppercase; margin-bottom: 1rem;
                }
                .card-value { font-family: 'Playfair Display', serif; font-size: 3rem; margin-top: 1rem; }
                .card-icon { color: #8b5cf6; margin-bottom: 1rem; }

                .chart-container { height: 100%; width: 100%; margin-top: 2rem; position: relative; }
                
                .ai-bubble {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
                    border: 1px solid rgba(139, 92, 246, 0.2);
                    padding: 1.5rem; border-radius: 1.5rem;
                    font-style: italic; color: #cbd5e1; line-height: 1.6;
                }

                .pulse-legend { display: flex; gap: 1rem; font-size: 0.6rem; font-weight: 800; letter-spacing: 1px; color: #64748b; margin-top: 1rem; }
                .legend-item { display: flex; align-items: center; gap: 0.4rem; }
                .legend-dot { width: 6px; height: 6px; border-radius: 50%; }

                @keyframes wave { 0%, 100% { height: 5px; } 50% { height: 25px; } }
                .audio-wave { display: flex; gap: 3px; align-items: flex-end; height: 30px; }
                .wave-bar { width: 3px; background: #8b5cf6; border-radius: 2px; animation: wave 1s infinite ease-in-out; }
            `}</style>

            <div className="liquid-bg" />
            
            <div className="dashboard-content">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="welcome-header">
                    <div className="status-tag">SYSTEMS NOMINAL • VOL. 01</div>
                    <h1 className="massive-greeting">
                        Welcome, <span style={{ fontStyle: 'italic', fontWeight: 400 }}>{userData?.name || 'User'}</span>.
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.25rem', maxWidth: '600px' }}>
                        Your emotional resonance is currently <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{userData?.resonance || 'Stable'}</span>.
                    </p>
                </motion.div>

                <AnimatePresence>
                    {showCalibrationModal && (
                        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(15px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: '#020617', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '4rem', borderRadius: '4rem', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '80px', height: '80px', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#8b5cf6' }}><Waves size={40} /></div>
                                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Calibration Required.</h2>
                                <p style={{ color: '#64748b', marginBottom: '3rem' }}>Complete the neural assessment for precise tracking.</p>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <button onClick={() => setShowCalibrationModal(false)} style={{ flex: 1, padding: '1.25rem', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '1.5rem', cursor: 'pointer' }}>LATER</button>
                                    <Link to="/calibration" style={{ flex: 1, padding: '1.25rem', background: '#8b5cf6', color: 'white', borderRadius: '1.5rem', textAlign: 'center', textDecoration: 'none' }}>CALIBRATE</Link>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="bento-grid-luxury">
                    <div className="luxury-card span-large">
                        <div><div className="card-title">Resonance Mapping</div><div className="card-value">Weekly Pulse</div></div>
                        <div className="chart-container"><Line options={chartOptions} data={chartData} /></div>
                    </div>

                    <div className="luxury-card span-small">
                        <Zap className="card-icon" size={32} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <div className="card-title">Mental Energy</div>
                                <div className="card-value">{baselines.energy}%</div>
                            </div>
                            <Link to="/calibration" style={{ 
                                fontSize: '0.6rem', fontWeight: 800, color: '#8b5cf6', 
                                textDecoration: 'none', letterSpacing: '2px',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                padding: '0.4rem 0.8rem', borderRadius: '1rem',
                                marginBottom: '0.5rem'
                            }}>RE-SYNC</Link>
                        </div>
                    </div>

                    <div className="luxury-card span-small">
                        <Heart className="card-icon" size={32} />
                        <div><div className="card-title">Mood Stability</div><div className="card-value">{baselines.stability}</div></div>
                    </div>

                    <div className="luxury-card span-wide" style={{ gridRow: 'span 2', padding: '0', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#8b5cf6', padding: '1rem', borderRadius: '50%', zIndex: 10 }}><Sparkles size={24} color="white" /></div>
                        <div style={{ height: '100%', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', position: 'relative', zIndex: 5 }}>
                            <div className="card-title">Neural Revelation</div>
                            <blockquote style={{ flex: 1, display: 'flex', alignItems: 'center', margin: 0 }}>
                                <p style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontStyle: 'italic', lineHeight: '1.5', margin: 0 }}>"{aiInsight}"</p>
                            </blockquote>
                            <div style={{ marginTop: '3rem', fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '1px', background: '#475569' }}></div> AI SYNTHESIS COMPLETE
                            </div>
                        </div>
                    </div>

                    <div className="luxury-card span-small">
                        <MessageSquare className="card-icon" size={32} />
                        <div><div className="card-title">Active Journals</div><div className="card-value">12</div></div>
                    </div>

                    <div className="luxury-card span-small" style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
                        <Globe className="card-icon" size={32} />
                        <div>
                            <div className="card-title">Campus Pulse</div>
                            <div style={{ display: 'flex', gap: '4px', marginTop: '1.5rem' }}>
                                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => <div key={i} style={{ flex: 1, height: '30px', background: i > 10 ? '#ef4444' : (i > 4 ? '#8b5cf6' : '#10b981'), opacity: 0.3 + (Math.random() * 0.7), borderRadius: '4px' }} />)}
                            </div>
                            <div className="pulse-legend">
                                <div className="legend-item"><div className="legend-dot" style={{ background: '#10b981' }} /> STABLE</div>
                                <div className="legend-item"><div className="legend-dot" style={{ background: '#8b5cf6' }} /> FOCUS</div>
                                <div className="legend-item"><div className="legend-dot" style={{ background: '#ef4444' }} /> STRESS</div>
                            </div>
                        </div>
                    </div>

                    <div className="luxury-card span-wide" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div><div className="card-title">Neural Audio Engine</div><div className="card-value" style={{ fontSize: '2.5rem' }}>{isPlaying ? 'Streaming Peace...' : 'Soundscapes'}</div></div>
                            {isPlaying ? <div className="audio-wave">{[1,2,3,4,5].map(i => <div key={i} className="wave-bar" style={{ animationDelay: `${i*0.1}s` }} />)}</div> : <Waves color="#8b5cf6" size={32} />}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                            <div className="ai-bubble" style={{ flex: 1 }}><strong>Context Suggestion:</strong> {baselines.energy < 70 ? 'Low energy detected. Use Lo-Fi Focus.' : 'Stability high. Deep Rain recommended.'}</div>
                            <button onClick={toggleAudio} style={{ background: isPlaying ? '#ef4444' : 'white', color: isPlaying ? 'white' : 'black', border: 'none', padding: '1rem 2rem', borderRadius: '1.5rem', fontWeight: 900, cursor: 'pointer' }}>{isPlaying ? 'STOP NEURAL STREAM' : 'INITIALIZE AUDIO'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
