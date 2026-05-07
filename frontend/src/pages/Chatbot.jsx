import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User } from 'lucide-react';

const Chatbot = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [chatLogs, setChatLogs] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        // In a real app we might fetch history here
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message) return;

        const userMsg = { message, response: '...', timestamp: new Date() };
        setChatLogs([userMsg, ...chatLogs]);
        const currentMsg = message;
        setMessage('');

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, { message: currentMsg }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setChatLogs(prev => prev.map((log, idx) => idx === 0 ? res.data : log));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <MessageSquare size={20} color="white" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem' }}>MindEase Assistant</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>● Online</p>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column-reverse', gap: '1.5rem' }}>
                    <AnimatePresence>
                        {chatLogs.map((log, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    style={{ alignSelf: 'flex-end', background: 'var(--primary)', padding: '0.75rem 1rem', borderRadius: '1rem 1rem 0 1rem', maxWidth: '80%' }}>
                                    {log.message}
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                    style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '1rem 1rem 1rem 0', maxWidth: '80%', border: '1px solid var(--glass-border)' }}>
                                    {log.response}
                                </motion.div>
                            </div>
                        ))}
                    </AnimatePresence>
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        This is a safe space. Send a message to start.
                    </div>
                </div>

                <form onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
                    <input 
                        type="text" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '0.75rem 1.25rem', borderRadius: '1rem', color: 'white', outline: 'none' }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '0.75rem', borderRadius: '1rem' }}>
                        <Send size={20} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Chatbot;
