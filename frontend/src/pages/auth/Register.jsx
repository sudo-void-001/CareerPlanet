import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const features = [
  {
    icon: "📄",
    title: "AI Resume Optimization",
    description: "Get instant ATS feedback and strength scoring to maximize interview calls."
  },
  {
    icon: "🎯",
    title: "Smart Job Match",
    description: "Matches your skill set against live tier-1 company requirements."
  },
  {
    icon: "✍️",
    title: "Direct Recruiter Pitch",
    description: "Attach customized cover letters delivered straight to hiring manager inboxes."
  }
];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        role: formData.role
      });
      navigate('/login', { state: { message: 'Account created successfully! Please sign in.' } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to create account. Email might be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: '#07080c', color: '#f8fafc' }}>
      
      {/* Left Panel */}
      <motion.div 
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '45%',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 50%, #0d0f17 100%)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#ffffff', marginBottom: '2.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: '1.1rem' }}>C</div>
            CareerPlanet
          </div>
          <h2 style={{ fontSize: '2.75rem', fontWeight: '800', lineHeight: '1.15', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Start your career <br/>
            <span className="gradient-text">transformation today.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
            Join 50,000+ candidates and top companies on the ecosystem.
          </p>
        </div>

        <div>
          {features.map((f, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.5rem', background: 'rgba(16, 185, 129, 0.12)', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {f.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>{f.title}</h4>
                <p style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)', margin: 0 }}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right Panel Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          width: '55%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '460px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>Create an account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Enter your details to get started with CareerPlanet.</p>
          </div>

          {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.875rem 1rem', borderRadius: 12, fontSize: '0.875rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                required 
                className="input" 
                placeholder="Arjun Sharma"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input 
                type="email" 
                name="email"
                required 
                className="input" 
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input 
                type="password" 
                name="password"
                required 
                className="input" 
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
              />
            </div>

            <div style={{ marginTop: '0.25rem' }}>
              <label className="label">I want to join as a...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div 
                  className="glass-card"
                  style={{
                    padding: '1.125rem',
                    cursor: 'pointer',
                    borderColor: formData.role === 'student' ? '#10b981' : 'rgba(255,255,255,0.08)',
                    background: formData.role === 'student' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(26, 29, 46, 0.5)'
                  }}
                  onClick={() => setRole('student')}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎓</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#ffffff' }}>Student / Jobseeker</div>
                  <div style={{ fontSize: '0.78125rem', color: 'var(--text-tertiary)' }}>Apply & prep</div>
                </div>

                <div 
                  className="glass-card"
                  style={{
                    padding: '1.125rem',
                    cursor: 'pointer',
                    borderColor: formData.role === 'recruiter' ? '#10b981' : 'rgba(255,255,255,0.08)',
                    background: formData.role === 'recruiter' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(26, 29, 46, 0.5)'
                  }}
                  onClick={() => setRole('recruiter')}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏢</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#ffffff' }}>Recruiter</div>
                  <div style={{ fontSize: '0.78125rem', color: 'var(--text-tertiary)' }}>Post jobs & hire</div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', borderRadius: 14, marginTop: '0.75rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.90625rem', color: 'var(--text-secondary)' }}>
            Already have an account? <span style={{ color: '#10b981', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign in here</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
