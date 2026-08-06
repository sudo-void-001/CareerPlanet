import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Intro() {
  const navigate = useNavigate();
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // Luxurious Slow Motion Sequence Stages:
    // 0: Black screen
    // 1: Earth appears BIG in exact screen center
    // 2: Cyber orbital rings ignite in slow motion
    // 3: Earth smoothly scales down to center fit, side photos & typography reveal
    const timer1 = setTimeout(() => setAnimationStage(1), 500);
    const timer2 = setTimeout(() => setAnimationStage(2), 2200);
    const timer3 = setTimeout(() => setAnimationStage(3), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleExplore = () => {
    navigate('/home');
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'var(--bg)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      padding: '2rem',
      transition: 'background 0.5s ease'
    }}>
      
      {/* ── MULTI-COLOR AMBIENT LIGHTS & CYBER MATRIX BACKGROUND ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 50% 35%, var(--primary-light) 0%, transparent 60%),
          radial-gradient(circle at 15% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 85% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 50% 85%, var(--border-glow) 0%, transparent 60%)
        `,
        pointerEvents: 'none',
        zIndex: 0,
        transition: 'background 0.5s ease'
      }} />

      {/* Cyber Grid Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        opacity: 0.35,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* ── MAIN CENTERED CONTAINER ─────────────────────────────────── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1380px',
        margin: '0 auto'
      }}>
        
        {/* 3-Column Layout when animationStage >= 3 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: animationStage >= 3 ? '300px 1fr 300px' : '0px 1fr 0px',
          gap: animationStage >= 3 ? '3rem' : '0px',
          alignItems: 'center',
          width: '100%',
          transition: 'grid-template-columns 1.8s cubic-bezier(0.16, 1, 0.3, 1), gap 1.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          
          {/* ── LEFT SIDE: RECRUITER PHOTO ──────────────── */}
          <div style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            <AnimatePresence>
              {animationStage >= 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -90, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: '100%' }}
                >
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: 400,
                    borderRadius: 24,
                    overflow: 'hidden',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-glow), inset 0 0 20px rgba(255,255,255,0.05)',
                    background: 'var(--surface-2)',
                    transition: 'border-color 0.4s ease, box-shadow 0.4s ease'
                  }}>
                    <img 
                      src="/cinematic-recruiter.jpg" 
                      alt="Recruiter Hiring Partner" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(5, 8, 18, 0.95) 0%, rgba(5, 8, 18, 0.25) 60%, transparent 100%)'
                    }} />
                    <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, textAlign: 'left' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.75rem', marginBottom: '0.4rem', display: 'inline-block' }}>🏢 Recruiter / Hiring</span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Sarah Jenkins</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Tech Hiring Director</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── CENTER: CYBER EARTH & SLOW-MO TYPOGRAPHY ───────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', margin: '0 auto' }}>
            
            {/* Cyber Earth Sphere (Centered starting position) */}
            <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', margin: '0 auto 2rem auto' }}>
              
              {/* Atmospheric Glow */}
              <div style={{
                position: 'absolute',
                width: 330,
                height: 330,
                borderRadius: '50%',
                background: 'radial-gradient(circle, var(--primary-light) 0%, rgba(139, 92, 246, 0.35) 45%, transparent 80%)',
                filter: 'blur(35px)',
                pointerEvents: 'none',
                transition: 'background 0.5s ease'
              }} />

              {/* Cyber Earth Sphere */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  animationStage === 1
                    ? { scale: 2.3, opacity: 1 }
                    : animationStage === 2
                    ? { scale: 1.5, opacity: 1 }
                    : { scale: 1.0, opacity: 1 }
                }
                transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: '50%',
                  background: `
                    radial-gradient(circle at 35% 35%, rgba(255,255,255,0.75) 0%, transparent 30%),
                    radial-gradient(circle at 70% 75%, rgba(2, 6, 23, 0.95) 0%, transparent 60%),
                    var(--gradient)
                  `,
                  boxShadow: '0 0 80px var(--border-glow), inset -22px -22px 55px rgba(0,0,0,0.85), inset 15px 15px 35px rgba(255,255,255,0.5)',
                  position: 'relative',
                  zIndex: 2,
                  overflow: 'hidden',
                  transition: 'background 0.5s ease, box-shadow 0.5s ease'
                }}
              >
                {/* Earth Texture Lines */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%), linear-gradient(0deg, rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
                  backgroundSize: '100% 100%, 100% 20px',
                  borderRadius: '50%',
                  filter: 'contrast(130%)'
                }} />
              </motion.div>

              {/* Cyber Ring 1 (Uses var(--primary)) */}
              <AnimatePresence>
                {animationStage >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.3, rotateX: 75, rotateZ: -25 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 75, rotateZ: -25 }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: 'absolute',
                      width: 300,
                      height: 300,
                      borderRadius: '50%',
                      border: '12px solid var(--primary)',
                      borderTopColor: '#ffffff',
                      borderBottomColor: 'var(--secondary)',
                      boxShadow: 'var(--shadow-glow), inset 0 0 30px var(--border-glow)',
                      zIndex: 3,
                      pointerEvents: 'none',
                      transition: 'border-color 0.5s ease, box-shadow 0.5s ease'
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Cyber Ring 2 (Counter Rotation) */}
              {animationStage >= 2 && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    width: 330,
                    height: 330,
                    borderRadius: '50%',
                    border: '2px dashed var(--primary)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    transition: 'border-color 0.5s ease'
                  }}
                />
              )}

            </div>

            {/* ── SLOW MOTION TYPOGRAPHY & BRANDING ────────────────────────── */}
            <AnimatePresence>
              {animationStage >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%' }}
                >
                  
                  {/* Website Name */}
                  <h1 style={{
                    fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.05,
                    margin: 0,
                    background: 'var(--gradient-text-color)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 35px var(--border-glow))'
                  }}>
                    CareerPlanet
                  </h1>

                  {/* Tagline */}
                  <p style={{
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
                    fontWeight: 700,
                    margin: 0,
                    letterSpacing: '0.02em',
                    color: 'var(--text-secondary)'
                  }}>
                    Where Talent Meets Opportunity
                  </p>

                  {/* Accent Line */}
                  <div style={{ width: 100, height: 3, background: 'var(--gradient)', borderRadius: '99px', margin: '0.25rem 0' }} />

                  {/* Company Branding & Custom Nexus Logo */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 1.35rem',
                      background: 'rgba(15, 23, 42, 0.85)',
                      borderRadius: '9999px',
                      border: '1px solid var(--border-glow)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
                    }}
                  >
                    <div style={{ width: 28, height: 28, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 26L16 6L26 26" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11 16H21" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round"/>
                        <circle cx="16" cy="6" r="3" fill="var(--primary)"/>
                      </svg>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.71875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, lineHeight: 1 }}>Engineered By</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em', marginTop: '2px' }}>Nexus Labs.co</div>
                    </div>
                  </motion.div>

                  {/* Founders Badges */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginTop: '0.25rem',
                      flexWrap: 'wrap',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Founders:</span>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        padding: '0.35rem 0.95rem',
                        background: 'var(--primary-light)',
                        border: '1px solid var(--border-glow)',
                        borderRadius: '9999px',
                        boxShadow: 'var(--shadow-glow)'
                      }}>
                        1. Rajesh Pattan
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        padding: '0.35rem 0.95rem',
                        background: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        borderRadius: '9999px',
                        boxShadow: '0 4px 14px rgba(168, 85, 247, 0.2)'
                      }}>
                        2. Shreyas Patil
                      </span>
                    </div>
                  </motion.div>

                  {/* Explore Button */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    style={{ marginTop: '1.5rem' }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.06, boxShadow: 'var(--shadow-glow)' }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleExplore}
                      className="btn btn-primary btn-lg"
                      style={{
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.875rem 2.5rem',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        letterSpacing: '0.02em'
                      }}
                    >
                      <span>Explore Platform</span>
                      <span style={{ fontSize: '1rem' }}>→</span>
                    </motion.button>
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ── RIGHT SIDE: STUDENT PHOTO ──────────────── */}
          <div style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            <AnimatePresence>
              {animationStage >= 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 90, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: '100%' }}
                >
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: 400,
                    borderRadius: 24,
                    overflow: 'hidden',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-glow), inset 0 0 20px rgba(255,255,255,0.05)',
                    background: 'var(--surface-2)',
                    transition: 'border-color 0.4s ease, box-shadow 0.4s ease'
                  }}>
                    <img 
                      src="/cinematic-student.jpg" 
                      alt="Student Candidate" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(5, 8, 18, 0.95) 0%, rgba(5, 8, 18, 0.25) 60%, transparent 100%)'
                    }} />
                    <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, textAlign: 'left' }}>
                      <span className="badge badge-green" style={{ fontSize: '0.75rem', marginBottom: '0.4rem', display: 'inline-block' }}>🎓 Student / Candidate</span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Arjun Sharma</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 700 }}>98% AI ATS Score Verified</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
