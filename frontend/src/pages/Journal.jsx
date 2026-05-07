import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Save, History, BookOpen, ArrowRight } from 'lucide-react';

const Journal = () => {
    const [entry, setEntry] = useState('');
    const [title, setTitle] = useState('');

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
                            <button className="ghost-btn">SAVE ARCHIVE <Save size={16} /></button>
                        </div>

                        <div className="archive-section">
                            <div className="status-tag" style={{ marginBottom: '1rem' }}>PAST ENTRIES</div>
                            {[
                                { date: '22 APR 2026', title: 'The Silence of Academic Pressure' },
                                { date: '20 APR 2026', title: 'Calibrating Focus Waves' },
                                { date: '18 APR 2026', title: 'Initialization of Growth' }
                            ].map((item, index) => (
                                <div key={index} className="archive-card">
                                    <span className="archive-date">{item.date}</span>
                                    <div className="archive-title">{item.title}</div>
                                </div>
                            ))}
                            <Link to="#" style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', textDecoration: 'none', marginTop: '1rem' }}>VIEW FULL HISTORY →</Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Journal;
