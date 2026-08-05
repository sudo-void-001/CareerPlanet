import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const companies = [
  { name: 'Microsoft', color: '#00a4ef', letter: 'M' },
  { name: 'Google', color: '#34a853', letter: 'G' },
  { name: 'Amazon', color: '#ff9900', letter: 'A' },
  { name: 'Adobe', color: '#ff0000', letter: 'Ad' },
  { name: 'Infosys', color: '#007cc5', letter: 'I' },
  { name: 'TCS', color: '#2c2c8e', letter: 'T' },
  { name: 'Deloitte', color: '#86bc25', letter: 'D' },
  { name: 'Airtel', color: '#e40000', letter: 'Ai' },
];

const stats = [
  { value: '50,000+', label: 'Students Placed', icon: '⚡' },
  { value: '1,200+', label: 'Verified Recruiters', icon: '🏢' },
  { value: '98%', label: 'Placement Rate', icon: '🎯' },
  { value: '4.9★', label: 'Student Rating', icon: '⭐️' },
];

const features = [
  { 
    icon: '🤖', 
    title: 'AI Resume Analysis', 
    desc: 'Instant deep-scan feedback on ATS compatibility, missing keywords, structural score, and personalized improvement tips.',
    tag: 'Instant Score'
  },
  { 
    icon: '🎯', 
    title: 'Smart Job Matching', 
    desc: 'Algorithmic skill vectoring matches student profiles to live recruiter openings with high precision accuracy.',
    tag: 'High Accuracy' 
  },
  { 
    icon: '✍️', 
    title: 'Custom Cover Letters', 
    desc: 'Generate tailored, professional pitch letters to hiring managers attached directly to your application.',
    tag: '1-Click Pitch'
  },
  { 
    icon: '🎤', 
    title: 'Real-Time AI Assistant', 
    desc: '24/7 Groq-powered career mentor ready to prep you for technical interviews, negotiate offers, and map skills.',
    tag: 'Groq Powered'
  },
  { 
    icon: '🗺️', 
    title: 'Interactive Application Tracker', 
    desc: 'Live step-by-step progress pipeline showing email deliveries, recruiter reviews, and shortlist notifications.',
    tag: 'Live Tracking'
  },
  { 
    icon: '📊', 
    title: 'Skill Gap Breakdown', 
    desc: 'Curated AI recommendations pin-pointing exactly which frameworks to learn to unlock tier-1 compensation.',
    tag: 'Career Growth'
  },
];

const slowFadeUp = {
  hidden: { opacity: 0, y: 35 },
  show: { opacity: 1, y: 0, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } },
};

const slowStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.25 } },
};

export default function Landing() {
  const isLoggedIn = !!localStorage.getItem('token');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 15,
      y: (clientY / innerHeight - 0.5) * 15,
    });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text-primary)', overflowX: 'hidden' }}
    >
      
      {/* ── CINEMATIC HERO SECTION WITH DYNAMIC THEME ENGINE ────────────── */}
      <section style={{ 
        paddingTop: '7rem', 
        paddingBottom: '9rem', 
        position: 'relative', 
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 25%, var(--surface) 0%, var(--bg) 65%, #030408 100%)' 
      }}>
        
        {/* Dynamic Theme Glow Halos (Uses var(--primary-light) & var(--border-glow)) */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '850px',
          height: '500px',
          background: 'radial-gradient(ellipse, var(--primary-light) 0%, rgba(139, 92, 246, 0.1) 45%, transparent 75%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          transition: 'background 0.5s ease'
        }} />
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          transition: 'background 0.5s ease'
        }} />
        
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '5%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          transition: 'background 0.5s ease'
        }} />

        {/* Subtle Star Particle Grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.35,
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1280px' }}>
          
          {/* Top Pill Announcement */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-green" style={{
              padding: '0.5rem 1.35rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              backdropFilter: 'blur(16px)',
              boxShadow: 'var(--shadow-glow)',
              transition: 'all 0.3s ease'
            }}>
              <span style={{ fontSize: '0.75rem' }}>✦</span> AI Placement & Recruiter Ecosystem
            </span>
          </motion.div>

          {/* 3-Column Storytelling Grid: Recruiter (Left) — Dynamic Theme Planet (Center) — Student (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.4fr 1.05fr', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* ── LEFT SIDE: RECRUITER ─────────────────── */}
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transform: `translate3d(${mousePos.x * -0.4}px, ${mousePos.y * -0.4}px, 0)` }}
            >
              <div style={{
                background: 'rgba(20, 23, 36, 0.85)',
                borderRadius: 24,
                padding: '2rem',
                border: '1px solid var(--border-glow)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7), var(--shadow-glow)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                transition: 'all 0.4s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span className="badge badge-blue" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}>🏢 Hiring Recruiter</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>Hiring Active</span>
                </div>

                <div style={{ display: 'flex', gap: '1.15rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <img 
                    src="/recruiter.jpg" 
                    alt="Corporate Recruiter" 
                    style={{ 
                      width: 64, 
                      height: 64, 
                      borderRadius: 16, 
                      objectFit: 'cover', 
                      border: '2px solid var(--primary)',
                      boxShadow: 'var(--shadow-glow)',
                      transition: 'border-color 0.3s ease'
                    }} 
                  />
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>Sarah Jenkins</h4>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.84375rem', margin: '0.2rem 0 0 0' }}>Senior Talent Partner • Microsoft</p>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 16, padding: '1.15rem', border: '1px solid var(--border)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84375rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Active Role Openings</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>18 Positions</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 700 }}>
                    ✉️ Custom Pitch Delivery Ready
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="skill-chip">SDE Intern</span>
                  <span className="skill-chip">AI Research</span>
                  <span className="skill-chip">$50/hr</span>
                </div>
              </div>
            </motion.div>

            {/* ── CENTER: THEME-ADAPTIVE 3D PLANET & TYPOGRAPHY ── */}
            <motion.div initial="hidden" animate="show" variants={slowStagger} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              
              {/* Detailed 3D Planet Asset (Adapts to Active Theme Variable) */}
              <div style={{ position: 'relative', width: 340, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)` }}>
                
                {/* Atmospheric Aura Halo */}
                <div style={{
                  position: 'absolute',
                  width: 360,
                  height: 360,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, var(--primary-light) 0%, var(--border-glow) 50%, transparent 80%)',
                  filter: 'blur(35px)',
                  pointerEvents: 'none',
                  transition: 'background 0.5s ease'
                }} />

                {/* 3D Planet Sphere (Gradients dynamically adapt to var(--primary) & var(--secondary)) */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 4, 0, -4, 0]
                  }}
                  transition={{ 
                    duration: 7, 
                    repeat: Infinity, 
                    ease: 'easeInOut' 
                  }}
                  style={{
                    width: 210,
                    height: 210,
                    borderRadius: '50%',
                    background: `
                      radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85) 0%, transparent 25%),
                      radial-gradient(circle at 75% 75%, rgba(5, 10, 25, 0.95) 0%, transparent 60%),
                      var(--gradient)
                    `,
                    boxShadow: '0 0 80px var(--border-glow), inset -22px -22px 60px rgba(0,0,0,0.9), inset 15px 15px 35px rgba(255,255,255,0.5)',
                    position: 'relative',
                    zIndex: 2,
                    overflow: 'hidden',
                    transition: 'box-shadow 0.5s ease, background 0.5s ease'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(ellipse at 40% 50%, rgba(255,255,255,0.3) 0%, transparent 60%), radial-gradient(circle at 70% 30%, var(--primary-light) 0%, transparent 50%)',
                    filter: 'contrast(120%)',
                    borderRadius: '50%'
                  }} />
                </motion.div>

                {/* Orbital Ring 1 (Uses var(--primary)) */}
                <motion.div
                  animate={{ rotateZ: 360 }}
                  transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    width: 350,
                    height: 350,
                    borderRadius: '50%',
                    border: '14px solid var(--primary)',
                    borderTopColor: '#ffffff',
                    borderBottomColor: 'var(--secondary)',
                    boxShadow: 'var(--shadow-glow), inset 0 0 30px var(--border-glow)',
                    transform: 'rotateX(72deg) rotateZ(-25deg)',
                    zIndex: 3,
                    pointerEvents: 'none',
                    transition: 'border-color 0.5s ease, box-shadow 0.5s ease'
                  }}
                />

                {/* Orbital Ring 2 (Dashed Counter-Rotation) */}
                <motion.div
                  animate={{ rotateZ: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    width: 380,
                    height: 380,
                    borderRadius: '50%',
                    border: '2px dashed var(--primary)',
                    transform: 'rotateX(65deg) rotateZ(35deg)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    transition: 'border-color 0.5s ease'
                  }}
                />

                {/* Orbiting Satellite Dot */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    width: 340,
                    height: 340,
                    borderRadius: '50%',
                    zIndex: 4,
                    pointerEvents: 'none'
                  }}
                >
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    boxShadow: 'var(--shadow-glow)',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    transition: 'background 0.5s ease'
                  }} />
                </motion.div>

              </div>

              {/* Main Headline (Theme Gradient Text) */}
              <motion.h1 variants={slowFadeUp} style={{ fontSize: 'clamp(2.75rem, 5vw, 4.25rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.035em', color: '#ffffff' }}>
                Connecting Talent with <br />
                <span className="gradient-text">
                  Opportunity.
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p variants={slowFadeUp} style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 580 }}>
                CareerPlanet is the next-generation AI ecosystem bridging top-tier Students and elite Recruiters with instant ATS scoring, custom pitches, and real-time status tracking.
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={slowFadeUp} style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {isLoggedIn ? (
                  <Link to="/jobs" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)', padding: '1rem 2.5rem', fontSize: '1.05rem', fontWeight: 800 }}>
                    Browse Opportunities →
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)', padding: '1rem 2.5rem', fontSize: '1.05rem', fontWeight: 800 }}>
                      Get Started Free
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg" style={{ borderRadius: 'var(--radius-full)', padding: '1rem 2.5rem', fontSize: '1.05rem', fontWeight: 800 }}>
                      Sign In to Account
                    </Link>
                  </>
                )}
              </motion.div>

            </motion.div>

            {/* ── RIGHT SIDE: STUDENT ─────────────────── */}
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)` }}
            >
              <div style={{
                background: 'rgba(20, 23, 36, 0.85)',
                borderRadius: 24,
                padding: '2rem',
                border: '1px solid var(--border-glow)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7), var(--shadow-glow)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                transition: 'all 0.4s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}>🎓 Verified Student</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>Ready to Join</span>
                </div>

                <div style={{ display: 'flex', gap: '1.15rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <img 
                    src="/student.jpg" 
                    alt="Student Candidate" 
                    style={{ 
                      width: 64, 
                      height: 64, 
                      borderRadius: 16, 
                      objectFit: 'cover', 
                      border: '2px solid var(--primary)',
                      boxShadow: 'var(--shadow-glow)',
                      transition: 'border-color 0.3s ease'
                    }} 
                  />
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>Arjun Sharma</h4>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.84375rem', margin: '0.2rem 0 0 0' }}>Computer Science • Tier-1 Institute</p>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 16, padding: '1.15rem', border: '1px solid var(--border)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84375rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>AI ATS Score</span>
                    <span style={{ color: 'var(--success)', fontWeight: 800 }}>98% Verified</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ width: '98%', height: '100%', background: 'var(--gradient)', borderRadius: '99px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="skill-chip">React.js</span>
                  <span className="skill-chip">FastAPI</span>
                  <span className="skill-chip">PyTorch</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Bottom Integrated Stats Bar */}
          <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', padding: '2rem 2.5rem', background: 'rgba(20, 23, 36, 0.65)', borderRadius: 24, border: '1px solid var(--border)', backdropFilter: 'blur(16px)', marginTop: '5.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: '0.84375rem', color: 'var(--text-tertiary)', marginTop: '0.35rem', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ── TOP COMPANIES ────────────────────────────── */}
      <section style={{ padding: '4.5rem 1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '0.84375rem', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5rem' }}>
            Trusted by top global tech companies & recruiters
          </p>
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={slowStagger}
            style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem' }}
          >
            {companies.map(c => (
              <motion.div key={c.name} variants={slowFadeUp}>
                <div className="glass-card" style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                  padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)',
                  cursor: 'default',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8125rem' }}>
                    {c.letter}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#f8fafc' }}>{c.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BENTO GRID AI FEATURES ──────────────────── */}
      <section style={{ padding: '8rem 1rem' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={slowStagger} style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <motion.span variants={slowFadeUp} className="badge badge-green" style={{ marginBottom: '1.25rem', display: 'inline-flex', padding: '0.45rem 1.25rem' }}>
              ✦ Platform Capabilities
            </motion.span>
            <motion.h2 variants={slowFadeUp} style={{ marginBottom: '1.25rem', fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', fontWeight: 800 }}>
              Everything you need to <span className="gradient-text">accelerate your career</span>
            </motion.h2>
            <motion.p variants={slowFadeUp} style={{ fontSize: '1.15rem', maxWidth: 600, margin: '0 auto', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              From intelligent resume scoring to automated email dispatches, CareerPlanet powers every step of placement.
            </motion.p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={slowStagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }}
          >
            {features.map((f, i) => (
              <motion.div 
                key={f.title} 
                variants={slowFadeUp} 
                className="glass-card" 
                style={{ 
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gridColumn: i === 0 || i === 3 ? 'span 2' : 'span 1'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>{f.icon}</div>
                    <span className="badge badge-indigo" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}>{f.tag}</span>
                  </div>
                  <h3 style={{ marginBottom: '0.85rem', fontSize: '1.35rem', color: '#ffffff', fontWeight: 800 }}>{f.title}</h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CALL TO ACTION ─────────────────────────── */}
      <section style={{ padding: '5rem 1rem 8rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              textAlign: 'center', padding: '6rem 2.5rem',
              background: 'linear-gradient(135deg, var(--primary-light) 0%, rgba(139, 92, 246, 0.15) 100%)',
              borderRadius: 36, color: 'white',
              border: '1px solid var(--border-glow)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), var(--shadow-glow)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', fontWeight: 900 }}>
              Ready to transform your career trajectory?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: 600, margin: '0 auto 3rem', lineHeight: 1.7 }}>
              Join thousands of candidates and tier-1 recruiters connecting seamlessly on CareerPlanet today.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)', padding: '1.15rem 3rem', fontSize: '1.1rem', fontWeight: 800 }}>
              Create Free Account →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '3rem 1rem', background: 'var(--bg-subtle)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 900, fontSize: '0.9rem' }}>C</div>
            <span style={{ fontWeight: 900, color: '#ffffff', fontSize: '1.1rem' }}>CareerPlanet</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>© 2026 CareerPlanet AI Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
