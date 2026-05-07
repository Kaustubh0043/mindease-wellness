import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Trash2, Mail, Camera, AlertTriangle, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: user?.name || '', email: user?.email || '' });
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePic(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSaveIdentity = () => {
        alert('IDENTITY RECALIBRATED: Core data synchronized.');
        setIsEditing(false);
    };

    return (
        <div className="dashboard-space">
            <style>{`
                .dashboard-space { min-height: 100vh; background: #020617; color: white; font-family: 'Outfit', sans-serif; position: relative; }
                .liquid-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: url('/liquid.png') no-repeat center center/cover; opacity: 1; z-index: 0; }
                .liquid-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(2, 6, 23, 0.6) 0%, #020617 100%); }
                .content-area { position: relative; z-index: 10; padding: 6rem 2rem; }
                .massive-title { font-family: 'Playfair Display'; font-size: 5rem; margin-bottom: 4rem; letter-spacing: -2px; }
                
                .profile-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 4vw; margin-top: 4rem; }
                
                .avatar-section {
                    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 4rem; border-radius: 4rem; text-align: center; height: fit-content;
                    backdrop-filter: blur(20px); position: relative;
                }
                .avatar-circle {
                    width: 180px; height: 180px; background: rgba(139, 92, 246, 0.1);
                    border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 50%;
                    margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center;
                    color: #8b5cf6; overflow: hidden; position: relative;
                    transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
                
                .upload-overlay {
                    position: absolute; inset: 0; background: rgba(139, 92, 246, 0.6);
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: 0.4s; cursor: pointer;
                }
                .avatar-circle:hover .upload-overlay { opacity: 1; }

                .details-section { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .detail-card {
                    background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 2.5rem; border-radius: 2.5rem; transition: 0.3s;
                }
                .detail-card:hover { border-color: #8b5cf6; background: rgba(255, 255, 255, 0.04); }
                
                .label { font-weight: 800; font-size: 0.65rem; color: #64748b; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 1rem; display: block; }
                .value { font-family: 'Playfair Display'; font-size: 1.5rem; color: white; }

                .edit-input {
                    background: transparent; border: none; border-bottom: 1px solid #8b5cf6;
                    color: white; font-family: 'Playfair Display'; font-size: 1.5rem; width: 100%;
                    outline: none; padding: 0.5rem 0;
                }

                .terminate-btn {
                    margin-top: 4rem; padding: 1.5rem; width: 100%; 
                    background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #ef4444; border-radius: 2rem; font-weight: 800; letter-spacing: 4px;
                    font-size: 0.75rem; cursor: pointer; transition: 0.4s;
                    display: flex; align-items: center; justify-content: center; gap: 1rem;
                }
                .terminate-btn:hover { background: #ef4444; color: white; box-shadow: 0 0 30px rgba(239, 68, 68, 0.3); }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(20px); z-index: 1000;
                    display: flex; align-items: center; justify-content: center;
                    padding: 2rem;
                }
                .warning-modal {
                    background: #020617; border: 1px solid rgba(239, 68, 68, 0.3);
                    padding: 4rem; border-radius: 4rem; max-width: 500px; width: 100%;
                    text-align: center;
                }
                .modal-icon { color: #ef4444; margin-bottom: 2rem; }
                .modal-title { font-family: 'Playfair Display'; font-size: 2.5rem; margin-bottom: 1.5rem; }
                .modal-desc { color: #64748b; line-height: 1.6; margin-bottom: 3rem; }
                
                .modal-actions { display: flex; gap: 1.5rem; }
                .confirm-del { flex: 1; padding: 1.25rem; background: #ef4444; border: none; color: white; border-radius: 1.5rem; font-weight: 800; letter-spacing: 2px; cursor: pointer; }
                .cancel-del { flex: 1; padding: 1.25rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 1.5rem; font-weight: 800; letter-spacing: 2px; cursor: pointer; }

                .save-identity-btn {
                    margin-top: 2rem; padding: 1rem 2rem; background: #8b5cf6; 
                    color: white; border: none; border-radius: 1rem; font-weight: 800;
                    letter-spacing: 2px; font-size: 0.7rem; cursor: pointer;
                    display: block; width: 100%;
                }
            `}</style>

            <div className="liquid-bg" />
            
            <div className="content-area">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="status-tag" style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.7rem', marginBottom: '1.5rem' }}>NEURAL IDENTITY</div>
                    <h1 className="massive-title">Profile<br/><span style={{ fontStyle: 'italic', fontWeight: 400 }}>Architecture</span>.</h1>

                    <div className="profile-grid">
                        <div className="avatar-section">
                            <div className="avatar-circle">
                                {profilePic ? <img src={profilePic} alt="Profile" /> : <User size={80} />}
                                <div className="upload-overlay" onClick={() => fileInputRef.current.click()}>
                                    <Camera size={32} />
                                </div>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                onChange={handleFileChange} 
                                accept="image/*"
                            />
                            {isEditing ? (
                                <input 
                                    className="edit-input" 
                                    value={editData.name} 
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                    autoFocus
                                />
                            ) : (
                                <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display' }}>{editData.name || 'Authorized User'}</h2>
                            )}
                            <p style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '3px', fontSize: '0.75rem', marginTop: '1rem', textTransform: 'uppercase' }}>{user?.role || 'STUDENT'}</p>
                            
                            {isEditing && (
                                <button className="save-identity-btn" onClick={handleSaveIdentity}>SAVE CALIBRATION</button>
                            )}

                            <button className="terminate-btn" onClick={() => setShowDeleteModal(true)}>
                                <Trash2 size={16} /> TERMINATE IDENTITY
                            </button>
                        </div>

                        <div className="details-section">
                            <div className="detail-card">
                                <span className="label">INSTITUTIONAL EMAIL</span>
                                {isEditing ? (
                                    <input 
                                        className="edit-input" 
                                        style={{ fontSize: '1rem' }}
                                        value={editData.email} 
                                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                                    />
                                ) : (
                                    <div className="value">{editData.email || 'N/A'}</div>
                                )}
                            </div>
                            <div className="detail-card">
                                <span className="label">SYSTEM STATUS</span>
                                <div className="value" style={{ color: '#8b5cf6' }}>Optimal Resonance</div>
                            </div>
                            <div className="detail-card">
                                <span className="label">MEMBER SINCE</span>
                                <div className="value">April 2026</div>
                            </div>
                            <div className="detail-card">
                                <span className="label">NEURAL KEY</span>
                                <div className="value" style={{ fontSize: '0.9rem', opacity: 0.5 }}>SHA-256 SYNCED</div>
                            </div>
                            <div className="detail-card" style={{ gridColumn: 'span 2' }}>
                                <span className="label">AUTONOMOUS OPTIONS</span>
                                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 800, letterSpacing: '2px', fontSize: '0.7rem', cursor: 'pointer' }}
                                    >
                                        EDIT CORE IDENTITY
                                    </button>
                                    <button style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 800, letterSpacing: '2px', fontSize: '0.7rem', cursor: 'pointer' }}>SYNC EXTERNAL DATA</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div 
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="warning-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <AlertTriangle className="modal-icon" size={64} />
                            <h2 className="modal-title">Terminate Identity?</h2>
                            <p className="modal-desc">
                                This action will permanently erase your neural baseline, journal archives, and institutional presence. This cannot be undone.
                            </p>
                            <div className="modal-actions">
                                <button className="cancel-del" onClick={() => setShowDeleteModal(false)}>CANCEL</button>
                                <button className="confirm-del" onClick={() => {
                                    alert('DELETING IDENTITY...');
                                    setShowDeleteModal(false);
                                }}>TERMINATE</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
