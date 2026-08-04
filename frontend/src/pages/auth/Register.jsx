import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const API_BASE = 'http://localhost:8000';
const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };
const getAvatarUrl = (user) => user?.avatar_url ? `${API_BASE}${user.avatar_url}` : null;

const features = [
  {
    icon: "📄",
    title: "AI Resume Builder",
    description: "Create ATS-friendly resumes in minutes with our intelligent suggestions."
  },
  {
    icon: "🎯",
    title: "Smart Job Matching",
    description: "Our algorithm finds the perfect roles based on your skills and goals."
  },
  {
    icon: "🎤",
    title: "Interview Prep",
    description: "Practice with AI-powered mock interviews tailored to your target role."
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
    background: 'var(--gradient, linear-gradient(135deg, #0f172a, #334155))',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
    maxWidth: '460px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    padding: '1rem 0'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    background: 'var(--gradient, linear-gradient(135deg, #4338ca, #3b82f6))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary, #111827)',
    margin: '0.25rem 0'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--text-primary, #374151)'
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
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
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '0.5rem'
  },
  roleCard: {
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    background: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.5rem'
  },
  roleCardActive: {
    borderColor: '#4f46e5',
    background: '#f5f3ff'
  },
  errorMsg: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    border: '1px solid #f87171'
  },
  featureCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1.5rem',
    padding: '1.25rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)'
  }
};

const bgDecorations = {
  circle1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)',
    top: '-200px',
    left: '-200px',
    borderRadius: '50%',
    zIndex: 0
  },
  gridPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    opacity: 0.5,
    zIndex: 0
  }
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
        <div style={bgDecorations.gridPattern} />
        
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem' }}>🪐</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>CareerPlanet</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' }}>
            Start your journey <br/> with us today.
          </h2>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              style={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.08)' }}
            >
              <div style={{ fontSize: '1.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '10px' }}>
                {feature.icon}
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem', fontWeight: '600' }}>{feature.title}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
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
          <div style={{ marginBottom: '0.5rem' }}>
            <h1 style={styles.heading}>Create your account</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Join thousands of users accelerating their careers.</p>
          </div>

          {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={styles.errorMsg}>{error}</motion.div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                type="text" 
                name="fullName"
                required 
                style={styles.input} 
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                name="email"
                required 
                style={styles.input} 
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                name="password"
                required 
                style={styles.input} 
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                minLength={6}
              />
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <label style={styles.label}>I want to use CareerPlanet as a...</label>
              <div style={styles.roleGrid}>
                <motion.div 
                  style={{...styles.roleCard, ...(formData.role === 'student' ? styles.roleCardActive : {})}}
                  whileHover={{ borderColor: formData.role === 'student' ? '#4f46e5' : '#a78bfa' }}
                  onClick={() => setRole('student')}
                >
                  <div style={{ fontSize: '1.5rem' }}>🎓</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#111827' }}>Student / Candidate</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Find jobs & prep</div>
                  </div>
                </motion.div>
                <motion.div 
                  style={{...styles.roleCard, ...(formData.role === 'recruiter' ? styles.roleCardActive : {})}}
                  whileHover={{ borderColor: formData.role === 'recruiter' ? '#4f46e5' : '#a78bfa' }}
                  onClick={() => setRole('recruiter')}
                >
                  <div style={{ fontSize: '1.5rem' }}>🏢</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#111827' }}>Recruiter</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Post jobs & hire</div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.button 
              type="submit" 
              style={styles.submitBtn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </motion.button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            Already have an account? <span style={{ color: '#4f46e5', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign in here</span>
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
