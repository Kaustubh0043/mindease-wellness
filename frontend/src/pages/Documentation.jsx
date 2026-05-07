import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Book, Shield, Heart, Sparkles, 
    ChevronRight, ExternalLink, MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import PublicNavbar from '../components/PublicNavbar';

const Documentation = () => {
    const [activeTab, setActiveTab] = React.useState('guide');
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(false);

    const handleCreateTicket = async () => {
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/support/create`, {
                studentName: user?.name || 'Anonymous Student',
                studentEmail: user?.email || 'unlinked@mindease.com',
                message: 'STUDENT REQUEST: User requested institutional support from the Wellness Hub.',
            });
            alert('SUPPORT CHANNEL INITIALIZED: A counselor has been notified of your request.');
        } catch (e) {
            alert('HANDSHAKE FAILED: Unable to reach Overwatch. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const content = {
        guide: {
            title: 'The Neural Guide',
            icon: <Book size={24} className="text-orange-500" />,
            text: 'Welcome to the Silent Wave. Your journey through MindEase is designed to be intuitive and restorative. Here is how to map your baseline resonance.',
            steps: [
                '1. Calibration: Complete your initial assessment to set your baseline.',
                '2. Daily Pulse: A 5-second check-in to track emotional shifts.',
                '3. Deep Reflection: Use the generative journal to offload cognitive load.'
            ]
        },
        privacy: {
            title: 'Privacy & Shielding',
            icon: <Shield size={24} className="text-emerald-500" />,
            text: 'Your soul is your own. We utilize decentralized encryption layers to ensure that your private reflections remain invisible to everyone, including us.',
            details: [
                'Local-First Encryption',
                'Anonymous Neural Mapping',
                'Institutional Transparency'
            ]
        },
        wellness: {
            title: 'Wellness Protocols',
            icon: <Heart size={24} className="text-purple-500" />,
            text: 'Academic success requires mental resonance. Follow our established protocols to maintain clarity during high-pressure cycles.',
            steps: [
                '4-7-8 Breathing Pulse: Use the Neural Pulse tool during high-stress periods.',
                'Journal Synthesis: Review your weekly AI insights for hidden patterns.',
                'Counselor Outreach: Never hesitate to open a direct channel.'
            ]
        }
    };

    return (
        <div className="docs-container" style={{ background: '#020617', color: 'white', minHeight: '100vh' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap');
                .docs-container { font-family: 'Outfit', sans-serif; }
                .docs-hero {
                    padding: 12rem 6vw 6rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
                }
                .docs-grid { display: grid; grid-template-columns: 280px 1fr; gap: 4rem; max-width: 1400px; margin: 0 auto; padding: 4rem 6vw; }
                .docs-sidebar { position: sticky; top: 10rem; height: fit-content; }
                .sidebar-item { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border-radius: 1rem; cursor: pointer; transition: 0.3s; color: #64748b; margin-bottom: 0.5rem; }
                .sidebar-item.active { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
                .sidebar-item:hover:not(.active) { background: rgba(255,255,255,0.02); color: white; }
                .content-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 4rem; border-radius: 3rem; backdrop-filter: blur(20px); }
            `}</style>

            <PublicNavbar />

            <div className="docs-hero">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.7rem', marginBottom: '1.5rem' }}>CENTRAL INTELLIGENCE</div>
                    <h1 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 0.9 }}>Wellness Hub</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.25rem', marginTop: '2rem', maxWidth: '600px' }}>
                        Operational guides and neural protocols for the MindEase institutional ecosystem.
                    </p>
                </motion.div>
            </div>

            <div className="docs-grid">
                <div className="docs-sidebar">
                    {Object.keys(content).map((key) => (
                        <div 
                            key={key} 
                            className={`sidebar-item ${activeTab === key ? 'active' : ''}`}
                            onClick={() => setActiveTab(key)}
                        >
                            {content[key].icon}
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px' }}>{content[key].title.toUpperCase()}</span>
                        </div>
                    ))}
                </div>

                <div className="docs-content">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="content-card"
                        >
                            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', marginBottom: '2rem' }}>{content[activeTab].title}</h2>
                            <p style={{ color: '#94a3b8', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '3rem' }}>{content[activeTab].text}</p>
                            
                            {content[activeTab].steps && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {content[activeTab].steps.map((step, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1.5rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
                                            <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{step}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {content[activeTab].details && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                    {content[activeTab].details.map((detail, i) => (
                                        <div key={i} style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2rem', textAlign: 'center' }}>
                                            <Sparkles size={20} style={{ color: '#8b5cf6', marginBottom: '1rem' }} />
                                            <div style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>{detail}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Support Call to Action */}
                    <div style={{ marginTop: '4rem', textAlign: 'center', padding: '4rem', background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1), transparent)', borderRadius: '4rem' }}>
                        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', marginBottom: '1rem' }}>Support Overwatch</h3>
                        <p style={{ color: '#64748b', marginBottom: '3rem' }}>If you are experiencing neural desync or need guidance, open a direct channel.</p>
                        <button 
                            onClick={handleCreateTicket}
                            disabled={loading}
                            style={{ 
                                background: '#8b5cf6', color: 'white', border: 'none', 
                                padding: '1.25rem 3rem', borderRadius: '2rem', fontWeight: 800, 
                                letterSpacing: '2px', cursor: 'pointer', transition: '0.3s' 
                            }}
                        >
                            {loading ? 'INITIALIZING...' : 'OPEN SUPPORT TICKET'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documentation;
