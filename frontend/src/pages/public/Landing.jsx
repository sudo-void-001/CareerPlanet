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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Landing() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      
      {/* ── HERO SECTION ────────────────────────────── */}
      <section className="hero-gradient" style={{ paddingTop: '6rem', paddingBottom: '6rem', position: 'relative' }}>
        
        {/* Glow ambient lights */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center' }}>
            
            {/* Left Content */}
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp}>
                <span className="badge badge-green" style={{ marginBottom: '1.5rem', display: 'inline-flex', gap: '0.5rem', padding: '0.4rem 1rem', fontSize: '0.8125rem' }}>
                  <span>✦</span> Next-Gen Placement Ecosystem
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                Land your dream job.<br />
                <span className="gradient-text">Powered by AI Intelligence.</span>
              </motion.h1>

              <motion.p variants={fadeUp} style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 520 }}>
                CareerPlanet bridges Students, Recruiters, and Colleges into one intelligent ecosystem. Instant ATS analysis, custom recruiter pitches, and automated status notifications.
              </motion.p>

              <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
                {isLoggedIn ? (
                  <Link to="/jobs" className="btn btn-primary btn-lg">
                    Browse Opportunities →
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      Get Started Free
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg">
                      Sign In to Account
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Stats Bar */}
              <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', padding: '1.5rem', background: 'rgba(19, 21, 31, 0.6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
                {stats.map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>{s.value}</div>
                    <div style={{ fontSize: '0.78125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Card Illustration Component */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'relative' }}
            >
              {/* Main Visual Glass Card */}
              <div style={{
                background: 'rgba(19, 21, 31, 0.85)',
                borderRadius: 28,
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 30px rgba(16, 185, 129, 0.15)',
                backdropFilter: 'blur(20px)',
              }}>
                {/* Header Mockup Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.75rem', borderRadius: 99, fontWeight: 700 }}>
                    AI Match Engine Active
                  </span>
                </div>

                {/* Hero Showcase Mock Card 1 */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 16, padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #00a4ef, #0078d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>M</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Software Engineer Intern</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Microsoft • Redmond, WA</div>
                      </div>
                    </div>
                    <span className="badge badge-green">94% AI Match</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="skill-chip">React</span>
                    <span className="skill-chip">FastAPI</span>
                    <span className="skill-chip">Python</span>
                    <span className="skill-chip">$45/hr</span>
                  </div>
                </div>

                {/* Hero Showcase Mock Card 2 */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 16, padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #34a853, #1e8e3e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>G</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>AI Research Associate</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Google • Mountain View, CA</div>
                      </div>
                    </div>
                    <span className="badge badge-blue">Shortlisted 🌟</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="skill-chip">PyTorch</span>
                    <span className="skill-chip">NLP</span>
                    <span className="skill-chip">LLMs</span>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── TOP COMPANIES ────────────────────────────── */}
      <section style={{ padding: '3.5rem 1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>
            Trusted by top global companies & high-growth startups
          </p>
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.25rem' }}
          >
            {companies.map(c => (
              <motion.div key={c.name} variants={fadeUp}>
                <div className="glass-card" style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-full)',
                  cursor: 'default',
                }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.75rem' }}>
                    {c.letter}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.90625rem', color: '#f8fafc' }}>{c.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BENTO GRID AI FEATURES ──────────────────── */}
      <section style={{ padding: '6rem 1rem' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <motion.span variants={fadeUp} className="badge badge-green" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              ✦ Platform Capabilities
            </motion.span>
            <motion.h2 variants={fadeUp} style={{ marginBottom: '1rem' }}>
              Everything you need to <span className="gradient-text">accelerate your career</span>
            </motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize: '1.1rem', maxWidth: 560, margin: '0 auto', color: 'var(--text-secondary)' }}>
              From intelligent resume scoring to automated email dispatches, CareerPlanet powers every step of placement.
            </motion.p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}
          >
            {features.map((f, i) => (
              <motion.div 
                key={f.title} 
                variants={fadeUp} 
                className="glass-card" 
                style={{ 
                  padding: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gridColumn: i === 0 || i === 3 ? 'span 2' : 'span 1'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '2.25rem' }}>{f.icon}</div>
                    <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>{f.tag}</span>
                  </div>
                  <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', color: '#ffffff' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CALL TO ACTION ─────────────────────────── */}
      <section style={{ padding: '4rem 1rem 6rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: 'center', padding: '5rem 2rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 50%, rgba(139, 92, 246, 0.15) 100%)',
              borderRadius: 32, color: 'white',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(16, 185, 129, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <h2 style={{ color: 'white', marginBottom: '1.25rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Ready to transform your career trajectory?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '2.5rem', maxWidth: 560, margin: '0 auto 2.5rem' }}>
              Join thousands of candidates and tier-1 recruiters connecting seamlessly on CareerPlanet today.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2.5rem 1rem', background: 'var(--bg-subtle)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: '0.85rem' }}>C</div>
            <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.05rem' }}>CareerPlanet</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>© 2026 CareerPlanet AI Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
