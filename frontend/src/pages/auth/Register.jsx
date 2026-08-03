import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/auth/register', { full_name: form.fullName, email: form.email, password: form.password, role: form.role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 60%), var(--bg)', padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.25rem', marginBottom: '0.875rem' }}>C</div>
          <h2 style={{ marginBottom: '0.375rem' }}>Create your account</h2>
          <p style={{ fontSize: '0.9375rem' }}>Start your AI-powered career journey today</p>
        </div>

        <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border)', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Full Name</label>
              <input className="input" type="text" placeholder="Arjun Patel" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <div>
              <label className="label">I am a...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                {[{ value: 'student', label: '🎓 Student' }, { value: 'recruiter', label: '💼 Recruiter' }].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({...form, role: opt.value})}
                    style={{
                      padding: '0.75rem', borderRadius: 10, border: `2px solid ${form.role === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                      background: form.role === opt.value ? 'var(--primary-light)' : 'var(--surface-2)',
                      color: form.role === opt.value ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: 600, fontSize: '0.9375rem', cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.875rem', marginTop: '0.25rem', borderRadius: 12 }}>
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
