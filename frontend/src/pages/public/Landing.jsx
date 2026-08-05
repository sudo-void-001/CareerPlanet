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
  { value: '50,000+', label: 'Students placed' },
  { value: '1,200+', label: 'Companies hiring' },
  { value: '98%', label: 'Placement rate' },
  { value: '4.9★', label: 'Student rating' },
];

const features = [
  { icon: '🤖', title: 'AI Resume Analysis', desc: 'Get instant AI feedback on your resume with ATS score, skill gaps, and personalized recommendations.' },
  { icon: '🎯', title: 'Smart Job Matching', desc: 'Our AI matches you to jobs based on your skills, experience, and career goals with 90%+ accuracy.' },
  { icon: '✍️', title: 'Cover Letter Generator', desc: 'Generate tailored, professional cover letters in seconds for any job application.' },
  { icon: '🎤', title: 'Interview Prep', desc: 'Practice with AI-generated questions specific to the role and company you are applying for.' },
  { icon: '🗺️', title: 'Career Roadmap', desc: 'Get a personalized step-by-step plan to land your dream job based on your current skills.' },
  { icon: '📊', title: 'Skill Gap Analysis', desc: 'Instantly discover what skills you are missing and get curated learning recommendations.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Landing() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* ── HERO ────────────────────────────────────── */}
      <section style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.05) 0%, transparent 50%), var(--bg)',
        paddingTop: '5rem', paddingBottom: '4rem',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            {/* Left */}
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp}>
                <span className="badge badge-indigo" style={{ marginBottom: '1.25rem', display: 'inline-flex', gap: '0.375rem' }}>
                  <span>✦</span> AI-Powered Placement Platform
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.1 }}>
                Find opportunities.<br />
                <span className="gradient-text">Build your future.</span>
              </motion.h1>

              <motion.p variants={fadeUp} style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 480 }}>
                The smartest way to get placed. AI-powered resume analysis, personalized job matches, and interview prep — all in one platform.
              </motion.p>

              <motion.div variants={fadeUp} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                {isLoggedIn ? (
                  <Link to="/jobs" className="btn btn-primary btn-lg">Browse Jobs →</Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">Get started free</Link>
                    <Link to="/login" className="btn btn-secondary btn-lg">Sign in</Link>
                  </>
                )}
              </motion.div>

              <motion.div variants={fadeUp} style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {stats.map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Hero image */}
            <motion.div
              initial={{ opacity: 0, x: 32, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              style={{ position: 'relative' }}
            >
              <div style={{
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.14)',
                border: '4px solid white',
              }}>
                <img src="/hero.jpg" alt="Student working" style={{ width: '100%', display: 'block' }} />
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ── COMPANIES ───────────────────────────────── */}
      <section style={{ padding: '3rem 1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
            Top companies hiring on Career Planet
          </p>
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}
          >
            {companies.map(c => (
              <motion.div key={c.name} variants={fadeUp}>
                <div className="card-flat" style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.625rem 1rem', borderRadius: 'var(--radius-full)',
                  cursor: 'default',
                  transition: 'all 0.15s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.boxShadow = `0 0 0 3px ${c.color}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.6875rem' }}>
                    {c.letter}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{c.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── AI FEATURES ─────────────────────────────── */}
      <section style={{ padding: '5rem 1rem' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <motion.span variants={fadeUp} className="badge badge-violet" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              ✦ AI Features
            </motion.span>
            <motion.h2 variants={fadeUp} style={{ marginBottom: '1rem' }}>
              Your AI career partner,<br />
              <span className="gradient-text">always by your side</span>
            </motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize: '1.0625rem', maxWidth: 540, margin: '0 auto' }}>
              From resume to offer letter — AI handles the heavy lifting so you can focus on what matters.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}
          >
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.0625rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.65 }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section style={{ padding: '5rem 1rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              textAlign: 'center', padding: '4rem 2rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
              borderRadius: 28, color: 'white',
              boxShadow: '0 32px 80px rgba(99,102,241,0.35)',
            }}
          >
            <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
              Ready to land your dream job?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.0625rem', marginBottom: '2rem' }}>
              Join 50,000+ students already using Career Planet.
            </p>
            <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: '#6366f1', fontWeight: 700 }}>
              Start for free →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1rem', background: 'var(--surface)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>C</div>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>CareerPlanet</span>
          </div>
          <p style={{ fontSize: '0.875rem' }}>© 2026 Career Planet. Built for WebVerse Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}
