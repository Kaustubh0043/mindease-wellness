import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Users, Shield, Trash2, Activity, Globe, Search, MessageSquare, Heart, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [moods, setMoods] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalMoods: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('identities');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const [usersRes, statsRes, moodsRes, suggRes, ticketsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/admin/moods`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/public/suggestions`),
                axios.get(`${import.meta.env.VITE_API_URL}/api/support/all`)
            ]);
            
            setUsers(usersRes.data);
            setStats(statsRes.data);
            setMoods(moodsRes.data);
            setSuggestions(suggRes.data);
            setTickets(ticketsRes.data);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('TERMINATE IDENTITY: Are you sure?')) return;
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            await axios.delete(`${import.meta.env.VITE_API_URL}/admin/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error('Termination failed:', error);
        }
    };

    const updateTicketStatus = async (id, status) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/support/${id}/status?status=${status}`);
            fetchData();
        } catch (error) {
            console.error('Status update failed:', error);
        }
    };

    return (
        <div className="dashboard-space" style={{ minHeight: '100vh', background: '#020617', color: 'white', padding: '6rem 2rem' }}>
            <div className="liquid-bg" style={{ position: 'fixed', inset: 0, background: 'url("/liquid.png") no-repeat center/cover', opacity: 0.2, zIndex: 0 }} />
            
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="status-tag" style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.7rem' }}>INSTITUTIONAL OVERWATCH</div>
                    <h1 style={{ fontFamily: 'Playfair Display', fontSize: '4rem', margin: '1rem 0 3rem' }}>Control<br/><span style={{ fontStyle: 'italic', fontWeight: 400 }}>Center</span>.</h1>
                </motion.div>

                {/* Global Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
                    {[
                        { label: 'TOTAL IDENTITIES', value: stats.totalUsers || 0, icon: <Users /> },
                        { label: 'MOOD LOGS', value: stats.totalMoods || 0, icon: <Activity /> },
                        { label: 'NEURAL UPTIME', value: '99.9%', icon: <Globe /> },
                        { label: 'SYSTEM STATUS', value: 'NOMINAL', icon: <Shield /> }
                    ].map((s, i) => (
                        <div key={i} className="luxury-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2rem' }}>
                            <div style={{ color: '#8b5cf6', marginBottom: '1rem' }}>{s.icon}</div>
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '2px', color: '#64748b' }}>{s.label}</div>
                            <div style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                    {['identities', 'neural-logs', 'tickets', 'suggestions'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ 
                                background: 'none', border: 'none', color: activeTab === tab ? '#8b5cf6' : '#64748b',
                                fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', cursor: 'pointer',
                                paddingBottom: '1rem', borderBottom: activeTab === tab ? '2px solid #8b5cf6' : 'none'
                            }}
                        >
                            {tab.toUpperCase().replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {activeTab === 'identities' ? (
                    <div className="luxury-card" style={{ padding: '0', overflow: 'hidden', background: 'rgba(2, 6, 23, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2.5rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
                                <tr>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.65rem', letterSpacing: '2px', color: '#8b5cf6' }}>IDENTITY</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.65rem', letterSpacing: '2px', color: '#8b5cf6' }}>AUTHORITY</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.65rem', letterSpacing: '2px', color: '#8b5cf6' }}>EMAIL</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.65rem', letterSpacing: '2px', color: '#8b5cf6' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '35px', height: '35px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#8b5cf6' }}>
                                                    {u.name.charAt(0)}
                                                </div>
                                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <span style={{ 
                                                padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 800,
                                                background: u.role === 'ADMIN' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.05)',
                                                color: u.role === 'ADMIN' ? '#8b5cf6' : '#64748b',
                                                border: '1px solid rgba(255,255,255,0.05)'
                                            }}>{u.role}</span>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.9rem' }}>{u.email}</td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <button onClick={() => deleteUser(u.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.5 }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.5}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'tickets' ? (
                    <div className="luxury-card" style={{ padding: '0', overflow: 'hidden', background: 'rgba(2, 6, 23, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2.5rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
                                <tr>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.65rem', letterSpacing: '2px', color: '#8b5cf6' }}>STUDENT</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.65rem', letterSpacing: '2px', color: '#8b5cf6' }}>ISSUE REPORTED</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.65rem', letterSpacing: '2px', color: '#8b5cf6' }}>STATUS</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.65rem', letterSpacing: '2px', color: '#8b5cf6' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((t) => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.studentName}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.studentEmail}</div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem', color: '#94a3b8', fontSize: '0.85rem', maxWidth: '400px' }}>{t.message}</td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <span style={{ 
                                                padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 800,
                                                background: t.status === 'OPEN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                color: t.status === 'OPEN' ? '#ef4444' : '#10b981',
                                                border: '1px solid rgba(255,255,255,0.05)'
                                            }}>{t.status}</span>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            {t.status === 'OPEN' && (
                                                <button 
                                                    onClick={() => updateTicketStatus(t.id, 'RESOLVED')}
                                                    style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8b5cf6', color: 'white', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer' }}
                                                >
                                                    RESOLVE
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {tickets.length === 0 && (
                                    <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>No support tickets currently logged in the grid.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'neural-logs' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {moods.length > 0 ? moods.map((m, i) => (
                            <div key={i} className="luxury-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6' }}>
                                        <Heart size={16} />
                                        <span style={{ fontWeight: 800, fontSize: '0.7rem' }}>{m.moodType}</span>
                                    </div>
                                    <div style={{ color: '#475569', fontSize: '0.65rem' }}>{new Date(m.createdAt).toLocaleDateString()}</div>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic' }}>"{m.note || 'No resonance notes recorded.'}"</p>
                                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.7rem' }}>
                                    <Users size={12} /> ID: {m.user?.name || 'Anonymous'}
                                </div>
                            </div>
                        )) : (
                            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '4rem', color: '#475569' }}>
                                <Clock size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>No neural resonance logs found in the grid yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {suggestions.map((s, i) => (
                            <div key={i} className="luxury-card" style={{ padding: '2rem', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: '2rem' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '2px', color: '#8b5cf6', marginBottom: '1rem' }}>{s.category || 'GENERAL'}</div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{s.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{s.content}</p>
                            </div>
                        ))}
                        <button className="luxury-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(139, 92, 246, 0.3)', background: 'transparent', cursor: 'pointer' }}>
                            <div style={{ textAlign: 'center' }}>
                                <Sparkles color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6' }}>DEPLOY NEW RESOURCE</div>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
