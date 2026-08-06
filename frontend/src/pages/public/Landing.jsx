import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const companies = [
  { name: 'Microsoft', color: '#000000', letter: 'M' },
  { name: 'Google', color: '#1a1a1a', letter: 'G' },
  { name: 'Amazon', color: '#0a0a0a', letter: 'A' },
  { name: 'Adobe', color: '#171717', letter: 'Ad' },
  { name: 'Infosys', color: '#0f0f0f', letter: 'I' },
  { name: 'TCS', color: '#121212', letter: 'T' },
  { name: 'Deloitte', color: '#141414', letter: 'D' },
  { name: 'Airtel', color: '#000000', letter: 'Ai' },
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
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
};

const slowStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

export default function Landing() {
  const isLoggedIn = !!localStorage.getItem('token');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scalePlanet = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
    });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text-primary)', overflowX: 'hidden' }}
    >
      
      {/* ── CINEMATIC HERO SECTION ────────────── */}
      <section style={{ 
        position: 'relative', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--bg)' 
      }}>
        
        {/* Cinematic Imagery (Left: Recruiter, Right: Student) Blended with Gradients */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}>
          {/* Left Recruiter Image */}
          <div style={{
            width: '50vw',
            height: '100%',
            backgroundImage: 'url(/cinematic-recruiter.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 100%)',
          }} />
          
          {/* Right Student Image */}
          <div style={{
            width: '50vw',
            height: '100%',
            backgroundImage: 'url(/cinematic-student.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center left',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 100%)',
          }} />
        </div>

        {/* Central Shadow/Fade Mask to ensure text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, var(--bg) 70%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Ambient Lighting & Particles */}
        <div className="ambient-glow" style={{ zIndex: 2 }} />

        {/* Subtle Star Particle Grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.2,
          pointerEvents: 'none',
          zIndex: 2
        }} />

        {/* Massive Planet (Centered Background) */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            x: '-50%', 
            y: '-50%',
            scale: scalePlanet,
            zIndex: 3,
            pointerEvents: 'none',
            transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)`
          }}
        >
          <div style={{ position: 'relative', width: 600, height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Planet Glow */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 50%, transparent 70%)',
              filter: 'blur(40px)',
              animation: 'pulse-glow 4s ease-in-out infinite'
            }} />

            {/* Main Sphere */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 380,
                height: 380,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #333333 0%, #000000 70%)',
                boxShadow: 'inset 25px 25px 50px rgba(255,255,255,0.2), inset -30px -30px 60px rgba(0,0,0,1), 0 0 60px rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Craters/Texture */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.1%22/%3E%3C/svg%3E")',
                mixBlendMode: 'overlay',
                opacity: 0.5
              }} />
            </motion.div>

            {/* Orbital Rings */}
            <motion.div
              animate={{ rotateX: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: 650,
                height: 650,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                borderTop: '2px solid rgba(255,255,255,0.4)',
                transform: 'rotateX(75deg) rotateZ(-15deg)',
                pointerEvents: 'none'
              }}
            />
            <motion.div
              animate={{ rotateZ: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: 700,
                height: 700,
                borderRadius: '50%',
                border: '1px dashed rgba(255,255,255,0.15)',
                transform: 'rotateX(70deg) rotateY(20deg)',
                pointerEvents: 'none'
              }}
            />
          </div>
        </motion.div>

        <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '4rem' }}>
          
          {/* Main Hero Layout: Center focused with massive planet */}
          <motion.div initial="hidden" animate="show" variants={slowStagger} style={{ y: yHeroText, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Top Badge */}
            <motion.div variants={slowFadeUp} style={{ marginBottom: '2rem' }}>
              <span className="badge" style={{
                padding: '0.5rem 1.5rem',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: 'var(--shadow-glow)',
                color: '#ffffff'
              }}>
                ✦ AI-Powered Placement Ecosystem
              </span>
            </motion.div>
            
            {/* Redesigned header spacer */}

            {/* Typography */}
            <motion.h1 variants={slowFadeUp} style={{ 
              fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', 
              fontWeight: 800, 
              lineHeight: 1, 
              letterSpacing: '-0.04em', 
              color: '#ffffff',
              textShadow: '0 10px 40px rgba(0,0,0,0.8)',
              marginTop: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              Where Talent <br />
              <span style={{ color: 'var(--text-secondary)' }}>Meets Opportunity.</span>
            </motion.h1>

            <motion.p variants={slowFadeUp} style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-secondary)', 
              lineHeight: 1.6, 
              marginBottom: '3rem', 
              maxWidth: 640,
              textShadow: '0 4px 20px rgba(0,0,0,0.8)'
            }}>
              CareerPlanet is the premier ecosystem bridging elite students and top-tier recruiters with real-time AI matching, ATS scoring, and seamless tracking.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={slowFadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 20 }}>
              {isLoggedIn ? (
                <Link to="/jobs" className="btn btn-primary btn-lg" style={{ padding: '1rem 2.5rem' }}>
                  Browse Opportunities
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg" style={{ padding: '1rem 2.5rem' }}>
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-lg" style={{ padding: '1rem 2.5rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── STATS SECTION (Glassmorphism overlap) ────────────── */}
      <section style={{ position: 'relative', zIndex: 20, marginTop: '0rem', padding: '0 1rem' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1px', 
              background: 'var(--border)', 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            {stats.map(s => (
              <div key={s.label} style={{ background: 'var(--surface)', padding: '3rem 2rem', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TOP COMPANIES ────────────────────────────── */}
      <section style={{ padding: '8rem 1rem 6rem' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '3rem' }}>
            Trusted by hiring teams at
          </p>
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={slowStagger}
            style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2.5rem', opacity: 0.7 }}
          >
            {companies.map(c => (
              <motion.div key={c.name} variants={slowFadeUp} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', filter: 'grayscale(100%)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--surface-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {c.letter}
                </div>
                <span style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-secondary)', letterSpacing: '-0.02em' }}>{c.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BENTO GRID AI FEATURES ──────────────────── */}
      <section style={{ padding: '6rem 1rem' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={slowStagger} style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <motion.h2 variants={slowFadeUp} style={{ marginBottom: '1.5rem', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
              Everything you need to <br /><span style={{ color: 'var(--text-secondary)' }}>accelerate your career.</span>
            </motion.h2>
          </motion.div>

          {/* Premium Bento Grid */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={slowStagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}
          >
            {features.map((f, i) => (
              <motion.div 
                key={f.title} 
                variants={slowFadeUp} 
                className="glass-card" 
                style={{ 
                  padding: '3rem 2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gridColumn: i === 0 || i === 3 ? 'span 2' : 'span 1',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                  <div style={{ fontSize: '2.5rem', background: 'var(--surface-3)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)' }}>{f.icon}</div>
                  <span className="badge" style={{ background: 'var(--surface-3)' }}>{f.tag}</span>
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CALL TO ACTION ─────────────────────────── */}
      <section style={{ padding: '6rem 1rem 8rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              textAlign: 'center', padding: '8rem 2rem',
              background: 'radial-gradient(ellipse at top, var(--surface-2) 0%, var(--surface) 100%)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Glow */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />

            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: 'clamp(2.5rem, 5vw, 4rem)', position: 'relative', zIndex: 1 }}>
              Ready to transform your <br/> career trajectory?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '3.5rem', maxWidth: 600, margin: '0 auto 3.5rem', position: 'relative', zIndex: 1 }}>
              Join thousands of candidates and tier-1 recruiters connecting seamlessly on CareerPlanet today.
            </p>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ padding: '1rem 3rem' }}>
                Create Free Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '4rem 1rem', background: 'var(--bg)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg)', fontWeight: 800, fontSize: '1rem' }}>C</div>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.25rem', letterSpacing: '-0.02em' }}>CareerPlanet</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>© 2026 CareerPlanet. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
