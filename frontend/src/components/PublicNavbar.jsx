import React from 'react';
import { Link } from 'react-router-dom';

const PublicNavbar = () => {
    return (
        <nav className="glass-nav">
            <style>{`
                .glass-nav {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 2.5rem 6vw; position: fixed; top: 0; width: 100%; z-index: 100;
                    background: rgba(2, 6, 23, 0.4); backdrop-filter: blur(20px);
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
            `}</style>
            <Link to="/" className="logo">MINDEASE</Link>
            <div className="glass-nav-links">
                <Link to="/login#science" className="nav-link">SCIENCE</Link>
                <Link to="/login#journey" className="nav-link">JOURNEY</Link>
                <Link to="/about" className="nav-link">ABOUT US</Link>
                <Link to="/register" className="nav-link join-btn">JOIN</Link>
            </div>
        </nav>
    );
};

export default PublicNavbar;
