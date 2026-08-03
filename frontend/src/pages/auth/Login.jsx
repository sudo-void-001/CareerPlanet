import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', new URLSearchParams(form), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      localStorage.setItem('token', res.data.access_token);
      const me = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(me.data));

      if (me.data.role === 'student') {
        // Check if student has uploaded a resume
        try {
          await api.get('/resume/my-resume');
          // Resume exists → go to jobs
          localStorage.setItem('hasResume', 'true');
          navigate('/jobs');
        } catch {
          // No resume → go to onboarding
          localStorage.removeItem('hasResume');
          navigate('/onboarding');
        }
      } else if (me.data.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Incorrect email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.06) 0%, transparent 60%), var(--bg)', padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.25rem', marginBottom: '0.875rem' }}>C</div>
          <h2 style={{ marginBottom: '0.375rem' }}>Welcome back</h2>
          <p style={{ fontSize: '0.9375rem' }}>Sign in to your Career Planet account</p>
        </div>

        <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border)', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.875rem', marginTop: '0.25rem', borderRadius: 12 }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Quick Demo Login:</p>
            {[
              { label: 'Student', email: 'arjun@student.demo', pwd: 'Student@123' },
              { label: 'Recruiter', email: 'rahul@microsoft.demo', pwd: 'Microsoft@123' },
              { label: 'Admin', email: 'admin@careerplanet.demo', pwd: 'Admin@123' },
            ].map(d => (
              <button key={d.label} onClick={() => setForm({ username: d.email, password: d.pwd })}
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.5rem 0.75rem', fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.label}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{d.email}</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
        </p>
      </motion.div>
    </div>
  );
}
