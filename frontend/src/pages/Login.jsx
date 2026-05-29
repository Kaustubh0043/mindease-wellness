import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
    ArrowRight, Loader2, Brain, Activity, Lock, Sparkles, Shield
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

const RevealSection = ({ children, className }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const InfoCard = ({ icon, title, subtitle, desc }) => (
    <div className="info-card">
        <div className="icon-box">{icon}</div>
        <div className="card-tag">{subtitle}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [name, setName] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const { user, login, register, verifyEmail, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Auto-redirect to dashboard if user is already logged in
    useEffect(() => {
        if (user) {
            navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
        }
    }, [user, navigate]);

    const handleGoogleSuccess = async (response) => {
        setIsSubmitting(true);
        try {
            const user = await loginWithGoogle(response.credential);
            navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
        } catch (error) {
            console.error("Google authentication failed:", error);
            alert("Google Sign-In failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

    useEffect(() => {
        const initializeGoogle = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: handleGoogleSuccess
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("googleSignInButton"),
                    { theme: "filled_blue", size: "large", width: "100%", shape: "pill" }
                );
                return true;
            }
            return false;
        };

        if (initializeGoogle()) return;

        const interval = setInterval(() => {
            if (initializeGoogle()) {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isRegistering]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (isRegistering) {
                await register(name || 'Overwatch Alpha', email, password, 'USER');
                setShowVerify(true);
            } else {
                const user = await login(email, password);
                navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
            }
        } catch (error) {
            console.error("Auth action failed:", error);
            const errMsg = error.response?.data?.message;
            if (errMsg === 'EMAIL_NOT_VERIFIED') {
                alert('EMAIL NOT VERIFIED: Please check your inbox for the 6-digit access code to verify your identity.');
                setShowVerify(true);
            } else {
                alert(errMsg || 'Access Denied: Invalid credentials or database error.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await verifyEmail(email, verifyCode);
            alert('IDENTITY VERIFIED: Neural Handshake Complete.');
            setShowVerify(false);
            setIsRegistering(false);
            navigate('/calibration');
        } catch (error) {
            console.error("Verification failed:", error);
            const errMsg = error.response?.data?.message || 'SECURITY BREACH: Invalid Neural Key.';
            alert(errMsg === "INVALID_CODE" ? 'SECURITY BREACH: Invalid Neural Key.' : errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="cogni-container">
            <AnimatePresence>
                {showVerify && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(30px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <motion.div initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} style={{ width: '100%', maxWidth: '500px', textAlign: 'center', padding: '2rem' }}>
                            <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '80px', height: '80px', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: '#8b5cf6' }}>
                                <Lock size={40} />
                            </div>
                            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', marginBottom: '1.5rem' }}>Neural Key.</h2>
                            <p style={{ color: '#64748b', marginBottom: '3rem' }}>Verification code dispatched to {email}.</p>
                            <form onSubmit={handleVerify}>
                                <input 
                                    type="text" maxLength="6" value={verifyCode} 
                                    onChange={(e) => setVerifyCode(e.target.value)}
                                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #8b5cf6', color: 'white', fontSize: '3rem', textAlign: 'center', letterSpacing: '1rem', marginBottom: '4rem', outline: 'none' }}
                                    placeholder="000000" required 
                                />
                                <button type="submit" className="ghost-btn">VERIFY IDENTITY</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap');
                .cogni-container { background: #020617; color: white; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
                .liquid-bg { position: fixed; inset: 0; background: url('/liquid.png') center/cover; opacity: 1; z-index: 0; pointer-events: none; }
                .liquid-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(2, 6, 23, 0.4) 0%, #020617 100%); }
                .massive-title { font-family: 'Playfair Display', serif; font-size: clamp(3rem, 10vw, 8rem); line-height: 0.85; letter-spacing: -4px; margin: 2rem 0; }
                .hero-section { min-height: 100vh; padding: 15vh 6vw; display: flex; align-items: center; gap: 10vw; position: relative; z-index: 10; }
                .form-panel-invisible { background: rgba(255,255,255,0.02); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.05); padding: 4rem; border-radius: 4rem; width: 100%; max-width: 500px; }
                .luxury-input-invisible { margin-bottom: 3rem; position: relative; }
                .luxury-input-invisible label { display: block; font-size: 0.65rem; font-weight: 800; letter-spacing: 3px; color: #64748b; margin-bottom: 1rem; }
                .luxury-input-invisible input { width: 100%; background: transparent !important; border: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 1rem 0; color: white; font-size: 1.2rem; outline: none; transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
                
                /* Override Chrome/Safari Autofill Blue/White Background */
                .luxury-input-invisible input:-webkit-autofill {
                    -webkit-text-fill-color: white !important;
                    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
                
                .luxury-input-invisible input:focus { border-bottom-color: #8b5cf6; padding-left: 0.5rem; }

                .luxury-input-invisible::after {
                    content: ''; position: absolute; bottom: 0; left: 0; width: 0%; height: 1px;
                    background: #8b5cf6; transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .luxury-input-invisible:focus-within::after { width: 100%; }
                .ghost-btn { width: 100%; background: white; color: black; padding: 1.5rem; border: none; font-weight: 900; letter-spacing: 6px; cursor: pointer; border-radius: 1.5rem; transition: 0.4s; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 1rem; }
                .ghost-btn:hover { background: #8b5cf6; color: white; }
                .toggle-link { background: none; border: none; color: #475569; margin-top: 2rem; cursor: pointer; width: 100%; font-weight: 800; font-size: 0.7rem; letter-spacing: 2px; }
                .section-pad { padding: 15vh 6vw; max-width: 1600px; margin: 0 auto; position: relative; z-index: 10; }
                .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3vw; margin-top: 6rem; }
                .info-card { padding: 4rem 0; border-top: 1px solid rgba(255,255,255,0.05); transition: 0.4s; }
                .info-card:hover { border-top-color: #8b5cf6; transform: translateY(-10px); }
                .icon-box { color: #8b5cf6; margin-bottom: 2rem; }
                .card-tag { color: #8b5cf6; font-weight: 800; font-size: 0.7rem; letter-spacing: 4px; margin-bottom: 1rem; }
                .journey-item { display: flex; gap: 4rem; margin-bottom: 8rem; padding-bottom: 4rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .journey-num { font-size: 4rem; font-family: 'Playfair Display'; color: #1e293b; }

                @media (max-width: 1024px) {
                    .hero-section {
                        flex-direction: column;
                        padding: 12vh 2rem 5vh 2rem;
                        gap: 4rem;
                        text-align: center;
                    }
                    .info-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                        margin-top: 3rem;
                    }
                    .journey-item {
                        flex-direction: column;
                        gap: 1.5rem;
                        margin-bottom: 4rem;
                        padding-bottom: 2rem;
                        align-items: center;
                        text-align: center;
                    }
                    .massive-title {
                        font-size: 3.5rem;
                    }
                }
            `}</style>

            <div className="liquid-bg" />
            <PublicNavbar />

            <section className="hero-section">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} style={{ flex: 1 }}>
                    <div className="card-tag">VOL. 01 — RESONANCE</div>
                    <h1 className="massive-title">Silence<br/><span style={{ fontStyle: 'italic', color: '#8b5cf6', fontWeight: 400 }}>of the</span> Soul.</h1>
                    <p style={{ fontSize: '2rem', color: '#94a3b8', lineHeight: '1.4', maxWidth: '700px' }}>Mapping the invisible academic landscape with sensory precision.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="form-panel-invisible">
                    <h2 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', marginBottom: '3rem' }}>{isRegistering ? 'Initialize' : 'Login'}</h2>
                    <form onSubmit={handleSubmit}>
                        {isRegistering && (
                            <div className="luxury-input-invisible">
                                <label>FULL IDENTITY</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your Name" />
                            </div>
                        )}
                        <div className="luxury-input-invisible">
                            <label>INSTITUTIONAL ID</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@institute.edu" />
                        </div>
                        <div className="luxury-input-invisible">
                            <label>ACCESS KEY</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                        </div>
                        <button type="submit" className="ghost-btn" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="spin" /> : <>{isRegistering ? 'INITIATE' : 'ENTER'} <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: '#475569' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                        <span style={{ padding: '0 1rem', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '2px' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                    </div>

                    <div id="googleSignInButton" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
                    <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
                        {isRegistering ? 'ALREADY VERIFIED? LOGIN' : 'NEW STUDENT? INITIALIZE IDENTITY'}
                    </button>
                </motion.div>
            </section>

            <section id="science" className="section-pad">
                <RevealSection>
                    <div className="card-tag">SYSTEMS</div>
                    <h2 className="massive-title" style={{ fontSize: '5rem' }}>Invisible Science.</h2>
                    <div className="info-grid">
                        <InfoCard icon={<Brain size={40} />} title="Neural Mapping" subtitle="01 — ANALYTICS" desc="Tracking cognitive load before it manifests physically." />
                        <InfoCard icon={<Activity size={40} />} title="Dynamic Resonance" subtitle="02 — FLOW" desc="Synchronize mental space with academic cycles." />
                        <InfoCard icon={<Shield size={40} />} title="Private Grid" subtitle="03 — SECURITY" desc="Encrypted reflections, local-first storage." />
                    </div>
                </RevealSection>
            </section>

            <section id="journey" className="section-pad">
                <RevealSection>
                    <div className="card-tag">PROCESS</div>
                    <h2 className="massive-title" style={{ fontSize: '5rem', marginBottom: '8rem' }}>The Roadmap.</h2>
                    {[
                        { num: '01', title: 'Initialization', p: 'Calibrate the neural engine to your baseline resonance.' },
                        { num: '02', title: 'Daily Pulse', p: 'A silent check-in mapping emotional state against schedule.' },
                        { num: '03', title: 'Deep Reflection', p: 'Convert institutional pressures into creative fuel.' }
                    ].map((step) => (
                        <div key={step.num} className="journey-item">
                            <div className="journey-num">{step.num}</div>
                            <div className="journey-content">
                                <h4 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display' }}>{step.title}</h4>
                                <p style={{ fontSize: '1.2rem', color: '#64748b' }}>{step.p}</p>
                            </div>
                        </div>
                    ))}
                </RevealSection>
            </section>

            <footer style={{ padding: '15vh 6vw', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div className="massive-title" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', opacity: 0.1, color: 'white', marginBottom: '4rem', position: 'relative', zIndex: 0 }}>MINDEASE</div>
                <div className="footer-links-container">
                    <Link to="/docs" style={{ display: 'inline-block', color: 'white', textDecoration: 'none', border: '2px solid #8b5cf6', padding: '0.8rem 2rem', borderRadius: '2rem', background: 'rgba(139, 92, 246, 0.2)' }}>GET SUPPORT</Link>
                    <a href="https://www.instagram.com/kaustubhh.jadhav/" target="_blank" rel="noreferrer" style={{ color: 'white', textDecoration: 'none', opacity: 0.5 }}>INSTAGRAM</a>
                    <a href="https://x.com/Kaustubh__xd" target="_blank" rel="noreferrer" style={{ color: 'white', textDecoration: 'none', opacity: 0.5 }}>TWITTER</a>
                </div>
                <div style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 800 }}>NEURAL WELLNESS ECOSYSTEM • © 2026.</div>
            </footer>
        </div>
    );
};

export default Login;
