import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, Send, Trash2, Shield, Brain, 
    Sparkles, ArrowRight, Heart, HeartCrack, HelpCircle 
} from 'lucide-react';
import { generateChatResponse } from '../services/aiService';

const Chatbot = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { 
            sender: 'bot', 
            text: `Hello ${user?.name || 'there'}. I am MindBot, your anonymous companion. I am here to listen to anything on your mind - relationships, exam stress, breakups, or loneliness. How are you feeling today?` 
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || isTyping) return;

        const userMsg = { sender: 'user', text: message };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        const currentMessage = message;
        setMessage('');
        setIsTyping(true);

        try {
            // Generate response using direct Groq link passing only the message history (excluding names/IDs)
            const responseText = await generateChatResponse(updatedMessages, user?.name || 'Student');
            setMessages(prev => [...prev, { sender: 'bot', text: responseText }]);
        } catch (err) {
            console.error("Chat failure", err);
            setMessages(prev => [...prev, { sender: 'bot', text: "I'm sorry, I hit a snag in my neural network. I am still here to listen to you though." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleClearChat = () => {
        if (window.confirm("Wipe conversation history? This cannot be undone.")) {
            setMessages([
                { 
                    sender: 'bot', 
                    text: `Hello ${user?.name || 'there'}. I am MindBot. Let's start fresh. What would you like to talk about?` 
                }
            ]);
        }
    };

    const quickStarts = [
        { text: "I am struggling with a breakup", icon: <HeartCrack size={14} /> },
        { text: "I feel stressed about my exams", icon: <Brain size={14} /> },
        { text: "I feel lonely and isolated", icon: <HelpCircle size={14} /> }
    ];

    return (
        <div className="companion-space">
            <style>{`
                .companion-space {
                    padding-top: 2rem;
                    color: white;
                    font-family: 'Outfit', sans-serif;
                    padding-bottom: 4rem;
                }
                .section-header {
                    margin-bottom: 3.5rem;
                }
                .section-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                }
                .section-subtitle {
                    color: #64748b;
                    font-size: 1.1rem;
                }
                .chat-container {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 3rem;
                    height: 76vh;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transition: border-color 0.4s;
                }
                .chat-container:hover {
                    border-color: rgba(139, 92, 246, 0.25);
                }
                .privacy-alert {
                    flex-shrink: 0;
                    background: rgba(139, 92, 246, 0.05);
                    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
                    padding: 1.25rem 2.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .privacy-title {
                    font-weight: 800;
                    color: #8b5cf6;
                    font-size: 0.7rem;
                    letter-spacing: 2px;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .chat-header {
                    flex-shrink: 0;
                    padding: 1.5rem 2.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .chat-body {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto;
                    padding: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                /* Custom Scrollbar */
                .chat-body::-webkit-scrollbar { width: 6px; }
                .chat-body::-webkit-scrollbar-track { background: transparent; }
                .chat-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 3px; }
                .chat-body::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.3); }

                .bubble {
                    max-width: 75%;
                    padding: 1.25rem 1.75rem;
                    line-height: 1.6;
                    font-size: 1rem;
                }
                .bubble-user {
                    align-self: flex-end;
                    background: #8b5cf6;
                    color: white;
                    border-radius: 1.75rem 1.75rem 0.25rem 1.75rem;
                    box-shadow: 0 10px 25px rgba(139, 92, 246, 0.15);
                }
                .bubble-bot {
                    align-self: flex-start;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    color: #cbd5e1;
                    border-radius: 1.75rem 1.75rem 1.75rem 0.25rem;
                }
                .typing-indicator {
                    align-self: flex-start;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.03);
                    padding: 1rem 1.5rem;
                    border-radius: 1.5rem;
                    display: flex;
                    gap: 5px;
                    align-items: center;
                }
                .dot {
                    width: 6px;
                    height: 6px;
                    background: #8b5cf6;
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .dot:nth-child(1) { animation-delay: -0.32s; }
                .dot:nth-child(2) { animation-delay: -0.16s; }
                
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
                
                .chat-footer {
                    flex-shrink: 0;
                    padding: 2rem 2.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.03);
                }
                .chat-form {
                    display: flex;
                    gap: 1rem;
                }
                .chat-input {
                    flex: 1;
                    background: rgba(0, 0, 0, 0.25);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1.5rem;
                    padding: 1.25rem 1.75rem;
                    color: white;
                    outline: none;
                    font-family: inherit;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                }
                .chat-input:focus {
                    border-color: #8b5cf6;
                }
                .send-btn {
                    background: #8b5cf6;
                    color: white;
                    border: none;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .send-btn:hover:not(:disabled) {
                    background: #7c3aed;
                    transform: scale(1.05);
                }
                .send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .quick-btn {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 0.6rem 1.2rem;
                    border-radius: 1rem;
                    font-size: 0.8rem;
                    color: #94a3b8;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s;
                }
                .quick-btn:hover {
                    background: rgba(139, 92, 246, 0.05);
                    border-color: rgba(139, 92, 246, 0.2);
                    color: white;
                }
            `}</style>

            <div className="section-header">
                <span style={{ color: '#8b5cf6', fontWeight: 800, letterSpacing: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>Private Companionship</span>
                <h1 className="section-title">AI Companion</h1>
                <p className="section-subtitle">Your safe, anonymous, and warm space to talk through anything.</p>
            </div>

            <div className="chat-container">
                {/* Privacy Banner */}
                <div className="privacy-alert">
                    <Shield size={16} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                        <span className="privacy-title">EPHEMERAL SESSION ACTIVE</span>
                        <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
                            Conversations are held client-side in browser memory and are **never saved** to our database. Refreshing this page will wipe this chat forever.
                        </p>
                    </div>
                </div>

                <div className="chat-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.6rem', borderRadius: '1rem', color: '#8b5cf6' }}>
                            <Brain size={20} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>MindBot</h3>
                            <span style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></span> Private & Ephemeral
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={handleClearChat}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', opacity: 0.6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700 }}
                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                        onMouseOut={e => e.currentTarget.style.opacity = 0.6}
                    >
                        <Trash2 size={14} /> WIPE SESSION
                    </button>
                </div>

                <div className="chat-body">
                    {messages.map((msg, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}
                        >
                            {msg.text}
                        </motion.div>
                    ))}
                    
                    {isTyping && (
                        <div className="typing-indicator">
                            <span style={{ fontSize: '0.8rem', color: '#64748b', marginRight: '0.25rem' }}>MindBot is thinking</span>
                            <div className="dot" />
                            <div className="dot" />
                            <div className="dot" />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-footer">
                    {/* Quick Starts */}
                    {messages.length === 1 && (
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            {quickStarts.map((qs, i) => (
                                <button 
                                    key={i} 
                                    className="quick-btn"
                                    onClick={() => {
                                        setMessage(qs.text);
                                    }}
                                >
                                    {qs.icon} {qs.text}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    <form onSubmit={handleSend} className="chat-form">
                        <input 
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type something you want to vent or talk about..."
                            className="chat-input"
                            required
                        />
                        <button className="send-btn" type="submit" disabled={isTyping || !message.trim()}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
