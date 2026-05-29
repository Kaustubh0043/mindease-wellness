import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Save, History, BookOpen, ArrowRight, Loader2, Sparkles, Brain, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useAudioMixer } from '../context/AudioContext';
import { analyzeJournalSentiment } from '../services/aiService';

const Journal = () => {
    const { user } = useAuth();
    const { stopAll } = useAudioMixer();
    const [entry, setEntry] = useState('');
    const [title, setTitle] = useState('');
    const [pastEntries, setPastEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);

    const fetchEntries = async () => {
        if (!user) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/journal`, config);
            setPastEntries(response.data);
        } catch (error) {
            console.error("Failed to fetch journals", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!entry.trim()) {
            alert("REFLECTION ERROR: Cannot archive an empty thought stream.");
            return;
        }
        setIsSaving(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const combinedContent = title.trim() 
                ? `${title.trim()}\n\n${entry.trim()}` 
                : `Untitled Reflection\n\n${entry.trim()}`;
                
            await axios.post(`${import.meta.env.VITE_API_URL}/journal`, { content: combinedContent }, config);
            
            // Stop active ambient streams
            stopAll();

            // Trigger AI analysis
            setIsAnalyzing(true);
            const targetText = entry.trim();
            const analysis = await analyzeJournalSentiment(targetText, user.name || 'Student');
            setAnalysisResult(analysis);
            
            setTitle('');
            setEntry('');
            setIsAnalyzing(false);
            setShowAnalysisModal(true);
            fetchEntries();
        } catch (error) {
            console.error("Failed to save journal", error);
            alert("HANDSHAKE FAILED: Unable to commit reflection to database.");
        } finally {
            setIsSaving(false);
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="dashboard-space">
            <style>{`
                .dashboard-space { min-height: 100vh; background: #020617; color: white; font-family: 'Outfit', sans-serif; position: relative; }
                .liquid-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: url('/liquid.png') no-repeat center center/cover; opacity: 1; z-index: 0; }
                .liquid-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(2, 6, 23, 0.6) 0%, #020617 100%); }
                .content-area { position: relative; z-index: 10; padding: 6rem 2rem; }
                .massive-title { font-family: 'Playfair Display'; font-size: 5rem; margin-bottom: 4rem; letter-spacing: -2px; }
                
                .journal-interface { display: grid; grid-template-columns: 2fr 1fr; gap: 4vw; margin-top: 4rem; }
                
                .write-section {
                    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 5rem; border-radius: 4rem; backdrop-filter: blur(20px);
                }

                .luxury-input {
                    background: transparent !important; border: none; border-bottom: 1px solid rgba(255,255,255,0.1);
                    width: 100%; padding: 1.5rem 0; font-family: 'Playfair Display'; font-size: 2.5rem;
                    color: white; outline: none; margin-bottom: 3rem; transition: 0.4s;
                }
                .luxury-input:focus { border-bottom-color: #8b5cf6; }

                .luxury-textarea {
                    background: transparent !important; border: none; width: 100%; min-height: 400px;
                    font-size: 1.4rem; line-height: 1.8; color: #cbd5e1; outline: none;
                    resize: none; font-family: 'Outfit', sans-serif;
                }

                .archive-section { display: flex; flex-direction: column; gap: 2rem; }
                .archive-card {
                    background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 2.5rem; border-radius: 2.5rem; cursor: pointer; transition: 0.3s;
                }
                .archive-card:hover { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); transform: translateX(10px); }
                
                .archive-date { font-weight: 800; font-size: 0.65rem; color: #8b5cf6; letter-spacing: 3px; margin-bottom: 0.75rem; display: block; }
                .archive-title { font-family: 'Playfair Display'; font-size: 1.25rem; }

                .ghost-btn {
                    margin-top: 3rem; background: rgba(255, 255, 255, 0.03); 
                    color: white; padding: 1.5rem 0; width: 100%; 
                    border: 1px solid rgba(255, 255, 255, 0.1); 
                    backdrop-filter: blur(10px);
                    font-weight: 800; letter-spacing: 6px; 
                    font-size: 0.8rem; cursor: pointer; display: flex; 
                    align-items: center; justify-content: center; gap: 1.5rem; 
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    text-transform: uppercase;
                }
                .ghost-btn:hover { 
                    background: #8b5cf6; color: white;
                    border-color: #8b5cf6;
                    box-shadow: 0 0 40px rgba(139, 92, 246, 0.4);
                    letter-spacing: 8px;
                }

                /* Glassmorphic Cognitive synthesis modal */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(20px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 10000; padding: 2rem;
                }
                .luxury-modal {
                    background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(139, 92, 246, 0.2);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 50px rgba(139, 92, 246, 0.1);
                    border-radius: 3rem; padding: 4rem; width: 100%; max-width: 650px;
                    position: relative; backdrop-filter: blur(30px);
                }
                .modal-close-btn {
                    position: absolute; top: 2.5rem; right: 2.5rem;
                    background: none; border: none; color: #64748b; cursor: pointer; transition: 0.3s;
                }
                .modal-close-btn:hover { color: white; transform: scale(1.1); }
                .modal-headline { font-family: 'Outfit'; font-weight: 800; font-size: 1.1rem; letter-spacing: 5px; margin: 0; color: white; }
                
                .modal-sentiment-badge {
                    background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2);
                    color: #cbd5e1; font-size: 0.75rem; font-weight: 700; letter-spacing: 2px;
                    padding: 1rem 1.5rem; border-radius: 1.5rem; display: inline-block; margin-bottom: 2rem;
                    margin-top: 1.5rem;
                }
                .modal-section-title { font-size: 0.65rem; font-weight: 800; color: #64748b; letter-spacing: 3px; text-transform: uppercase; }
                .distortion-badge {
                    background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #f87171; font-size: 0.65rem; font-weight: 800; letter-spacing: 1px;
                    padding: 0.5rem 1rem; border-radius: 1rem; display: flex; align-items: center; gap: 0.5rem;
                }
                .modal-reframe-text {
                    font-family: 'Playfair Display', serif; font-size: 1.6rem; line-height: 1.6;
                    color: #e2e8f0; margin-top: 1rem; font-style: italic;
                }
                .modal-action-btn {
                    background: #8b5cf6; color: white; border: none; width: 100%;
                    padding: 1.5rem 0; border-radius: 1.5rem; font-weight: 800;
                    letter-spacing: 4px; font-size: 0.75rem; cursor: pointer;
                    box-shadow: 0 0 30px rgba(139, 92, 246, 0.3); transition: 0.4s;
                }
                .modal-action-btn:hover {
                    background: #a855f7; box-shadow: 0 0 45px rgba(168, 85, 247, 0.5);
                    letter-spacing: 5px;
                }

                @media (max-width: 900px) {
                    .journal-interface {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                        margin-top: 2rem;
                    }
                    .write-section {
                        padding: 3rem 2rem;
                        border-radius: 2.5rem;
                    }
                    .luxury-input {
                        font-size: 1.8rem;
                        margin-bottom: 2rem;
                    }
                    .luxury-textarea {
                        min-height: 250px;
                        font-size: 1.1rem;
                    }
                    .massive-title {
                        font-size: 3rem;
                        margin-bottom: 2rem;
                    }
                    .luxury-modal {
                        padding: 2.5rem 2rem;
                        border-radius: 2rem;
                    }
                    .modal-close-btn {
                        top: 1.5rem;
                        right: 1.5rem;
                    }
                    .modal-reframe-text {
                        font-size: 1.25rem;
                    }
                }
            `}</style>

            <div className="liquid-bg" />
            
            <div className="content-area">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="status-tag" style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.7rem', marginBottom: '1.5rem' }}>NEURAL ARCHIVE</div>
                    <h1 className="massive-title">Deep<br/><span style={{ fontStyle: 'italic', fontWeight: 400 }}>Reflections</span>.</h1>

                    <div className="journal-interface">
                        <div className="write-section">
                            <input 
                                className="luxury-input" 
                                placeholder="Entry Title..." 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea 
                                className="luxury-textarea" 
                                placeholder="Pour your thoughts onto the digital paper..."
                                value={entry}
                                onChange={(e) => setEntry(e.target.value)}
                            />
                            <button 
                                className="ghost-btn" 
                                onClick={handleSave}
                                disabled={isSaving || isAnalyzing || !entry.trim()}
                            >
                                {isAnalyzing ? "COGNITIVE SYNTHESIS..." : (isSaving ? "SAVING ARCHIVE..." : "SAVE ARCHIVE")} 
                                {(isSaving || isAnalyzing) ? <Loader2 className="spin" style={{ animation: 'spin 1s linear infinite' }} size={16} /> : <Save size={16} />}
                            </button>
                        </div>

                        <div className="archive-section">
                            <div className="status-tag" style={{ marginBottom: '1rem' }}>PAST ENTRIES</div>
                            {isLoading ? (
                                <div style={{ color: '#475569', fontSize: '0.9rem', padding: '1rem 0' }}>
                                    Scanning neural logs...
                                </div>
                            ) : pastEntries.length === 0 ? (
                                <div style={{ color: '#475569', fontSize: '0.9rem', padding: '1rem 0' }}>
                                    No past reflections archived.
                                </div>
                            ) : (
                                pastEntries.slice(0, 5).map((item) => {
                                    const lines = item.content.split('\n\n');
                                    const displayTitle = lines[0] || 'Untitled Reflection';
                                    const displayBody = lines.slice(1).join('\n\n') || '';
                                    const dateStr = new Date(item.createdAt).toLocaleDateString('en-US', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    }).toUpperCase();

                                    return (
                                        <div 
                                            key={item.id} 
                                            className="archive-card"
                                            onClick={() => {
                                                setTitle(displayTitle);
                                                setEntry(displayBody);
                                            }}
                                            title="Click to load into editor"
                                        >
                                            <span className="archive-date">{dateStr}</span>
                                            <div className="archive-title">{displayTitle}</div>
                                        </div>
                                    );
                                })
                            )}
                            <Link to="#" style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', textDecoration: 'none', marginTop: '1rem' }}>VIEW FULL HISTORY →</Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showAnalysisModal && analysisResult && (
                    <div className="modal-overlay">
                        <motion.div 
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="luxury-modal"
                        >
                            <button className="modal-close-btn" onClick={() => setShowAnalysisModal(false)}>
                                <X size={20} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <Brain style={{ color: '#8b5cf6' }} size={28} />
                                <h3 className="modal-headline">COGNITIVE RESONANCE</h3>
                            </div>
                            
                            <div className="modal-sentiment-badge">
                                SENTIMENT FREQUENCY: <span style={{ color: '#c084fc', fontWeight: 900 }}>{analysisResult.sentiment}</span>
                            </div>

                            {analysisResult.distortions && analysisResult.distortions.length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div className="modal-section-title">DETECTED COGNITIVE DISTORTIONS</div>
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                        {analysisResult.distortions.map((dist, idx) => (
                                            <span key={idx} className="distortion-badge">
                                                <AlertCircle size={12} /> {dist}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ marginBottom: '2.5rem' }}>
                                <div className="modal-section-title">THERAPEUTIC REFRAME</div>
                                <p className="modal-reframe-text">
                                    "{analysisResult.reframing}"
                                </p>
                            </div>

                            <button className="modal-action-btn" onClick={() => setShowAnalysisModal(false)}>
                                ACKNOWLEDGE & CALIBRATE
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Journal;
