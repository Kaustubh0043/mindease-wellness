import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, AlertTriangle, ShieldCheck, 
    MessageCircle, Calendar, Search, 
    Filter, ArrowUpRight, Heart, CheckCircle2, Clock
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CounselorDashboard = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);

    const fetchTickets = async () => {
        if (!user) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/support/all`, config);
            const tickets = response.data.map(t => {
                const message = t.message || '';
                const urgencyMatch = message.match(/^\[URGENCY: ([^\]]+)\]/);
                const urgency = urgencyMatch ? urgencyMatch[1] : 'LOW RISK';
                const cleanMessage = message.replace(/^\[URGENCY: [^\]]+\] - /, '');

                return {
                    id: t.id,
                    name: t.studentName,
                    email: t.studentEmail,
                    status: t.status, // OPEN, IN_PROGRESS, RESOLVED
                    urgency: urgency,
                    energy: urgency === 'HIGH RISK' ? '24% (CRITICAL)' : (urgency === 'MEDIUM RISK' ? '54% (STRESSED)' : '82% (STABLE)'),
                    lastActive: new Date(t.createdAt).toLocaleString(),
                    trigger: cleanMessage
                };
            });
            setAlerts(tickets);
        } catch (e) {
            console.error("Overwatch Connection Failed", e);
        }
    };

    useEffect(() => {
        fetchTickets();
        const interval = setInterval(fetchTickets, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [user]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.patch(`${import.meta.env.VITE_API_URL}/support/${id}/status?status=${newStatus}`, {}, config);
            alert(`CASE UPDATE: Ticket status successfully updated to ${newStatus}.`);
            fetchTickets();
        } catch (e) {
            console.error("Failed to update status", e);
            alert("Connection error: Unable to update case file.");
        }
    };

    const getUrgencyColor = (urgency) => {
        if (urgency === 'HIGH RISK') return '#ef4444';
        if (urgency === 'MEDIUM RISK') return '#f97316';
        return '#10b981';
    };

    const getStatusBadge = (status) => {
        if (status === 'OPEN') return { text: 'QUEUED', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
        if (status === 'IN_PROGRESS') return { text: 'IN OUTREACH', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' };
        return { text: 'RESOLVED', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    };

    return (
        <div className="counselor-space" style={{ padding: '4rem 2rem', background: '#020617', minHeight: '100vh', color: 'white' }}>
            <style>{`
                .counselor-header { margin-bottom: 4rem; }
                .portal-title { font-family: 'Playfair Display', serif; font-size: 4rem; margin-bottom: 1rem; }
                .risk-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 2.5rem; }
                .risk-card { 
                    grid-column: span 6; 
                    background: rgba(255,255,255,0.02); 
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 2.5rem; padding: 3rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    transition: all 0.4s;
                }
                .risk-card:hover {
                    border-color: rgba(139, 92, 246, 0.25);
                }
                .alert-pill {
                    padding: 0.5rem 1.25rem;
                    border-radius: 2rem;
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 2px;
                }
                .action-btn {
                    background: #8b5cf6; color: white; border: none;
                    padding: 1.25rem 2rem; border-radius: 1.25rem; font-weight: 900;
                    letter-spacing: 1px; cursor: pointer; transition: 0.3s;
                    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
                }
                .action-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3); }
                .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
            `}</style>

            <div className="counselor-header">
                <div style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.75rem', marginBottom: '1rem' }}>OVERWATCH • COUNSELOR PORTAL</div>
                <h1 className="portal-title">Intervention Grid</h1>
                <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px' }}>
                    Monitoring institutional wellness frequencies. Private counselor console for managing student outreach cases.
                </p>
            </div>

            <div className="risk-grid">
                <div className="risk-card" style={{ gridColumn: 'span 12', background: 'rgba(139, 92, 246, 0.05)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Active Support Tickets Queue</h3>
                            <p style={{ color: '#94a3b8' }}>Student-initiated support requests requiring cognitive or emotional intervention.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                                    {alerts.filter(a => a.status !== 'RESOLVED').length}
                                </div>
                                <div style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 800 }}>PENDING CASES</div>
                            </div>
                            <AlertTriangle color="#ef4444" size={40} />
                        </div>
                    </div>
                </div>

                {alerts.length === 0 ? (
                    <div className="risk-card" style={{ gridColumn: 'span 12', textAlign: 'center', padding: '6rem 0', color: '#475569' }}>
                        <CheckCircle2 size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
                        <h4 style={{ fontSize: '1.2rem', color: '#94a3b8' }}>All Clear</h4>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>No student outreach tickets currently in queue.</p>
                    </div>
                ) : (
                    alerts.map(alert => {
                        const badge = getStatusBadge(alert.status);
                        return (
                            <motion.div 
                                key={alert.id} 
                                className="risk-card"
                                whileHover={{ y: -5 }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                        <span className="alert-pill" style={{ color: badge.color, background: badge.bg, border: `1px solid ${badge.color}33` }}>
                                            {badge.text}
                                        </span>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: getUrgencyColor(alert.urgency), letterSpacing: '2px' }}>
                                            {alert.urgency}
                                        </span>
                                    </div>
                                    
                                    <div style={{ marginBottom: '2rem' }}>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                            Student Node: {alert.name} ({alert.email})
                                        </div>
                                        <h4 style={{ fontSize: '1.35rem', lineHeight: '1.6', fontWeight: 500, color: '#cbd5e1' }}>
                                            "{alert.trigger}"
                                        </h4>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '2rem', marginBottom: '2.5rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>ESTIMATED BASICS</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: alert.urgency === 'HIGH RISK' ? '#ef4444' : '#cbd5e1', marginTop: '0.25rem' }}>
                                                {alert.energy}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>SUBMITTED AT</div>
                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={12} /> {alert.lastActive}
                                            </div>
                                        </div>
                                    </div>

                                    {alert.status === 'OPEN' && (
                                        <button 
                                            className="action-btn"
                                            onClick={() => handleStatusUpdate(alert.id, 'IN_PROGRESS')}
                                        >
                                            INITIATE OUTREACH <ArrowUpRight size={16} />
                                        </button>
                                    )}

                                    {alert.status === 'IN_PROGRESS' && (
                                        <button 
                                            className="action-btn"
                                            style={{ background: '#10b981' }}
                                            onClick={() => handleStatusUpdate(alert.id, 'RESOLVED')}
                                        >
                                            CLOSE CASE & RESOLVE <CheckCircle2 size={16} />
                                        </button>
                                    )}

                                    {alert.status === 'RESOLVED' && (
                                        <button 
                                            className="action-btn"
                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
                                            disabled
                                        >
                                            CASE ARCHIVED & RESOLVED <CheckCircle2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                )}

                <div className="risk-card" style={{ gridColumn: 'span 12' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem' }}>Global Sentiment Distribution</h3>
                        <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800 }}>
                            <span>FILTER BY YEAR</span>
                            <Filter size={16} />
                        </div>
                    </div>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '3rem' }}>
                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                            <div key={i} style={{ flex: 1, background: '#8b5cf6', height: `${h}%`, borderRadius: '1rem 1rem 0 0', opacity: 0.2 + (h/100) }}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CounselorDashboard;
