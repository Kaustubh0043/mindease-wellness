import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, Brain, Activity, User, 
    LogOut, Settings, MessageSquare, Shield, Bell, Info, Circle, Wind, Heart,
    Menu, X, Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout, baselines } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    useEffect(() => {
        const audio = document.getElementById('neural-audio-driver');
        if (!audio) return;

        const handlePlay = () => setIsAudioPlaying(true);
        const handlePause = () => setIsAudioPlaying(false);

        setIsAudioPlaying(!audio.paused);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, []);

    const toggleGlobalAudio = () => {
        const audio = document.getElementById('neural-audio-driver');
        if (!audio) return;

        if (isAudioPlaying) {
            audio.pause();
        } else {
            if (!audio.src || audio.src === '' || audio.src.includes(window.location.host + '/#')) {
                audio.src = (baselines.energy < 70) 
                    ? "/audio/lofi.mp3" 
                    : "/audio/rain.mp3";
            }
            audio.play().catch(e => {
                console.error("Global Audio Trigger Failed", e);
            });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const hasNotification = !baselines.calibrationComplete;

    const navItems = user?.role === 'ADMIN' ? [
        { path: '/admin', icon: <Shield size={18} />, label: 'COMMAND' },
    ] : user?.role === 'COUNSELOR' ? [
        { path: '/counselor', icon: <Shield size={18} />, label: 'OVERWATCH' },
        { path: '/profile', icon: <User size={18} />, label: 'IDENTITY' },
    ] : [
        { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'OVERVIEW' },
        { path: '/mood-tracker', icon: <Activity size={18} />, label: 'SENSORS' },
        { path: '/pulse', icon: <Wind size={18} />, label: 'PULSE' },
        { path: '/chat', icon: <Brain size={18} />, label: 'COMPANION' },
        { path: '/journal', icon: <MessageSquare size={18} />, label: 'REFLECTIONS' },
        { path: '/support', icon: <Heart size={18} />, label: 'SUPPORT' },
        { path: '/profile', icon: <User size={18} />, label: 'PROFILE' },
    ];

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="mobile-top-bar">
                <button 
                    className="menu-toggle-btn" 
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <Link to="/" className="sidebar-logo-mobile">MINDEASE</Link>
            </div>

            {/* Backdrop overlay for mobile drawer */}
            <div 
                className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} 
                onClick={() => setIsOpen(false)}
            />

            <nav className={`ghost-sidebar ${isOpen ? 'open' : ''}`}>
                <style>{`
                    .ghost-sidebar {
                        width: 280px; height: 100vh; position: fixed; left: 0; top: 0;
                        padding: 2rem 1.5rem; display: flex; flex-direction: column;
                        z-index: 100; border-right: 1px solid rgba(255,255,255,0.03);
                        background: rgba(2, 6, 23, 0.4); backdrop-filter: blur(40px);
                    }
                    .sidebar-logo {
                        font-family: 'Outfit'; font-weight: 800; font-size: 1.25rem;
                        letter-spacing: 4px; margin-bottom: 2rem; color: white;
                        text-decoration: none;
                        display: block;
                        padding-left: 1rem;
                    }
                    .nav-group { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
                    
                    .nav-link {
                        display: flex; align-items: center; gap: 1rem;
                        padding: 0.8rem 1.2rem; text-decoration: none;
                        color: #64748b; font-weight: 800; font-size: 0.7rem;
                        letter-spacing: 2px; border-radius: 1rem;
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
                        display: flex; align-items: center; gap: 1rem;
                        padding: 0.8rem 1.2rem; color: #64748b; font-weight: 800; 
                        font-size: 0.7rem; letter-spacing: 2px; border-radius: 1rem;
                        cursor: pointer; transition: 0.3s; position: relative;
                    }
                    .util-btn:hover { color: white; background: rgba(255,255,255,0.03); }

                    .notif-badge {
                        position: absolute; top: 0.9rem; right: 1.2rem;
                        width: 8px; height: 8px; background: #8b5cf6;
                        border-radius: 50%; box-shadow: 0 0 10px #8b5cf6;
                    }

                    .notif-dropdown {
                        position: absolute; left: 280px; bottom: 60px;
                        width: 320px; background: #0f172a; border: 1px solid rgba(139, 92, 246, 0.2);
                        border-radius: 2rem; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                        z-index: 1000;
                    }

                    .logout-btn {
                        margin-top: 1.5rem; display: flex; align-items: center; gap: 1rem;
                        padding: 0.8rem 1.2rem; color: #ef4444; font-weight: 800; font-size: 0.7rem;
                        letter-spacing: 2px; border: none; background: transparent;
                        cursor: pointer; opacity: 0.6; transition: 0.3s;
                    }
                    .logout-btn:hover { opacity: 1; }

                    .mobile-top-bar {
                        display: none;
                    }
                    .sidebar-overlay {
                        display: none;
                    }

                    @media (max-width: 1024px) {
                        .mobile-top-bar {
                            display: flex;
                            align-items: center;
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 75px;
                            padding: 0 1.5rem;
                            background: rgba(2, 6, 23, 0.85);
                            backdrop-filter: blur(25px);
                            border-bottom: 1px solid rgba(255,255,255,0.05);
                            z-index: 999;
                            gap: 1rem;
                        }
                        .sidebar-logo-mobile {
                            font-family: 'Outfit'; font-weight: 800; font-size: 1.25rem;
                            letter-spacing: 4px; color: white; text-decoration: none;
                            display: block; margin-left: 0.5rem;
                        }
                        .sidebar-overlay {
                            display: block;
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100vw;
                            height: 100vh;
                            background: rgba(2, 6, 23, 0.6);
                            backdrop-filter: blur(4px);
                            z-index: 1005;
                            opacity: 0;
                            pointer-events: none;
                            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                        }
                        .sidebar-overlay.visible {
                            opacity: 1;
                            pointer-events: auto;
                        }
                        .ghost-sidebar {
                            width: 280px; height: 100vh; position: fixed; left: 0; top: 0;
                            padding: 2rem 1.5rem; display: flex; flex-direction: column;
                            z-index: 1010; border-right: 1px solid rgba(255,255,255,0.05);
                            background: rgba(2, 6, 23, 0.95); backdrop-filter: blur(40px);
                            transform: translateX(-100%);
                            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                        }
                        .ghost-sidebar.open {
                            transform: translateX(0);
                        }
                        .sidebar-logo { display: block; font-size: 1.25rem; margin-bottom: 2rem; padding-left: 1rem; }
                        .nav-group { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; align-items: stretch; }
                        .nav-link { display: flex; align-items: center; gap: 1rem; padding: 0.8rem 1.2rem; text-decoration: none; font-size: 0.7rem; letter-spacing: 2px; }
                        .nav-link span { display: inline; }
                        .util-btn { display: flex; align-items: center; gap: 1rem; padding: 0.8rem 1.2rem; }
                        .util-btn span { display: inline; }
                        .logout-btn { display: flex; align-items: center; gap: 1rem; padding: 0.8rem 1.2rem; margin-top: 1.5rem; }
                        .logout-btn span { display: inline; }
                        .notif-dropdown {
                            position: relative;
                            left: 0;
                            bottom: 0;
                            width: 100%;
                            margin-top: 1rem;
                            box-shadow: none;
                            border-radius: 1.5rem;
                            padding: 1.25rem;
                        }
                        @keyframes wave {
                            0%, 100% { height: 3px; }
                            50% { height: 12px; }
                        }
                    }
                `}</style>

                <Link to="/" className="sidebar-logo" onClick={() => setIsOpen(false)}>MINDEASE</Link>
                
                <div className="nav-group">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}


                    {user?.role !== 'ADMIN' && (
                        <div className="util-btn" onClick={() => setShowNotifications(!showNotifications)}>
                            <Bell size={18} />
                            <span>ALERTS</span>
                            {hasNotification && <div className="notif-badge" />}
                        </div>
                    )}

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
                                        <Link to="/calibration" onClick={() => { setShowNotifications(false); setIsOpen(false); }} style={{ color: '#8b5cf6', fontSize: '0.7rem', fontWeight: 800, textDecoration: 'none' }}>
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
                    
                    {user?.role !== 'ADMIN' && (
                        <div 
                            className="util-btn" 
                            onClick={toggleGlobalAudio}
                            style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '1.5rem', marginTop: '1rem' }}
                        >
                            {isAudioPlaying ? <Volume2 size={18} style={{ color: '#8b5cf6' }} /> : <VolumeX size={18} />}
                            <span style={{ color: isAudioPlaying ? '#8b5cf6' : '#64748b' }}>
                                {isAudioPlaying ? 'STREAMING...' : 'MUTED'}
                            </span>
                            {isAudioPlaying && (
                                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '12px', marginLeft: 'auto' }}>
                                    {[1,2,3].map(i => (
                                        <div 
                                            key={i} 
                                            style={{ 
                                                width: '2px', 
                                                height: '100%', 
                                                background: '#8b5cf6', 
                                                borderRadius: '1px',
                                                animation: 'wave 1s infinite ease-in-out',
                                                animationDelay: `${i*0.15}s` 
                                            }} 
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={18} />
                    <span>LOG OUT</span>
                </button>
            </nav>
        </>
    );
};

export default Navbar;
