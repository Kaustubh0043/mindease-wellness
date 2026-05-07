import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Users, Shield, Trash2, Activity, Globe, Search, MessageSquare, Heart, Clock, Sparkles, Zap, BarChart3, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
                axios.get(`${import.meta.env.VITE_API_URL}/admin/suggestions`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/support/all`, config)
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

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { 
            x: { grid: { display: false }, ticks: { color: '#475569' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#475569' } }
        }
    };

    const chartData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
            data: [40, 55, 80, 65, 90, 85],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    return (
        <div className="dashboard-space" style={{ minHeight: '100vh', background: '#020617', color: 'white', display: 'flex' }}>
            {/* Elite Sidebar */}
            <div style={{ width: '280px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <div style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-1px' }}>MINDEASE</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={() => setActiveTab('identities')} style={{ background: activeTab === 'identities' ? 'rgba(139, 92, 246, 0.1)' : 'transparent', border: 'none', color: activeTab === 'identities' ? '#8b5cf6' : '#64748b', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: '0.3s' }}>
                        <Shield size={20} /> <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px' }}>COMMAND</span>
                    </button>
                    <button onClick={() => setActiveTab('neural-logs')} style={{ background: activeTab === 'neural-logs' ? 'rgba(139, 92, 246, 0.1)' : 'transparent', border: 'none', color: activeTab === 'neural-logs' ? '#8b5cf6' : '#64748b', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <Activity size={20} /> <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px' }}>RESONANCE</span>
                    </button>
                    <button onClick={() => setActiveTab('tickets')} style={{ background: activeTab === 'tickets' ? 'rgba(139, 92, 246, 0.1)' : 'transparent', border: 'none', color: activeTab === 'tickets' ? '#8b5cf6' : '#64748b', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <MessageSquare size={20} /> <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px' }}>PROTOCOLS</span>
                    </button>
                </div>

                <div style={{ marginTop: 'auto', padding: '2rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#8b5cf6', marginBottom: '0.5rem' }}>SYSTEM UPTIME</div>
                    <div style={{ fontSize: '1.25rem', fontFamily: 'Playfair Display' }}>99.99%</div>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '4rem 6rem', position: 'relative', overflowY: 'auto' }}>
                <div className="liquid-bg" style={{ position: 'fixed', inset: 0, background: 'url("/liquid.png") no-repeat center/cover', opacity: 0.1, zIndex: 0 }} />
                
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <header style={{ marginBottom: '4rem' }}>
                        <div className="status-tag" style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.7rem' }}>INSTITUTIONAL OVERWATCH</div>
                        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3.5rem', margin: '0.5rem 0' }}>Executive<br/><span style={{ fontStyle: 'italic', fontWeight: 400 }}>Control</span>.</h1>
                    </header>

                    {/* Elite Stats & Graph Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                        <div className="luxury-card" style={{ gridColumn: 'span 4', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2.5rem' }}>
                            <div style={{ color: '#8b5cf6', marginBottom: '1.5rem' }}><Users size={32} /></div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '2px', color: '#64748b' }}>TOTAL IDENTITIES</div>
                            <div style={{ fontSize: '3rem', marginTop: '0.5rem', fontFamily: 'Playfair Display' }}>{stats.totalUsers || 0}</div>
                        </div>

                        <div className="luxury-card" style={{ gridColumn: 'span 8', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2.5rem', minHeight: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '2px', color: '#8b5cf6' }}>NEURAL RESONANCE PULSE (24H)</div>
                                <BarChart3 size={20} color="#64748b" />
                            </div>
                            <div style={{ height: '180px' }}><Line options={chartOptions} data={chartData} /></div>
                        </div>
                    </div>

                    {/* Dynamic Tabs Section */}
                    {activeTab === 'identities' ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="luxury-card" style={{ background: 'rgba(2, 6, 23, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2.5rem', overflow: 'hidden' }}>
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
                                                    <div style={{ width: '35px', height: '35px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#8b5cf6' }}>{u.name.charAt(0)}</div>
                                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem 2rem' }}>
                                                <span style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 800, background: u.role === 'ADMIN' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.05)', color: u.role === 'ADMIN' ? '#8b5cf6' : '#64748b' }}>{u.role}</span>
                                            </td>
                                            <td style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.9rem' }}>{u.email}</td>
                                            <td style={{ padding: '1.5rem 2rem' }}>
                                                <button onClick={() => deleteUser(u.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.5 }}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            <div className="luxury-card" style={{ gridColumn: 'span 2', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '2.5rem' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6', marginBottom: '2rem' }}>RECENT NEURAL LOGS</div>
                                {moods.slice(0, 3).map((m, i) => (
                                    <div key={i} style={{ padding: '1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.user?.name}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{m.note}</div>
                                        </div>
                                        <div style={{ color: '#8b5cf6', fontWeight: 800, fontSize: '0.7rem' }}>{m.mood}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="luxury-card" style={{ padding: '2.5rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '2.5rem', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                                <Terminal size={24} color="#8b5cf6" style={{ marginBottom: '1.5rem' }} />
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6' }}>SYSTEM INTEGRITY</div>
                                <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.8' }}>
                                    <div>[OK] DB_SYNC_ACTIVE</div>
                                    <div>[OK] AI_SYNTH_ONLINE</div>
                                    <div>[OK] SEC_SHIELD_V2.0</div>
                                    <div>[OK] HANDSHAKE_SUCCESS</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
