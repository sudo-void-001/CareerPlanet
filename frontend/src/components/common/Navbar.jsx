import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const THEMES = [
  { id: 'sunset', label: 'Funda Orange', color: '#f97316', desc: 'Warm orange accent' },
  { id: 'indigo', label: 'Indigo',       color: '#6366f1', desc: 'Classic purple' },
  { id: 'ocean',  label: 'Ocean Cyan',   color: '#0891b2', desc: 'Cool teal & cyan' },
  { id: 'forest', label: 'Forest Green', color: '#10b981', desc: 'Natural emerald' },
];

function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [current, setCurrent] = useState(() => localStorage.getItem('cv-theme') || 'sunset');

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const applyTheme = (id) => {
    setCurrent(id);
    localStorage.setItem('cv-theme', id);
    document.documentElement.setAttribute('data-theme', id);
    setOpen(false);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', current);
  }, [current]);

  const activeTheme = THEMES.find(t => t.id === current) || THEMES[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        title="Switch theme"
        style={{
          display: 'flex', alignItems: 'center', gap: '0.45rem',
          padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)',
          cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 700,
          color: '#ffffff', fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: activeTheme?.color, display: 'inline-block', flexShrink: 0, boxShadow: `0 0 8px ${activeTheme?.color}` }} />
        <span>{activeTheme?.label}</span>
        <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>▼</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
              background: '#141724', borderRadius: 16, border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)', padding: '0.5rem',
              minWidth: 180, zIndex: 999,
            }}
          >
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.625rem 0.375rem' }}>Select Theme</div>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => applyTheme(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  width: '100%', padding: '0.55rem 0.625rem', borderRadius: 10,
                  background: current === t.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: t.color, flexShrink: 0, boxShadow: `0 0 6px ${t.color}` }} />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: current === t.id ? 'var(--primary)' : '#ffffff' }}>{t.label}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{t.desc}</div>
                </div>
                {current === t.id && <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 800 }}>✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isIntroPage = location.pathname === '/';

  const token = localStorage.getItem('token');
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('hasResume');
    navigate('/login');
  };

  if (isAuthPage || isIntroPage) return null;

  const studentLinks = [
    { to: '/jobs', label: 'Find Jobs' },
    { to: '/applications', label: 'Applications' },
    { to: '/resume', label: 'AI Resume' },
    { to: '/profile/student', label: 'My Profile' },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: 'Dashboard' },
    { to: '/recruiter/profile', label: 'Company Profile' },
  ];

  const API_BASE = 'http://localhost:8000';
  const avatarUrl = user?.avatar_url ? `${API_BASE}${user.avatar_url}` : null;

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(9, 10, 15, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '4.25rem', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 900, fontSize: '1.05rem',
            boxShadow: 'var(--shadow-glow)'
          }}>C</div>
          <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Career<span style={{ color: 'var(--primary)' }}>Planet</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.25rem 0.375rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {!user || user.role === 'student' ? (
            studentLinks.map(l => (
              <NavLink key={l.to} to={l.to} active={location.pathname === l.to}>{l.label}</NavLink>
            ))
          ) : user.role === 'recruiter' ? (
            recruiterLinks.map(l => (
              <NavLink key={l.to} to={l.to} active={location.pathname === l.to}>{l.label}</NavLink>
            ))
          ) : (
            <NavLink to="/admin/dashboard" active={location.pathname.includes('admin')}>Admin Panel</NavLink>
          )}
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Theme Switcher Restoration */}
          <ThemeSwitcher />

          {token && user ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.3rem 0.875rem 0.3rem 0.3rem', background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 'var(--radius-full)', border: '1px solid rgba(255, 255, 255, 0.12)'
              }}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.full_name}
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--primary)' }}
                  />
                ) : (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800
                  }}>
                    {user.full_name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
                  {user.full_name?.split(' ')[0]}
                </span>
              </div>
              <button onClick={logout} className="btn btn-ghost btn-sm" style={{ color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-full)' }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" style={{ color: '#cbd5e1' }}>Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className="nav-link"
      style={active ? {
        color: 'var(--primary)',
        background: 'var(--primary-light)',
        fontWeight: 700,
        borderRadius: 'var(--radius-full)',
        padding: '0.45rem 1rem'
      } : {
        borderRadius: 'var(--radius-full)',
        padding: '0.45rem 1rem'
      }}
    >
      {children}
    </Link>
  );
}
