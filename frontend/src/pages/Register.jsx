import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        verificationCode: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (!validateEmail(formData.email)) {
            alert('REGISTRATION DENIED: Please use a valid email address to access MindEase.');
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.verificationCode !== '123456') { // Mock verification code for demo
            alert('INVALID SECURITY KEY: Please check your institutional inbox for the 6-digit access code.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/calibration');
        } catch (error) {
            alert('Registration Failed: Institutional database error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="cogni-container">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap');
                
                .cogni-container { background: #020617; color: white; font-family: 'Outfit', sans-serif; min-height: 100vh; overflow-x: hidden; }
                .liquid-bg { 
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: url('/liquid.png') no-repeat center center/cover;
                    opacity: 1; z-index: 0; pointer-events: none;
                }
                .liquid-bg::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(to bottom, rgba(2, 6, 23, 0.4) 0%, rgba(2, 6, 23, 0.8) 100%);
                }
                
                .massive-title { 
                    font-family: 'Playfair Display', serif; 
                    font-size: clamp(3rem, 8vw, 7rem); line-height: 0.9; letter-spacing: -3px; 
                    margin-bottom: 2rem; font-weight: 700;
                }

                .register-grid {
                    display: grid; grid-template-columns: 1fr 1fr; 
                    gap: 10vw; padding: 15vh 6vw; position: relative; z-index: 10;
                    align-items: center;
                }

                .back-btn {
                    position: fixed; top: 2.5rem; left: 6vw; z-index: 100;
                    display: flex; alignItems: center; gap: 0.75rem;
                    color: #64748b; text-decoration: none; font-weight: 800;
                    font-size: 0.7rem; letter-spacing: 2px; transition: 0.3s;
                }
                .back-btn:hover { color: white; transform: translateX(-5px); }

                .luxury-input-invisible { margin-bottom: 3.5rem; position: relative; }
                .luxury-input-invisible label {
                    display: block; font-weight: 800; font-size: 0.7rem;
                    color: #64748b; letter-spacing: 3px; margin-bottom: 0.5rem;
                    text-transform: uppercase;
                }
                .luxury-input-invisible input, .luxury-input-invisible select {
                    width: 100%; background: transparent !important; border: none;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding: 1rem 0; font-size: 1.4rem; color: white; outline: none;
                    font-family: 'Outfit', sans-serif; transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
                }
                
                /* Override Chrome/Safari Autofill Blue Background */
                .luxury-input-invisible input:-webkit-autofill {
                    -webkit-text-fill-color: white;
                    -webkit-box-shadow: 0 0 0px 1000px transparent inset;
                    transition: background-color 5000s ease-in-out 0s;
                }

                .luxury-input-invisible input:focus { border-bottom-color: #8b5cf6; padding-left: 0.5rem; }

                .luxury-input-invisible::after {
                    content: ''; position: absolute; bottom: 0; left: 0; width: 0%; height: 1px;
                    background: #8b5cf6; transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .luxury-input-invisible:focus-within::after { width: 100%; }

                .ghost-btn {
                    width: 100%; background: white; color: black; padding: 1.5rem;
                    border: 1px solid white; font-weight: 900; letter-spacing: 6px;
                    font-size: 0.85rem; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 1rem; transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    text-transform: uppercase;
                }
                .ghost-btn:hover { 
                    background: transparent; color: white;
                    letter-spacing: 8px;
                }

                .form-panel-invisible { max-width: 500px; }
            `}</style>

            <div className="liquid-bg" />
            
            <Link to="/login" className="back-btn">
                <ArrowLeft size={16} /> RETURN TO GATEWAY
            </Link>

            <div className="register-grid">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
                    <div style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.7rem', marginBottom: '1.5rem', marginTop: '3rem' }}>
                        <Sparkles size={14} style={{ marginBottom: '-2px', marginRight: '5px' }} /> START YOUR EVOLUTION
                    </div>
                    <h1 className="massive-title">Join the<br/><span style={{ fontStyle: 'italic', fontWeight: 400 }}>Silent</span> Wave.</h1>
                    <p style={{ fontSize: '1.8rem', color: '#64748b', fontFamily: 'Playfair Display', lineHeight: '1.4', maxWidth: '500px' }}>
                        Establish your unique frequency within the MindEase ecosystem. A space designed for clarity, data, and growth.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 50 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.5, duration: 1.2 }}
                    className="form-panel-invisible"
                >
                    {step === 1 ? (
                        <form onSubmit={handleNextStep}>
                            <div className="luxury-input-invisible">
                                <label>FULL IDENTITY</label>
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                    required 
                                    placeholder="Your Name" 
                                />
                            </div>
                            <div className="luxury-input-invisible">
                                <label>INSTITUTIONAL EMAIL</label>
                                <input 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                    required 
                                    placeholder="name@university.edu" 
                                />
                            </div>
                            <div className="luxury-input-invisible">
                                <label>SECURITY ACCESS KEY</label>
                                <input 
                                    type="password" 
                                    value={formData.password} 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    required 
                                    placeholder="Create Key" 
                                />
                            </div>
                            <button type="submit" className="ghost-btn">
                                NEXT: VERIFY IDENTITY <ArrowRight size={14} />
                            </button>
                        </form>
                    ) : (
                        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '3rem', borderLeft: '2px solid #8b5cf6', paddingLeft: '1.5rem' }}>
                                <div style={{ color: '#8b5cf6', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '3px', marginBottom: '0.5rem' }}>STEP 02</div>
                                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2rem' }}>Identity Verification</h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>We've sent a 6-digit security code to your institutional inbox.</p>
                            </div>
                            
                            <div className="luxury-input-invisible">
                                <label>6-DIGIT ACCESS CODE</label>
                                <input 
                                    type="text" 
                                    value={formData.verificationCode} 
                                    onChange={(e) => setFormData({...formData, verificationCode: e.target.value})} 
                                    required 
                                    placeholder="000000" 
                                    maxLength={6}
                                />
                            </div>
                            
                            <button type="submit" className="ghost-btn" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="spin" /> : <>INITIALIZE ACCOUNT <ShieldCheck size={14} /></>}
                            </button>
                            
                            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', cursor: 'pointer', marginTop: '2rem', width: '100%' }}>
                                ← WRONG EMAIL? GO BACK
                            </button>
                        </motion.form>
                    )}
                    
                    <div style={{ marginTop: '2.5rem', textAlign: 'center', color: '#475569', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px' }}>
                        ALREADY SYNCED? <Link to="/login" style={{ color: '#8b5cf6', textDecoration: 'none' }}>LOG IN →</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
