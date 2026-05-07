import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Book, Code, Cpu, Shield, Zap, 
    Layers, Terminal, Database, Globe,
    ChevronRight, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import PublicNavbar from '../components/PublicNavbar';

const Documentation = () => {
    const [activeTab, setActiveTab] = React.useState('architecture');
    const { user } = useAuth();

    const handleCreateTicket = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/support/create`, {
                studentName: user?.name || 'Anonymous Student',
                studentEmail: user?.email || 'unlinked@mindease.com',
                message: 'NEURAL DESYNC: User requested institutional support from the Knowledge Base.',
            });
            alert('SUPPORT CHANNEL INITIALIZED: Your request has been logged in the Counselor Grid.');
        } catch (e) {
            alert('HANDSHAKE FAILED: Unable to reach Overwatch. Please check your connection.');
        }
    };

    const content = {
        architecture: {
            title: 'Neural Architecture',
            icon: <Cpu size={24} className="text-purple-500" />,
            text: 'MindEase operates on a "Silent Wave" architecture. The frontend maps user emotional frequencies using sensory-driven UI components, while the backend processes these through a neural intelligence grid to provide real-time wellness insights.',
            details: [
                'Stateless JWT Authentication',
                'Sensory-driven UI (Framer Motion)',
                'Spring Boot & MySQL Persistence'
            ]
        },
        installation: {
            title: 'Deployment & Setup',
            icon: <Terminal size={24} className="text-blue-500" />,
            text: 'To deploy MindEase in your institutional environment, follow the neural initialization steps.',
            code: 'git clone https://github.com/kaustubh/mindease\ncd backend && ./mvnw spring-boot:run\ncd frontend && npm install && npm run dev'
        },
        api: {
            title: 'API Reference',
            icon: <Code size={24} className="text-emerald-500" />,
            text: 'Standardized endpoints for the MindEase ecosystem.',
            endpoints: [
                { method: 'POST', path: '/api/auth/login', desc: 'Gateway entry' },
                { method: 'GET', path: '/api/user/moods', desc: 'Neural log retrieval' },
                { method: 'GET', path: '/api/admin/stats', desc: 'Overwatch analytics' }
            ]
        },
        guide: {
            title: 'User Manual',
            icon: <Book size={24} className="text-orange-500" />,
            text: 'Navigating the Silent Wave. Learn how to calibrate your energy and map your reflections.',
            steps: [
                '1. Initialization: Register and verify your ID.',
                '2. Calibration: Complete the Q/A to set your baseline.',
                '3. Reflection: Use the Journal to offload cognitive load.'
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

                .docs-grid {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 4rem;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 4rem 6vw;
                }

                .docs-sidebar {
                    position: sticky;
                    top: 10rem;
                    height: fit-content;
                }

                .sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.25rem;
                    color: #64748b;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.8rem;
                    letter-spacing: 2px;
                    border-radius: 1rem;
                    transition: 0.3s;
                    cursor: pointer;
                    border: 1px solid transparent;
                }
                .sidebar-item:hover {
                    color: #8b5cf6;
                    background: rgba(139, 92, 246, 0.05);
                }
                .sidebar-item.active {
                    color: white;
                    background: rgba(139, 92, 246, 0.1);
                    border-color: rgba(139, 92, 246, 0.2);
                }

                .docs-card {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 2.5rem;
                    padding: 4rem;
                    margin-bottom: 3rem;
                }

                .code-block {
                    background: #0f172a;
                    padding: 2rem;
                    border-radius: 1.5rem;
                    font-family: 'Terminal', monospace;
                    color: #8b5cf6;
                    font-size: 0.9rem;
                    border: 1px solid rgba(139, 92, 246, 0.2);
                    margin: 2rem 0;
                    white-space: pre-wrap;
                }
            `}</style>

            <PublicNavbar />

            <div className="docs-hero">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.7rem', marginBottom: '1.5rem' }}>CENTRAL INTELLIGENCE</div>
                    <h1 style={{ fontFamily: 'Playfair Display', fontSize: '4rem', marginBottom: '2rem' }}>Knowledge Base</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
                        Operational guides and neural protocols for the MindEase ecosystem.
                    </p>
                </motion.div>
            </div>

            <div className="docs-grid">
                <aside className="docs-sidebar">
                    <div className={`sidebar-item ${activeTab === 'architecture' ? 'active' : ''}`} onClick={() => setActiveTab('architecture')}><Layers size={16} /> ARCHITECTURE</div>
                    <div className={`sidebar-item ${activeTab === 'installation' ? 'active' : ''}`} onClick={() => setActiveTab('installation')}><Terminal size={16} /> INSTALLATION</div>
                    <div className={`sidebar-item ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}><Globe size={16} /> API REFERENCE</div>
                    <div className={`sidebar-item ${activeTab === 'guide' ? 'active' : ''}`} onClick={() => setActiveTab('guide')}><Book size={16} /> USER GUIDE</div>
                </aside>

                <main className="docs-content">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="docs-card"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                {content[activeTab].icon}
                                <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display' }}>{content[activeTab].title}</h2>
                            </div>
                            
                            <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '1.2rem', marginBottom: '2rem' }}>
                                {content[activeTab].text}
                            </p>

                            {content[activeTab].details && (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {content[activeTab].details.map(d => (
                                        <li key={d} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#8b5cf6', marginBottom: '1rem', fontWeight: 700 }}>
                                            <ChevronRight size={14} /> {d}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {content[activeTab].code && (
                                <div className="code-block">{content[activeTab].code}</div>
                            )}

                            {content[activeTab].endpoints && (
                                <div style={{ marginTop: '3rem' }}>
                                    {content[activeTab].endpoints.map(e => (
                                        <div key={e.path} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <code style={{ color: '#8b5cf6', fontWeight: 800 }}>{e.method} {e.path}</code>
                                            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{e.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {content[activeTab].steps && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                                    {content[activeTab].steps.map(s => (
                                        <div key={s} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', color: '#cbd5e1' }}>{s}</div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="docs-card" style={{ background: 'linear-gradient(to right, rgba(139, 92, 246, 0.1), transparent)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Playfair Display' }}>Support Overwatch</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>If you are experiencing neural desync or database connectivity issues, open a direct channel.</p>
                        <button 
                            onClick={handleCreateTicket}
                            style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '1.25rem 2.5rem', borderRadius: '1.25rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '2px' }}
                        >
                            OPEN SUPPORT TICKET
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Documentation;
