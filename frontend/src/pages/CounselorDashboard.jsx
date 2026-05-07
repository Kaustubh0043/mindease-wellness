import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, AlertTriangle, ShieldCheck, 
    MessageCircle, Calendar, Search, 
    Filter, ArrowUpRight, Heart
} from 'lucide-react';
import axios from 'axios';

const CounselorDashboard = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/support/all`);
                const tickets = response.data.map(t => ({
                    id: t.id,
                    name: t.studentName,
                    status: t.status === 'OPEN' ? 'High Risk' : t.status,
                    energy: 'Pending Analysis',
                    lastActive: new Date(t.createdAt).toLocaleTimeString(),
                    trigger: t.message
                }));
                setAlerts(tickets);
            } catch (e) {
                console.error("Overwatch Connection Failed", e);
            }
        };
        fetchTickets();
        const interval = setInterval(fetchTickets, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="counselor-space" style={{ padding: '4rem 2rem', background: '#020617', minHeight: '100vh', color: 'white' }}>
            <style>{`
                .counselor-header { margin-bottom: 4rem; }
                .portal-title { font-family: 'Playfair Display', serif; font-size: 4rem; margin-bottom: 1rem; }
                .risk-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 2rem; }
                .risk-card { 
                    grid-column: span 6; 
                    background: rgba(255,255,255,0.02); 
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 2.5rem; padding: 3rem;
                }
                .alert-pill {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    padding: 0.5rem 1rem;
                    border-radius: 2rem;
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 2px;
                }
                .action-btn {
                    background: #8b5cf6; color: white; border: none;
                    padding: 1rem 2rem; border-radius: 1rem; font-weight: 800;
                    cursor: pointer; transition: 0.3s;
                }
                .action-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3); }
            `}</style>

            <div className="counselor-header">
                <div style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.75rem', marginBottom: '1rem' }}>OVERWATCH • COUNSELOR PORTAL</div>
                <h1 className="portal-title">Intervention Grid</h1>
                <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px' }}>
                    Monitoring institutional wellness frequencies. Privacy consent is active for all identified high-risk nodes.
                </p>
            </div>

            <div className="risk-grid">
                <div className="risk-card" style={{ gridColumn: 'span 12', background: 'rgba(139, 92, 246, 0.05)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Active High-Risk Alerts</h3>
                            <p style={{ color: '#94a3b8' }}>Neural patterns indicating severe burnout or emotional distress.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 700 }}>02</div>
                                <div style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 800 }}>URGENT ACTION REQ.</div>
                            </div>
                            <AlertTriangle color="#ef4444" size={40} />
                        </div>
                    </div>
                </div>

                {alerts.map(alert => (
                    <motion.div 
                        key={alert.id} 
                        className="risk-card"
                        whileHover={{ y: -10 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <span className="alert-pill">{alert.status}</span>
                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>ID: {alert.name}</span>
                        </div>
                        <h4 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{alert.trigger}</h4>
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800 }}>ENERGY</div>
                                <div style={{ fontSize: '1.5rem', color: '#ef4444' }}>{alert.energy}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800 }}>LAST SYNC</div>
                                <div style={{ fontSize: '1.5rem' }}>{alert.lastActive}</div>
                            </div>
                        </div>
                        <button className="action-btn">INITIATE OUTREACH</button>
                    </motion.div>
                ))}

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
