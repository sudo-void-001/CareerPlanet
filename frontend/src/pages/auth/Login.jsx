import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';

const API_BASE = 'http://localhost:8000';
const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };
const getAvatarUrl = (user) => user?.avatar_url ? `${API_BASE}${user.avatar_url}` : null;

const testimonials = [
  {
    quote: "CareerPlanet helped me land my dream job at a top tech company in just 2 weeks!",
    author: "Sarah J.",
    role: "Software Engineer",
    company: "Google"
  },
  {
    quote: "The AI resume builder and interview prep features are absolute game-changers.",
    author: "Michael T.",
    role: "Product Manager",
    company: "Stripe"
  },
  {
    quote: "As a recruiter, finding top talent has never been this seamless and efficient.",
    author: "Emily R.",
    role: "Senior Recruiter",
    company: "Microsoft"
  }
];

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    fontFamily: '"Inter", "Roboto", sans-serif',
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  },
  leftPanel: {
    width: '45%',
    background: 'var(--gradient, linear-gradient(135deg, #1e1b4b, #4338ca))',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '3rem',
    position: 'relative',
    overflow: 'hidden',
  },
  rightPanel: {
    width: '55%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: '2rem',
    overflowY: 'auto'
  },
  formContainer: {
    width: '100%',
    maxWidth: '440px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  logo: {
    fontSize: '1.75rem',
    fontWeight: '800',
    background: 'var(--gradient, linear-gradient(135deg, #4338ca, #3b82f6))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
    display: 'inline-block'
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary, #111827)',
    margin: 0
  },
  subHeading: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary, #6b7280)',
    marginTop: '0.25rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--text-primary, #374151)'
  },
  input: {
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#f9fafb'
  },
  submitBtn: {
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    border: 'none',
    background: 'var(--gradient, linear-gradient(135deg, #4338ca, #3b82f6))',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: '0 4px 12px rgba(67, 56, 202, 0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.875rem',
    margin: '1rem 0'
  },
  dividerLine: {
    flex: 1,
    borderBottom: '1px solid #e5e7eb'
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem'
  },
  demoBtn: {
    padding: '0.75rem 0.5rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem'
  },
  demoIcon: {
    fontSize: '1.25rem'
  },
  errorMsg: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    border: '1px solid #f87171'
  },
  testimonialContainer: {
    position: 'relative',
    height: '160px',
    marginTop: 'auto',
    marginBottom: '2rem'
  },
  testimonialCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    padding: '1.5rem',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    width: '100%',
    boxSizing: 'border-box'
  },
  floatingBadge: {
    position: 'absolute',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(8px)',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  }
};

const bgDecorations = {
  circle1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(0,0,0,0) 70%)',
    top: '-100px',
    right: '-100px',
    borderRadius: '50%',
    zIndex: 0
  },
  circle2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(0,0,0,0) 70%)',
    bottom: '-150px',
    left: '-150px',
    borderRadius: '50%',
    zIndex: 0
  }
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
    } else if (type === 'admin') {
      setEmail('admin@careerplanet.demo');
      setPassword('Admin@123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // Create x-www-form-urlencoded data
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
    <div style={styles.container}>
      {/* Left Panel */}
      <motion.div 
        style={styles.leftPanel}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hide-on-mobile"
      >
        <div style={bgDecorations.circle1} />
        <div style={bgDecorations.circle2} />
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🪐</span> CareerPlanet
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: '700', lineHeight: '1.2', marginTop: '2rem', marginBottom: '1rem' }}>
            Launch your career into <br/>
            <span style={{ color: '#818cf8' }}>the stratosphere.</span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#c7d2fe', maxWidth: '400px', lineHeight: '1.6' }}>
            Join over 50,000 professionals and 1,000+ top companies shaping the future of work.
          </p>
        </div>

        {/* Floating Badges Removed for clean look */}

        {/* Testimonials */}
        <div style={{...styles.testimonialContainer, zIndex: 1}}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={styles.testimonialCard}
            >
              <div style={{ fontSize: '1.5rem', color: '#818cf8', marginBottom: '0.5rem' }}>"</div>
              <p style={{ fontSize: '1rem', fontStyle: 'italic', marginBottom: '1rem', lineHeight: '1.5' }}>
                {testimonials[activeTestimonial].quote}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {testimonials[activeTestimonial].author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{testimonials[activeTestimonial].author}</div>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{testimonials[activeTestimonial].role} @ {testimonials[activeTestimonial].company}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div 
        style={styles.rightPanel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div style={styles.formContainer}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🪐</span>
            <div style={styles.logo}>CareerPlanet</div>
            <h1 style={styles.heading}>Welcome back</h1>
            <p style={styles.subHeading}>Please enter your details to sign in.</p>
          </div>

          {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={styles.errorMsg}>{error}</motion.div>}
          {successMsg && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{...styles.errorMsg, backgroundColor: '#dcfce7', color: '#166534', borderColor: '#86efac'}}>{successMsg}</motion.div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                required 
                style={styles.input} 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={styles.label}>Password</label>
                <a href="#" style={{ fontSize: '0.875rem', color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</a>
              </div>
              <input 
                type="password" 
                required 
                style={styles.input} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <motion.button 
              type="submit" 
              style={styles.submitBtn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Don't have an account? <span style={{ color: '#4f46e5', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/register')}>Sign up</span>
          </div>

          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={{ padding: '0 1rem' }}>Or continue with demo</span>
            <div style={styles.dividerLine}></div>
          </div>

          <div style={styles.demoGrid}>
            <motion.div 
              style={styles.demoBtn} 
              whileHover={{ borderColor: '#4f46e5', backgroundColor: '#f5f3ff' }}
              onClick={() => handleDemoClick('student')}
            >
              <span style={styles.demoIcon}>🎓</span>
              Student
            </motion.div>
            <motion.div 
              style={styles.demoBtn} 
              whileHover={{ borderColor: '#4f46e5', backgroundColor: '#f5f3ff' }}
              onClick={() => handleDemoClick('recruiter')}
            >
              <span style={styles.demoIcon}>🏢</span>
              Recruiter
            </motion.div>
          </div>
        </div>
      </motion.div>

      <style>
        {`
          @media (max-width: 900px) {
            .hide-on-mobile {
              display: none !important;
            }
            .right-panel {
              width: 100% !important;
            }
          }
        `}
      </style>
    </div>
  );
}
