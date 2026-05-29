import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const PublicNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="glass-nav">
            <style>{`
                .glass-nav {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 2.5rem 6vw; position: fixed; top: 0; width: 100%; z-index: 100;
                    background: rgba(2, 6, 23, 0.4); backdrop-filter: blur(20px);
                    transition: all 0.3s ease;
                }
                .glass-nav .logo {
                    font-size: 1.25rem; font-weight: 800; letter-spacing: 4px;
                    color: white; text-decoration: none;
                }
                .glass-nav-links {
                    display: flex; gap: 4rem; font-weight: 700; font-size: 0.75rem; 
                    letter-spacing: 3px; color: #cbd5e1;
                }
                .glass-nav-links a, .glass-nav-links .nav-link {
                    text-decoration: none; color: inherit; transition: 0.3s;
                }
                .glass-nav-links a:hover, .glass-nav-links .nav-link:hover {
                    color: white;
                }
                .join-btn {
                    color: white !important; border-bottom: 1px solid white;
                }
                .public-menu-btn {
                    display: none;
                }

                @media (max-width: 768px) {
                    .glass-nav {
                        padding: 1rem 1.5rem;
                        height: 70px;
                        background: rgba(2, 6, 23, 0.85);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    }
                    .glass-nav-links {
                        display: none;
                    }
                    .glass-nav-links.open {
                        display: flex;
                        flex-direction: column;
                        position: fixed;
                        top: 70px;
                        left: 0;
                        width: 100%;
                        background: rgba(2, 6, 23, 0.95);
                        backdrop-filter: blur(30px);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                        padding: 2rem 1.5rem;
                        gap: 1.5rem;
                        z-index: 99;
                    }
                    .public-menu-btn {
                        display: flex;
                    }
                }
            `}</style>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                    className="menu-toggle-btn public-menu-btn" 
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <Link to="/" className="logo" onClick={() => setIsOpen(false)}>MINDEASE</Link>
            </div>

            <div className={`glass-nav-links ${isOpen ? 'open' : ''}`}>
                <Link to="/login#science" className="nav-link" onClick={() => setIsOpen(false)}>SCIENCE</Link>
                <Link to="/login#journey" className="nav-link" onClick={() => setIsOpen(false)}>JOURNEY</Link>
                <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>ABOUT US</Link>
                <Link to="/register" className="nav-link join-btn" onClick={() => setIsOpen(false)}>JOIN</Link>
            </div>
        </nav>
    );
};

export default PublicNavbar;
