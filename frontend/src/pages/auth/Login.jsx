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
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#ffffff' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: '1.1rem' }}>C</div>
            CareerPlanet
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.15', marginTop: '3rem', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Launch your career into <br/>
            <span className="gradient-text">the stratosphere.</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: '1.7' }}>
            AI-powered resume optimization, smart job matching, and direct 1-click recruiter messaging.
          </p>
        </div>

        {/* Testimonial slider */}
        <div style={{ position: 'relative', zIndex: 10, height: '170px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card"
              style={{ padding: '1.75rem', borderRadius: 20 }}
            >
              <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: '1.6', color: '#e2e8f0' }}>
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {testimonials[activeTestimonial].author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.90625rem', color: '#ffffff' }}>{testimonials[activeTestimonial].author}</div>
                  <div style={{ fontSize: '0.78125rem', color: '#34d399' }}>{testimonials[activeTestimonial].role} @ {testimonials[activeTestimonial].company}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
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
        <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>Welcome back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Sign in to access your dashboard & job applications.</p>
          </div>

          {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.875rem 1rem', borderRadius: 12, fontSize: '0.875rem' }}>{error}</div>}
          {successMsg && <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.875rem 1rem', borderRadius: 12, fontSize: '0.875rem' }}>{successMsg}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label">Email Address</label>
              <input 
                type="email" 
                required 
                className="input" 
                placeholder="arjun@student.demo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="label" style={{ marginBottom: 0 }}>Password</label>
                <a href="#" style={{ fontSize: '0.8125rem', color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</a>
              </div>
              <input 
                type="password" 
                required 
                className="input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', borderRadius: 14, marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.90625rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <span style={{ color: '#10b981', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/register')}>Create account</span>
          </div>

          <div className="divider" />

          {/* Quick Demo Login Buttons */}
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>Quick Demo Access</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <button 
                type="button"
                className="glass-card" 
                style={{ padding: '0.875rem', cursor: 'pointer', textAlign: 'center', color: '#ffffff' }}
                onClick={() => handleDemoClick('student')}
              >
                <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '0.25rem' }}>🎓</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Student Demo</span>
              </button>
              <button 
                type="button"
                className="glass-card" 
                style={{ padding: '0.875rem', cursor: 'pointer', textAlign: 'center', color: '#ffffff' }}
                onClick={() => handleDemoClick('recruiter')}
              >
                <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '0.25rem' }}>🏢</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Recruiter Demo</span>
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
