import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, ExternalLink, ShieldCheck, Users, Brain, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const AboutUs = () => {
    return (
        <div className="about-container" style={{ background: '#020617', color: 'white', minHeight: '100vh', padding: '8rem 2rem' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap');
                
                .about-container { font-family: 'Outfit', sans-serif; position: relative; overflow: hidden; }
                .liquid-bg { 
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: url('/liquid.png') no-repeat center center/cover;
                    opacity: 0.3; z-index: 0; pointer-events: none;
                }
                
                .massive-header {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(3rem, 10vw, 8rem);
                    line-height: 0.9;
                    margin-bottom: 4rem;
                }

                .luxury-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 2.5rem;
                    padding: 3rem;
                    transition: all 0.4s ease;
                }
                .luxury-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(139, 92, 246, 0.3);
                }

                .input-field {
                    width: 100%;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 1.25rem;
                    border-radius: 1rem;
                    color: white;
                    margin-bottom: 1.5rem;
                    outline: none;
                    transition: 0.3s;
                }
                .input-field:focus {
                    border-color: #8b5cf6;
                    background: rgba(139, 92, 246, 0.05);
                }

                .submit-btn {
                    width: 100%;
                    padding: 1.25rem;
                    background: #8b5cf6;
                    color: white;
                    border: none;
                    border-radius: 1rem;
                    font-weight: 800;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .submit-btn:hover {
                    background: #7c3aed;
                    transform: translateY(-2px);
                }
            `}</style>

            <div className="liquid-bg" />
            <PublicNavbar />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.7rem', marginBottom: '1.5rem' }}>BEYOND THE ARCHITECTURE</div>
                    <h1 className="massive-header">The Soul<br/><span style={{ fontStyle: 'italic', fontWeight: 400 }}>Behind</span> MindEase.</h1>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', marginTop: '4rem' }}>
                    {/* Left Column: Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <section className="luxury-card">
                            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Our Mission</h2>
                            <p style={{ color: '#94a3b8', fontSize: '1.2rem', lineHeight: '1.8' }}>
                                MindEase was born from the realization that academic excellence should never come at the cost of mental well-being. 
                                We provide a "Silent Wave" architecture—a sensory-driven mental health ecosystem designed to help students 
                                map their internal resonance and find clarity in the chaos of institutional life.
                            </p>
                        </section>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="luxury-card">
                                <Users style={{ color: '#8b5cf6', marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>For Students</h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time mood tracking, AI-driven insights, and private journaling space.</p>
                            </div>
                            <div className="luxury-card">
                                <ShieldCheck style={{ color: '#8b5cf6', marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>For Institutes</h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Anonymized aggregate stats to understand campus-wide wellness levels.</p>
                            </div>
                        </div>

                        <section className="luxury-card">
                            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', marginBottom: '1.5rem' }}>The Developer</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '2.5rem', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles color="white" size={40} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Kaustubh Jadhav</h4>
                                    <p style={{ color: '#94a3b8' }}>Lead Architect & Neural Designer</p>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <a href="https://github.com/kaustubh0043" target="_blank" rel="noreferrer">
                                            <Github size={20} style={{ cursor: 'pointer', opacity: 0.6, color: 'white' }} />
                                        </a>
                                        <a href="https://www.linkedin.com/in/kaustubh-jadhav-6a2216248/" target="_blank" rel="noreferrer">
                                            <Linkedin size={20} style={{ cursor: 'pointer', opacity: 0.6, color: 'white' }} />
                                        </a>
                                        <a href="mailto:kaustubhjadhav0043@gmail.com">
                                            <Mail size={20} style={{ cursor: 'pointer', opacity: 0.6, color: 'white' }} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Feedback & Contact */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="luxury-card" style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: '2rem' }}>Resonance Feedback</h3>
                            <form onSubmit={(e) => { e.preventDefault(); alert('FEEDBACK SYNCED: Thank you for contributing to the neural grid.'); }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>NAME</label>
                                <input type="text" className="input-field" placeholder="Identify yourself..." required />
                                
                                <label style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>MESSAGE</label>
                                <textarea className="input-field" style={{ height: '150px', resize: 'none' }} placeholder="Share your thoughts on the platform..." required></textarea>
                                
                                <button type="submit" className="submit-btn">SEND TO OVERWATCH</button>
                            </form>
                        </div>

                        <div className="luxury-card">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Contact Channels</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
                                    <Mail size={18} /> mindease.support@institute.edu
                                </div>
                                <a href="/docs" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', textDecoration: 'none' }}>
                                    <ExternalLink size={18} /> Documentation Hub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PREMIUM FOOTER --- */}
                <footer style={{ padding: '15vh 0 5vh', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', marginTop: '10rem' }}>
                    <div className="massive-header" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', opacity: 0.1, color: 'white', marginBottom: '4rem', position: 'relative', zIndex: 0 }}>MINDEASE</div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', marginBottom: '6rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '4px', position: 'relative', zIndex: 100 }}>
                        <a href="/docs" style={{ display: 'inline-block', color: 'white', textDecoration: 'none', opacity: 1, fontWeight: 900, border: '2px solid #8b5cf6', padding: '0.8rem 2rem', borderRadius: '2rem', background: 'rgba(139, 92, 246, 0.2)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)', transition: '0.3s' }} onMouseOver={e => e.target.style.background = '#8b5cf6'} onMouseOut={e => e.target.style.background = 'rgba(139, 92, 246, 0.2)'}>GET SUPPORT</a>
                        <a href="https://instagram.com/mindease" target="_blank" rel="noreferrer" style={{ color: 'white', textDecoration: 'none', opacity: 0.5, transition: '0.3s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.5}>INSTAGRAM</a>
                        <a href="https://twitter.com/mindease" target="_blank" rel="noreferrer" style={{ color: 'white', textDecoration: 'none', opacity: 0.5, transition: '0.3s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.5}>TWITTER</a>
                    </div>
                    <div style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>NEURAL WELLNESS ECOSYSTEM • © 2026.</div>
                </footer>
            </div>
        </div>
    );
};

export default AboutUs;
