import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, Brain, Activity, User, 
    LogOut, Settings, MessageSquare, Shield, Bell, Info, Circle, Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, baselines } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const hasNotification = !baselines.calibrationComplete;

    const navItems = user?.role === 'ADMIN' ? [
        { path: '/admin', icon: <Shield size={18} />, label: 'COMMAND' },
        { path: '/profile', icon: <User size={18} />, label: 'IDENTITY' },
    ] : user?.role === 'COUNSELOR' ? [
        { path: '/counselor', icon: <Shield size={18} />, label: 'OVERWATCH' },
        { path: '/profile', icon: <User size={18} />, label: 'IDENTITY' },
    ] : [
        { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'OVERVIEW' },
        { path: '/mood-tracker', icon: <Activity size={18} />, label: 'SENSORS' },
        { path: '/pulse', icon: <Wind size={18} />, label: 'PULSE' },
        { path: '/journal', icon: <MessageSquare size={18} />, label: 'REFLECTIONS' },
        { path: '/profile', icon: <User size={18} />, label: 'PROFILE' },
    ];

    return (
        <nav className="ghost-sidebar">
            <style>{`
                .ghost-sidebar {
                    width: 280px; height: 100vh; position: fixed; left: 0; top: 0;
                    padding: 3rem 2.5rem; display: flex; flex-direction: column;
                    z-index: 100; border-right: 1px solid rgba(255,255,255,0.03);
                    background: rgba(2, 6, 23, 0.4); backdrop-filter: blur(40px);
                }
                .sidebar-logo {
                    font-family: 'Outfit'; font-weight: 800; font-size: 1.25rem;
                    letter-spacing: 4px; margin-bottom: 4rem; color: white;
                    text-decoration: none;
                }
                .nav-group { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
                
                .nav-link {
                    display: flex; align-items: center; gap: 1.25rem;
                    padding: 1.25rem 1.5rem; text-decoration: none;
                    color: #64748b; font-weight: 800; font-size: 0.7rem;
                    letter-spacing: 2px; border-radius: 1.25rem;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .nav-link.active {
                    color: white; background: rgba(139, 92, 246, 0.1);
                    border: 1px solid rgba(139, 92, 246, 0.2);
                }
                .nav-link:hover:not(.active) {
                    color: #94a3b8; transform: translateX(5px);
                }
                
                .util-btn {
                    display: flex; align-items: center; gap: 1.25rem;
                    padding: 1.25rem 1.5rem; color: #64748b; font-weight: 800; 
                    font-size: 0.7rem; letter-spacing: 2px; border-radius: 1.25rem;
                    cursor: pointer; transition: 0.3s; position: relative;
                }
                .util-btn:hover { color: white; background: rgba(255,255,255,0.03); }

                .notif-badge {
                    position: absolute; top: 1.2rem; right: 1.5rem;
                    width: 8px; height: 8px; background: #8b5cf6;
                    border-radius: 50%; box-shadow: 0 0 10px #8b5cf6;
                }

                .notif-dropdown {
                    position: absolute; left: 280px; bottom: 100px;
                    width: 320px; background: #0f172a; border: 1px solid rgba(139, 92, 246, 0.2);
                    border-radius: 2rem; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    z-index: 1000;
                }

                .logout-btn {
                    margin-top: 2rem; display: flex; align-items: center; gap: 1.25rem;
                    padding: 1.5rem; color: #ef4444; font-weight: 800; font-size: 0.7rem;
                    letter-spacing: 2px; border: none; background: transparent;
                    cursor: pointer; opacity: 0.6; transition: 0.3s;
                }
                .logout-btn:hover { opacity: 1; }
            `}</style>

            <Link to="/" className="sidebar-logo">MINDEASE</Link>
            
            <div className="nav-group">
                {navItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}


                <div className="util-btn" onClick={() => setShowNotifications(!showNotifications)}>
                    <Bell size={18} />
                    <span>ALERTS</span>
                    {hasNotification && <div className="notif-badge" />}
                </div>

                <AnimatePresence>
                    {showNotifications && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="notif-dropdown"
                        >
                            <h4 style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#8b5cf6', marginBottom: '1.5rem' }}>NEURAL ALERTS</h4>
                            {hasNotification ? (
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.8rem', marginBottom: '0.5rem' }}>Calibration Required</div>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '1rem' }}>
                                        Your energy baseline is at default (88%). Complete the Q/A assessment for accurate tracking.
                                    </p>
                                    <Link to="/calibration" onClick={() => setShowNotifications(false)} style={{ color: '#8b5cf6', fontSize: '0.7rem', fontWeight: 800, textDecoration: 'none' }}>
                                        START TEST →
                                    </Link>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b', fontSize: '0.8rem' }}>
                                    No pending neural calibrations.
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} />
                <span>TERMINATE</span>
            </button>
        </nav>
    );
};

export default Navbar;
