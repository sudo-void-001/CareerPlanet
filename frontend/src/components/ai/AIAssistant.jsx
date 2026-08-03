import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACTIONS = [
  { id: 'recommend',  icon: '🎯', label: 'Recommend Jobs',        color: '#6366f1' },
  { id: 'cover',      icon: '✍️', label: 'Generate Cover Letter', color: '#8b5cf6' },
  { id: 'interview',  icon: '🎤', label: 'Interview Prep',        color: '#06b6d4' },
  { id: 'skills',     icon: '📊', label: 'Skill Gap Analysis',    color: '#10b981' },
  { id: 'roadmap',    icon: '🗺️', label: 'Career Roadmap',        color: '#f59e0b' },
  { id: 'advice',     icon: '💡', label: 'Career Advice',         color: '#ef4444' },
];

const MOCK_RESPONSES = {
  recommend: `**Top Job Matches for You** 🎯\n\nBased on your profile:\n\n1. **Software Engineer Intern** @ Microsoft\n   • 92% match — Python, React, FastAPI align perfectly\n   • Missing: Docker (2 day course recommended)\n\n2. **AI Engineer** @ Google\n   • 87% match — Your Python + ML skills are strong\n   • Missing: TensorFlow (recommend fast.ai)\n\n**Tip:** Apply to the Microsoft role first — highest match!`,
  cover: `**Cover Letter Generated** ✍️\n\nDear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the Software Engineer Intern position at Microsoft. As a motivated Computer Science student with hands-on experience in Python, React, and FastAPI, I am confident I can contribute meaningfully to your engineering team.\n\nDuring my academic journey, I have developed full-stack applications and worked with RESTful APIs — directly relevant to this role. My passion for building scalable software aligns with Microsoft's mission to empower every person and organization on the planet.\n\nI would love the opportunity to discuss how my skills align with your team's needs.\n\nWarm regards,\nArjun Patel\n\n*[Copy] [Download] [Regenerate]*`,
  interview: `**Interview Prep — Software Engineer** 🎤\n\n**Technical Questions:**\n• Explain the difference between REST and GraphQL\n• What is the time complexity of binary search?\n• How does Python's GIL work?\n• Design a URL shortener system\n\n**Behavioral (STAR method):**\n• Tell me about a time you solved a complex bug\n• Describe a project you're most proud of\n• How do you handle tight deadlines?\n\n**Tip:** Practice on LeetCode Easy for 30 min before the interview!`,
  skills: `**Skill Gap Analysis** 📊\n\n**Your Strong Skills:**\n✅ Python (Advanced)\n✅ React (Intermediate)\n✅ FastAPI (Intermediate)\n✅ SQL (Intermediate)\n\n**Skills to Add for Higher Match:**\n🔴 Docker — HIGH priority (needed in 80% of backend roles)\n🟡 Kubernetes — MEDIUM priority\n🟡 TypeScript — MEDIUM priority (React roles)\n🟢 AWS Basics — LOW priority (good to have)\n\n**Recommended:** Start with Docker this weekend → 2-day tutorial on Docker Hub!`,
  roadmap: `**Career Roadmap** 🗺️\n\n**Month 1-2:** Strengthen Foundations\n→ Complete Docker + Kubernetes basics\n→ Build 1 portfolio project with FastAPI + React\n\n**Month 3-4:** Apply Aggressively\n→ Apply to 10 companies/week\n→ Attend 2 campus placement drives\n→ LinkedIn profile optimization\n\n**Month 5-6:** Interview Sprint\n→ Mock interviews (3/week)\n→ LeetCode 100 problems (Easy + Medium)\n→ System Design basics\n\n**Target:** Land your first offer in 6 months! 🚀`,
  advice: `**AI Career Advice** 💡\n\nHi! Here's personalized advice based on the current job market:\n\n**Hot Market Trends:**\n• AI/ML roles are growing 40% YoY — your Python skills are valuable!\n• Full-stack roles (React + FastAPI) are in high demand\n• Companies want problem-solvers, not just coders\n\n**For Freshers:**\n→ Build 2-3 impressive GitHub projects\n→ Contribute to open source (1 PR/week)\n→ Write 1 technical blog post/month\n→ Network actively on LinkedIn\n\n**Salary Benchmark (India 2026):**\n• Intern: ₹20-50k/month\n• Junior Dev: ₹6-15 LPA\n• Mid-level: ₹15-30 LPA\n\nYou're on the right track — keep going! 🌟`,
};

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p style="margin-top:0.75rem">')
    .replace(/\n/g, '<br/>')
    .replace(/→/g, '→')
    .replace(/✅|🔴|🟡|🟢/g, (m) => `<span style="display:inline">${m}</span>`);
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
  if (user && user.role !== 'student') return null;

  const handleAction = (action) => {
    setActiveAction(action);
    setLoading(true);
    setResponse('');
    setTimeout(() => {
      setResponse(MOCK_RESPONSES[action.id] || 'Processing your request...');
      setLoading(false);
    }, 1200);
  };

  const handleBack = () => { setActiveAction(null); setResponse(''); };

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
              width: 360, borderRadius: 20,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(229,231,235,0.8)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.125rem 1.25rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ fontSize: '1.25rem' }}>✦</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.01em' }}>AI Career Assistant</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Powered by Career Planet AI</div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '1rem', maxHeight: 420, overflowY: 'auto' }}>
              {!activeAction ? (
                <>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.875rem', fontWeight: 500 }}>
                    What can I help you with?
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {ACTIONS.map(action => (
                      <motion.button
                        key={action.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAction(action)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                          gap: '0.375rem', padding: '0.75rem',
                          background: 'var(--surface-2)', border: '1px solid var(--border)',
                          borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.background = `${action.color}08`; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-2)'; }}
                      >
                        <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={handleBack} style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    fontSize: '0.8125rem', color: 'var(--text-secondary)', background: 'none',
                    border: 'none', cursor: 'pointer', marginBottom: '0.875rem', padding: 0, fontFamily: 'Inter, sans-serif',
                  }}>
                    ← Back
                  </button>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '0.875rem',
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>{activeAction.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{activeAction.label}</span>
                  </div>

                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                      <div className="pulse-glow" style={{
                        width: 36, height: 36, borderRadius: '50%', margin: '0 auto 0.75rem',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      }}>✦</div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Analyzing your profile...</p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.7,
                        background: 'var(--surface-2)', borderRadius: 12, padding: '0.875rem',
                        border: '1px solid var(--border)',
                      }}
                      dangerouslySetInnerHTML={{ __html: `<p>${parseMarkdown(response)}</p>` }}
                    />
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
