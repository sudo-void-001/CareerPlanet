import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const ACTIONS = [
  { id: 'recommend',  icon: '🎯', label: 'Recommend Jobs',        color: '#6366f1' },
  { id: 'cover',      icon: '✍️', label: 'Generate Cover Letter', color: '#8b5cf6' },
  { id: 'interview',  icon: '🎤', label: 'Interview Prep',        color: '#06b6d4' },
  { id: 'skills',     icon: '📊', label: 'Skill Gap Analysis',    color: '#10b981' },
  { id: 'roadmap',    icon: '🗺️', label: 'Career Roadmap',        color: '#f59e0b' },
  { id: 'advice',     icon: '💡', label: 'Career Advice',         color: '#ef4444' },
];

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p style="margin-top:0.5rem">')
    .replace(/\n/g, '<br/>')
    .replace(/→/g, '→')
    .replace(/✅|🔴|🟡|🟢/g, (m) => `<span style="display:inline">${m}</span>`);
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AI career assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
  
  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (user?.role === 'recruiter' || user?.role === 'admin') return null;

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    // Add user message
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { prompt: text });
      const aiResponse = res.data.response || res.data.message || res.data.reply || res.data || "Success";
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error communicating with the AI. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none', cursor: 'pointer', color: 'white',
          fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99,102,241,0.45)',
        }}
        className="pulse-glow"
        title="AI Career Assistant"
      >
        {open ? '✕' : '✦'}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', bottom: '5rem', right: '1.5rem', zIndex: 999,
              width: 380, height: 520, borderRadius: 20,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(229,231,235,0.8)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.125rem 1.25rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ fontSize: '1.25rem' }}>✦</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.01em' }}>AI Career Assistant</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Powered by Career Planet AI</div>
                </div>
              </div>
              <button 
                onClick={() => setMessages([{ sender: 'ai', text: 'Hello! I am your AI career assistant. How can I help you today?' }])}
                style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Clear
              </button>
            </div>

            {/* Messages Box */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f3f4f6',
                    color: msg.sender === 'user' ? 'white' : '#1f2937',
                    fontSize: '0.8125rem',
                    lineHeight: 1.5,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                />
              ))}
              
              {loading && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#f3f4f6', borderRadius: '16px 16px 16px 4px' }}>
                  <div className="pulse-glow" style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} />
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>AI is typing...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Bottom Actions & Input */}
            <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e5e7eb', background: '#ffffff' }}>
              {/* Quick Actions Scrollable Row */}
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.5rem', scrollbarWidth: 'none' }} className="no-scrollbar">
                {ACTIONS.map(action => (
                  <button
                    key={action.id}
                    onClick={() => sendMessage(action.label)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '9999px',
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  style={{
                    flex: 1,
                    padding: '0.625rem 0.875rem',
                    borderRadius: '12px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  style={{
                    padding: '0.625rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    opacity: (!input.trim() || loading) ? 0.6 : 1,
                    transition: 'all 0.15s ease'
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
