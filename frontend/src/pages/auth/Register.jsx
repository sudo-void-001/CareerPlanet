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

const FloatingInput = ({ label, type, name, value, onChange, placeholder, required, disabled, minLength }) => {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value;
  
  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: '1.25rem' }}>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        minLength={minLength}
        className="input"
        placeholder={focused ? placeholder : ''}
        style={{
          paddingTop: '1.5rem',
          paddingBottom: '0.5rem',
          height: '3.5rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: focused ? 'var(--bg)' : 'var(--surface)',
          borderColor: focused ? 'var(--text-primary)' : 'var(--border)'
        }}
      />
      <label
        style={{
          position: 'absolute',
          left: '1rem',
          top: isFloating ? '0.5rem' : '1.1rem',
          fontSize: isFloating ? '0.7rem' : '0.875rem',
          color: focused ? 'var(--text-primary)' : 'var(--text-tertiary)',
          pointerEvents: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: isFloating ? 600 : 400,
          textTransform: isFloating ? 'uppercase' : 'none',
          letterSpacing: isFloating ? '0.05em' : 'normal'
        }}
      >
        {label}
      </label>
    </div>
  );
};

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
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--bg)', color: 'var(--text-primary)' }}>
      
      {/* Left Panel */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          width: '45%',
          background: 'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.08) 0%, var(--bg) 60%), linear-gradient(180deg, var(--bg) 0%, var(--surface-2) 100%)',
          borderRight: '1px solid var(--border)',
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', marginBottom: '3rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg)', fontWeight: 800, fontSize: '1rem' }}>C</div>
            CareerPlanet
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ fontSize: '3.25rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}
          >
            Start your career <br/>
            <span style={{ color: 'var(--text-secondary)' }}>transformation today.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontSize: '1.125rem', color: 'var(--text-tertiary)', marginBottom: '4rem', maxWidth: '400px' }}
          >
            Join 50,000+ candidates and top companies on the ecosystem.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {features.map((f, idx) => (
            <div key={idx} style={{ padding: '1.25rem', marginBottom: '1rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', background: 'var(--surface-3)', border: '1px solid var(--border)', width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {f.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{f.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.5 }}>{f.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Panel Form */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          width: '55%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Create an account</h1>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>Enter your details to get started with CareerPlanet.</p>
          </div>

          {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.875rem 1rem', borderRadius: 12, fontSize: '0.875rem' }}>{error}</motion.div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <FloatingInput
              label="Full Name"
              type="text"
              name="fullName"
              required
              placeholder="Arjun Sharma"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
            />

            <FloatingInput
              label="Email Address"
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />

            <FloatingInput
              label="Password"
              type="password"
              name="password"
              required
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              disabled={loading}
            />

            <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>I want to join as a...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
                <div 
                  style={{
                    padding: '1.25rem',
                    cursor: 'pointer',
                    borderRadius: 16,
                    border: '1px solid',
                    borderColor: formData.role === 'student' ? 'var(--text-primary)' : 'var(--border)',
                    background: formData.role === 'student' ? 'var(--surface-3)' : 'var(--surface)',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setRole('student')}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎓</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: formData.role === 'student' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Student / Jobseeker</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Apply & prep</div>
                </div>

                <div 
                  style={{
                    padding: '1.25rem',
                    cursor: 'pointer',
                    borderRadius: 16,
                    border: '1px solid',
                    borderColor: formData.role === 'recruiter' ? 'var(--text-primary)' : 'var(--border)',
                    background: formData.role === 'recruiter' ? 'var(--surface-3)' : 'var(--surface)',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setRole('recruiter')}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏢</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: formData.role === 'recruiter' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Recruiter</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Post jobs & hire</div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', borderRadius: 12, fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            Already have an account? <span style={{ color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => navigate('/login')}>Sign in here</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
