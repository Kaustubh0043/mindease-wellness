import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
    Heart, Phone, Send, Check, Loader2, Sparkles, 
    Waves, Compass, Eye, ShieldAlert, AlertCircle, HelpCircle, Shield
} from 'lucide-react';
import axios from 'axios';
import { getEmpatheticSupport } from '../services/aiService';

const SupportCenter = () => {
    const { user } = useAuth();
    
    // AI Vent State
    const [vent, setVent] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isAILoading, setIsAILoading] = useState(false);
    
    // Grounding Tool State
    const [groundingStep, setGroundingStep] = useState(0); // 0: intro, 1: see, 2: touch, 3: hear, 4: smell, 5: taste, 6: done
    const [seeItems, setSeeItems] = useState(['', '', '', '', '']);
    const [touchItems, setTouchItems] = useState(['', '', '', '']);
    const [hearItems, setHearItems] = useState(['', '', '']);
    const [smellItems, setSmellItems] = useState(['', '']);
    const [tasteItem, setTasteItem] = useState('');
    
    // Tickets State
    const [tickets, setTickets] = useState([]);
    const [ticketMessage, setTicketMessage] = useState('');
    const [urgency, setUrgency] = useState('Low Risk');
    const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
    const [ticketError, setTicketError] = useState('');

    const fetchMyTickets = async () => {
        if (!user) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/support/my-tickets`, config);
            setTickets(res.data);
        } catch (err) {
            console.error("Failed to load tickets", err);
        }
    };

    useEffect(() => {
        fetchMyTickets();
        const timer = setInterval(fetchMyTickets, 10000);
        return () => clearInterval(timer);
    }, [user]);

    const handleVentSubmit = async (e) => {
        e.preventDefault();
        if (!vent.trim()) return;
        setIsAILoading(true);
        setAiResponse('');
        try {
            const res = await getEmpatheticSupport(vent, user?.name || 'Student');
            setAiResponse(res);
        } catch (err) {
            setAiResponse("I'm here for you. Even though my connection to the intelligence grid failed, please take a slow breath. You are not alone.");
        } finally {
            setIsAILoading(false);
        }
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        if (!ticketMessage.trim()) return;
        setIsSubmittingTicket(true);
        setTicketError('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Format the message with the urgency tag so the Counselor's Intervention Grid displays it properly
            const formattedMessage = `[URGENCY: ${urgency.toUpperCase()}] - ${ticketMessage}`;
            
            await axios.post(`${import.meta.env.VITE_API_URL}/support/create`, {
                studentName: user.name,
                studentEmail: user.email,
                message: formattedMessage,
            }, config);
            
            setTicketMessage('');
            setUrgency('Low Risk');
            alert('SUPPORT REQUEST SENT: The wellness team has been alerted. We are here to support you.');
            fetchMyTickets();
        } catch (err) {
            setTicketError('Handshake failed. Unable to register support request.');
        } finally {
            setIsSubmittingTicket(false);
        }
    };

    const resetGrounding = () => {
        setGroundingStep(0);
        setSeeItems(['', '', '', '', '']);
        setTouchItems(['', '', '', '']);
        setHearItems(['', '', '']);
        setSmellItems(['', '']);
        setTasteItem('');
    };

    const getStatusStyle = (status) => {
        if (status === 'OPEN') return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' };
        if (status === 'IN_PROGRESS') return { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)' };
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' };
    };

    const crisisLines = [
        { name: "National Crisis Line", phone: "988", desc: "Free, confidential 24/7 support for suicide & mental health distress." },
        { name: "Student Support Helpline", phone: "1-800-273-8255", desc: "Dedicated counseling network for university and high school students." },
        { name: "MindEase Campus Response Desk", phone: "Ext. 9110", desc: "Local institutional emergency response and counselor dispatch." }
    ];

    return (
        <div className="support-center">
            <style>{`
                .support-center {
                    padding-top: 2rem;
                    color: white;
                    font-family: 'Outfit', sans-serif;
                    padding-bottom: 6rem;
                }
                .section-header {
                    margin-bottom: 3.5rem;
                }
                .section-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                }
                .section-subtitle {
                    color: #64748b;
                    font-size: 1.1rem;
                }
                .flex-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    margin-bottom: 4rem;
                }
                @media (max-width: 900px) {
                    .flex-grid { grid-template-columns: 1fr; }
                }
                .glass-panel {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 3rem;
                    padding: 3rem;
                    transition: border-color 0.4s;
                }
                .glass-panel:hover {
                    border-color: rgba(139, 92, 246, 0.25);
                }
                .panel-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .vent-textarea {
                    width: 100%;
                    min-height: 120px;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1.5rem;
                    padding: 1.25rem;
                    color: white;
                    outline: none;
                    font-family: inherit;
                    font-size: 1rem;
                    resize: none;
                    transition: border-color 0.3s;
                }
                .vent-textarea:focus {
                    border-color: #8b5cf6;
                }
                .submit-btn {
                    background: #8b5cf6;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 1.25rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s;
                }
                .submit-btn:hover:not(:disabled) {
                    background: #7c3aed;
                    transform: translateY(-2px);
                }
                .submit-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .ai-bubble-box {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%);
                    border: 1px solid rgba(139, 92, 246, 0.2);
                    border-radius: 2rem;
                    padding: 2rem;
                    margin-top: 2rem;
                    line-height: 1.7;
                    font-size: 1rem;
                    color: #cbd5e1;
                }
                .grounding-box {
                    min-height: 320px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .grounding-inputs {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                    margin: 1.5rem 0;
                }
                .grounding-input {
                    background: rgba(0, 0, 0, 0.2);
                    border: none;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0.75rem 0.5rem;
                    color: white;
                    outline: none;
                    font-size: 1.1rem;
                    transition: border-color 0.3s;
                }
                .grounding-input:focus {
                    border-bottom-color: #8b5cf6;
                }
                .crisis-card {
                    background: rgba(239, 68, 68, 0.02);
                    border: 1px solid rgba(239, 68, 68, 0.05);
                    border-radius: 2rem;
                    padding: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s;
                }
                .crisis-card:hover {
                    border-color: rgba(239, 68, 68, 0.2);
                    background: rgba(239, 68, 68, 0.04);
                }
                .crisis-btn {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    padding: 0.75rem 1.5rem;
                    border-radius: 1rem;
                    font-weight: 800;
                    text-decoration: none;
                    transition: all 0.3s;
                }
                .crisis-btn:hover {
                    background: #ef4444;
                    color: white;
                }
                .ticket-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .form-group label {
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 2px;
                    color: #64748b;
                    text-transform: uppercase;
                }
                .form-select {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1rem;
                    padding: 1rem;
                    color: white;
                    outline: none;
                }
                .form-select option {
                    background: #020617;
                    color: white;
                }
                .ticket-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                }
                .ticket-status-pill {
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                    padding: 0.4rem 1rem;
                    border-radius: 2rem;
                }
            `}</style>

            <div className="section-header">
                <span style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>Clinical Support & Safety</span>
                <h1 className="section-title">Safety Harbor</h1>
                <p className="section-subtitle">A dedicated space for heavy emotions, panic desync, and direct counselor intervention.</p>
            </div>

            <div className="flex-grid">
                {/* AI Vent Space Panel */}
                <div className="glass-panel">
                    <h3 className="panel-title">
                        <Sparkles size={22} style={{ color: '#8b5cf6' }} /> Empathic Vent Space
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                        Type whatever you're going through, no matter how dark or overwhelming. This space is confidential. The AI will listen, validate your thoughts, and suggest tiny, stress-free tasks to break the loop.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(139, 92, 246, 0.05)', padding: '1rem 1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(139, 92, 246, 0.15)', marginBottom: '2rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                        <Shield size={16} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                        <span><strong>Shield Active:</strong> Your inputs are processed anonymously. Conversations are strictly in-memory and never saved to the database.</span>
                    </div>
                    <form onSubmit={handleVentSubmit}>
                        <textarea 
                            className="vent-textarea"
                            value={vent}
                            onChange={(e) => setVent(e.target.value)}
                            placeholder="I feel exhausted and sad because..."
                            required
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button className="submit-btn" type="submit" disabled={isAILoading || !vent.trim()}>
                                {isAILoading ? (
                                    <>
                                        <Loader2 className="spin" size={18} /> GENERATING COMFORT...
                                    </>
                                ) : (
                                    <>
                                        VENT TO AI <Send size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <AnimatePresence>
                        {aiResponse && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="ai-bubble-box"
                            >
                                {aiResponse}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Grounding Exercise Panel */}
                <div className="glass-panel">
                    <h3 className="panel-title">
                        <Compass size={22} style={{ color: '#8b5cf6' }} /> Grounding Protocol (5-4-3-2-1)
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                        If you are experiencing panic, severe sadness, or feel detached, try this sensory calibration test to return to the present moment.
                    </p>

                    <div className="grounding-box">
                        {groundingStep === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <Waves size={50} style={{ color: '#8b5cf6', animation: 'pulse 2s infinite', marginBottom: '2rem' }} />
                                <h4 style={{ fontSize: '1.4rem', fontFamily: 'Playfair Display', marginBottom: '1rem' }}>Anchoring Exercise</h4>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2.5rem' }}>A clinical technique to slow down racing thoughts by engaging your physical senses.</p>
                                <button className="submit-btn" style={{ margin: '0 auto' }} onClick={() => setGroundingStep(1)}>START GROUNDING</button>
                            </motion.div>
                        )}

                        {groundingStep === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6', letterSpacing: '2px' }}>STEP 01 — VISION</div>
                                <h4 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display', margin: '0.5rem 0' }}>Name 5 things you can SEE</h4>
                                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Look around you. Identify 5 physical objects in your current environment.</p>
                                <div className="grounding-inputs">
                                    {seeItems.map((val, idx) => (
                                        <input 
                                            key={idx} 
                                            className="grounding-input" 
                                            placeholder={`Object ${idx + 1}`}
                                            value={val}
                                            onChange={(e) => {
                                                const copy = [...seeItems];
                                                copy[idx] = e.target.value;
                                                setSeeItems(copy);
                                            }}
                                        />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer' }} onClick={resetGrounding}>RESET</button>
                                    <button className="submit-btn" disabled={seeItems.some(x => !x.trim())} onClick={() => setGroundingStep(2)}>NEXT STEP</button>
                                </div>
                            </motion.div>
                        )}

                        {groundingStep === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6', letterSpacing: '2px' }}>STEP 02 — TOUCH</div>
                                <h4 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display', margin: '0.5rem 0' }}>Name 4 things you can TOUCH</h4>
                                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Acknowledge 4 things you can physically feel (e.g. the fabric of your clothes, the desk, the cool air).</p>
                                <div className="grounding-inputs">
                                    {touchItems.map((val, idx) => (
                                        <input 
                                            key={idx} 
                                            className="grounding-input" 
                                            placeholder={`Sensation ${idx + 1}`}
                                            value={val}
                                            onChange={(e) => {
                                                const copy = [...touchItems];
                                                copy[idx] = e.target.value;
                                                setTouchItems(copy);
                                            }}
                                        />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer' }} onClick={() => setGroundingStep(1)}>BACK</button>
                                    <button className="submit-btn" disabled={touchItems.some(x => !x.trim())} onClick={() => setGroundingStep(3)}>NEXT STEP</button>
                                </div>
                            </motion.div>
                        )}

                        {groundingStep === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6', letterSpacing: '2px' }}>STEP 03 — SOUND</div>
                                <h4 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display', margin: '0.5rem 0' }}>Name 3 things you can HEAR</h4>
                                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Listen closely. Identify 3 distinct background sounds (e.g. a fan humming, distant cars, birds chirping).</p>
                                <div className="grounding-inputs">
                                    {hearItems.map((val, idx) => (
                                        <input 
                                            key={idx} 
                                            className="grounding-input" 
                                            placeholder={`Sound ${idx + 1}`}
                                            value={val}
                                            onChange={(e) => {
                                                const copy = [...hearItems];
                                                copy[idx] = e.target.value;
                                                setHearItems(copy);
                                            }}
                                        />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer' }} onClick={() => setGroundingStep(2)}>BACK</button>
                                    <button className="submit-btn" disabled={hearItems.some(x => !x.trim())} onClick={() => setGroundingStep(4)}>NEXT STEP</button>
                                </div>
                            </motion.div>
                        )}

                        {groundingStep === 4 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6', letterSpacing: '2px' }}>STEP 04 — SCENT</div>
                                <h4 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display', margin: '0.5rem 0' }}>Name 2 things you can SMELL</h4>
                                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Inhale deeply. Can you notice 2 smells (e.g. soap, paper, coffee, fresh rain)?</p>
                                <div className="grounding-inputs">
                                    {smellItems.map((val, idx) => (
                                        <input 
                                            key={idx} 
                                            className="grounding-input" 
                                            placeholder={`Scent ${idx + 1}`}
                                            value={val}
                                            onChange={(e) => {
                                                const copy = [...smellItems];
                                                copy[idx] = e.target.value;
                                                setSmellItems(copy);
                                            }}
                                        />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer' }} onClick={() => setGroundingStep(3)}>BACK</button>
                                    <button className="submit-btn" disabled={smellItems.some(x => !x.trim())} onClick={() => setGroundingStep(5)}>NEXT STEP</button>
                                </div>
                            </motion.div>
                        )}

                        {groundingStep === 5 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6', letterSpacing: '2px' }}>STEP 05 — TASTE</div>
                                <h4 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display', margin: '0.5rem 0' }}>Name 1 thing you can TASTE</h4>
                                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>What is 1 taste in your mouth, or perhaps the taste of a sip of water or tea?</p>
                                <div className="grounding-inputs">
                                    <input 
                                        className="grounding-input" 
                                        placeholder="Taste sensation"
                                        value={tasteItem}
                                        onChange={(e) => setTasteItem(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer' }} onClick={() => setGroundingStep(4)}>BACK</button>
                                    <button className="submit-btn" disabled={!tasteItem.trim()} onClick={() => setGroundingStep(6)}>COMPLETE</button>
                                </div>
                            </motion.div>
                        )}

                        {groundingStep === 6 && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                                    <Check size={36} />
                                </div>
                                <h4 style={{ fontSize: '1.6rem', fontFamily: 'Playfair Display', marginBottom: '1rem' }}>Grounding Complete</h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                                    You have checked in with all 5 senses. You are connected to your body, here, in the physical room. You are safe. Take one final deep breath.
                                </p>
                                <button className="submit-btn" style={{ margin: '0 auto' }} onClick={resetGrounding}>DO IT AGAIN</button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Helpline Directory */}
            <div style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldAlert size={26} style={{ color: '#ef4444' }} /> Immediate Emergency Resources
                </h3>
                <p style={{ color: '#64748b', marginBottom: '2.5rem', maxWidth: '800px' }}>
                    If you are in immediate danger of hurting yourself or others, please use these free resources to speak with a trained professional.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {crisisLines.map((line, idx) => (
                        <div key={idx} className="crisis-card">
                            <div>
                                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', marginBottom: '0.25rem' }}>{line.name}</h4>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{line.desc}</p>
                            </div>
                            <a href={`tel:${line.phone.replace(/[^0-9]/g, '')}`} className="crisis-btn">
                                CALL {line.phone}
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Counseling Tickets Console */}
            <div className="glass-panel" style={{ marginTop: '4rem' }}>
                <h3 className="panel-title">
                    <Heart size={22} style={{ color: '#8b5cf6' }} /> Counseling Outreach Request
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                    Need personal counseling? Submit a confidential request. A mental health counselor from the university wellness department will reach out directly. You can monitor request statuses below.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3.5rem', marginTop: '2.5rem' }}>
                    {/* Submission Form */}
                    <form onSubmit={handleTicketSubmit} className="ticket-form">
                        <div className="form-group">
                            <label>Request Urgency</label>
                            <select 
                                className="form-select" 
                                value={urgency}
                                onChange={(e) => setUrgency(e.target.value)}
                            >
                                <option value="Low Risk">Low Risk - Routine Check-in / Guidance</option>
                                <option value="Medium Risk">Medium Risk - High Stress / Anxiety</option>
                                <option value="High Risk">High Risk - Urgent Counseling Required</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Explain what you are going through</label>
                            <textarea 
                                className="vent-textarea"
                                style={{ minHeight: '140px' }}
                                value={ticketMessage}
                                onChange={(e) => setTicketMessage(e.target.value)}
                                placeholder="I would like to speak to a counselor because I'm struggling with academic pressure and feeling depressed lately..."
                                required
                            />
                        </div>

                        {ticketError && <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>{ticketError}</div>}

                        <button className="submit-btn" type="submit" disabled={isSubmittingTicket || !ticketMessage.trim()}>
                            {isSubmittingTicket ? (
                                <>
                                    <Loader2 className="spin" size={18} /> REGISTERING REQUEST...
                                </>
                            ) : (
                                <>
                                    SUBMIT REQUEST <Check size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Request History Tracker */}
                    <div>
                        <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Request Status Queue</h4>
                        
                        <div style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2rem', overflow: 'hidden', background: 'rgba(0,0,0,0.1)' }}>
                            {tickets.length === 0 ? (
                                <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#475569' }}>
                                    <HelpCircle size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <div>No active outreach requests.</div>
                                </div>
                            ) : (
                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {tickets.map((t) => {
                                        const statusStyle = getStatusStyle(t.status);
                                        // Strip the urgency tag to present clean message to student
                                        const displayMsg = t.message.replace(/^\[URGENCY: [^\]]+\] - /, '');
                                        const urgencyMatch = t.message.match(/^\[URGENCY: ([^\]]+)\]/);
                                        const urgencyLabel = urgencyMatch ? urgencyMatch[1] : 'LOW RISK';

                                        return (
                                            <div key={t.id} className="ticket-row">
                                                <div style={{ flex: 1, paddingRight: '1.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                        <span style={{ fontSize: '0.6rem', fontWeight: 800, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                                            {urgencyLabel}
                                                        </span>
                                                        <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                                                            {new Date(t.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.9rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                                                        {displayMsg}
                                                    </p>
                                                </div>
                                                <span 
                                                    className="ticket-status-pill"
                                                    style={{ color: statusStyle.color, background: statusStyle.bg, border: statusStyle.border }}
                                                >
                                                    {t.status === 'OPEN' ? 'QUEUED' : t.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportCenter;
