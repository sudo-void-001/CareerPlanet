import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const ACTIONS = [
  { id: 'recommend',  icon: '🎯', label: 'Recommend Jobs',        color: '#10b981' },
  { id: 'cover',      icon: '✍️', label: 'Generate Cover Letter', color: '#06b6d4' },
  { id: 'interview',  icon: '🎤', label: 'Interview Prep',        color: '#8b5cf6' },
  { id: 'skills',     icon: '📊', label: 'Skill Gap Analysis',    color: '#f59e0b' },
  { id: 'roadmap',    icon: '🗺️', label: 'Career Roadmap',        color: '#ec4899' },
  { id: 'advice',     icon: '💡', label: 'Career Advice',         color: '#3b82f6' },
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
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (user?.role === 'recruiter' || user?.role === 'admin') return null;

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const payloadMessages = updatedMessages.map(m => ({ role: m.sender, content: m.text }));
      const res = await api.post('/ai/chat', { messages: payloadMessages });
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
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 1000,
          width: 58, height: 58, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--surface-3), var(--surface-2))',
          border: '1px solid var(--border-strong)', cursor: 'pointer', color: 'var(--text-primary)',
          fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
        }}
        title="AI Career Assistant"
      >
        {open ? '✕' : '✦'}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', bottom: '5.5rem', right: '1.75rem', zIndex: 999,
              width: 400, height: 540, borderRadius: 24,
              background: 'var(--bg-subtle)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid var(--border-strong)',
              boxShadow: 'var(--shadow-xl), var(--shadow-glow)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              color: 'var(--text-primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.9rem', border: '1px solid var(--border)' }}>✦</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>AI Career Assistant</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>● Groq Intelligence Active</div>
                </div>
              </div>
              <button 
                onClick={() => setMessages([{ sender: 'ai', text: 'Hello! I am your AI career assistant. How can I help you today?' }])}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: 'var(--radius-full)', padding: '0.25rem 0.625rem', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Clear
              </button>
            </div>

            {/* Messages Box */}
            <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '0.875rem 1.125rem',
                    borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: msg.sender === 'user' ? 'var(--surface-3)' : 'var(--surface-2)',
                    border: msg.sender === 'user' ? '1px solid var(--border-strong)' : '1px solid var(--border)',
                    color: msg.sender === 'user' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                />
              ))}
              
              {loading && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.125rem', background: 'var(--surface-2)', borderRadius: '20px 20px 20px 4px', border: '1px solid var(--border)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-secondary)', animation: 'pulse-glow 1.5s infinite' }} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>AI is thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Bottom Actions & Input */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
              {/* Quick Actions Scrollable Row */}
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.625rem', marginBottom: '0.625rem', scrollbarWidth: 'none' }}>
                {ACTIONS.map(action => (
                  <button
                    key={action.id}
                    onClick={() => sendMessage(action.label)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: '#cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.color = '#ffffff'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#cbd5e1'; }}
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.625rem' }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask AI anything about your career..."
                  className="input"
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '14px',
                    fontSize: '0.84375rem',
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="btn btn-primary"
                  style={{
                    borderRadius: '14px',
                    padding: '0.75rem 1.25rem',
                    opacity: (!input.trim() || loading) ? 0.5 : 1,
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
