import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';

const testimonials = [
  {
    quote: "CareerPlanet helped me land my dream job at Microsoft in just 2 weeks!",
    author: "Arjun S.",
    role: "Software Engineer",
    company: "Microsoft"
  },
  {
    quote: "The AI resume analysis and automated recruiter dispatch are absolute game-changers.",
    author: "Priya M.",
    role: "Full Stack Developer",
    company: "Google"
  },
  {
    quote: "As a recruiter, viewing candidate cover letters and communicating in 1-click is effortless.",
    author: "Rahul K.",
    role: "Senior Recruiter",
    company: "Microsoft"
  }
];

const FloatingInput = ({ label, type, value, onChange, placeholder, required, disabled }) => {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value;
  
  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: '1.25rem' }}>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
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

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDemoClick = (type) => {
    if (type === 'student') {
      setEmail('arjun@student.demo');
      setPassword('Student@123');
    } else if (type === 'recruiter') {
      setEmail('rahul@microsoft.demo');
      setPassword('Microsoft@123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const loginRes = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const token = loginRes.data.access_token;
      localStorage.setItem('token', token);

      const meRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = meRes.data;
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'student') {
        if (!user.resume_url) {
          navigate('/onboarding');
        } else {
          navigate('/jobs');
        }
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to login. Please check credentials.');
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
          background: 'radial-gradient(circle at 0% 100%, rgba(255,255,255,0.08) 0%, var(--bg) 60%), linear-gradient(180deg, var(--bg) 0%, var(--surface-2) 100%)',
          borderRight: '1px solid var(--border)',
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg)', fontWeight: 800, fontSize: '1rem' }}>C</div>
            CareerPlanet
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ fontSize: '3.25rem', fontWeight: '800', lineHeight: '1.1', marginTop: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}
          >
            Launch your career into <br/>
            <span style={{ color: 'var(--text-secondary)' }}>the stratosphere.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontSize: '1.125rem', color: 'var(--text-tertiary)', maxWidth: '420px', lineHeight: '1.6' }}
          >
            AI-powered resume optimization, smart job matching, and direct 1-click recruiter messaging.
          </motion.p>
        </div>

        {/* Testimonial slider */}
        <div style={{ position: 'relative', zIndex: 10, height: '180px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(10px)', y: -10 }}
              transition={{ duration: 0.5 }}
              className="glass-card"
              style={{ padding: '2rem', borderRadius: 24, border: '1px solid var(--border)' }}
            >
              <p style={{ fontSize: '1rem', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>
                  {testimonials[activeTestimonial].author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{testimonials[activeTestimonial].author}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{testimonials[activeTestimonial].role} @ {testimonials[activeTestimonial].company}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
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
          background: 'var(--bg)'
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Welcome back</h1>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>Sign in to access your dashboard & job applications.</p>
          </div>

          {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.875rem 1rem', borderRadius: 12, fontSize: '0.875rem' }}>{error}</motion.div>}
          {successMsg && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.875rem 1rem', borderRadius: 12, fontSize: '0.875rem' }}>{successMsg}</motion.div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <FloatingInput
              label="Email Address"
              type="email"
              required
              placeholder="arjun@student.demo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <div style={{ position: 'relative' }}>
              <FloatingInput
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <a href="#" style={{ position: 'absolute', right: '1rem', top: '1.2rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, zIndex: 10 }}>Forgot?</a>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', borderRadius: 12, marginTop: '0.5rem', fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            Don't have an account? <span style={{ color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => navigate('/register')}>Create account</span>
          </div>

          <div className="divider" style={{ margin: '1rem 0' }} />

          {/* Quick Demo Login Buttons */}
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>Quick Demo Access</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                type="button"
                className="card-flat" 
                style={{ padding: '1rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', background: 'var(--surface)' }}
                onClick={() => handleDemoClick('student')}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-primary)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '0.5rem' }}>🎓</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Student Demo</span>
              </button>
              <button 
                type="button"
                className="card-flat" 
                style={{ padding: '1rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', background: 'var(--surface)' }}
                onClick={() => handleDemoClick('recruiter')}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-primary)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '0.5rem' }}>🏢</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Recruiter Demo</span>
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
