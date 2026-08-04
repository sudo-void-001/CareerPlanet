import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const THEMES = [
  { id: 'indigo', label: 'Indigo',  color: '#6366f1', desc: 'Classic purple' },
  { id: 'ocean',  label: 'Ocean',   color: '#0891b2', desc: 'Cool teal' },
  { id: 'sunset', label: 'Sunset',  color: '#f97316', desc: 'Warm orange' },
  { id: 'forest', label: 'Forest',  color: '#059669', desc: 'Natural green' },
];

function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [current, setCurrent] = useState(() => localStorage.getItem('cv-theme') || 'indigo');

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

  const activeTheme = THEMES.find(t => t.id === current);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        title="Switch theme"
        style={{
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          padding: '0.375rem 0.625rem', borderRadius: 'var(--radius-full)',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
          color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif',
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: activeTheme?.color, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ display: 'none' }} className="theme-label">{activeTheme?.label}</span>
        🎨
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
              background: 'white', borderRadius: 14, border: '1px solid var(--border)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.12)', padding: '0.5rem',
              minWidth: 160, zIndex: 999,
            }}
          >
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.5rem 0.375rem' }}>Theme</div>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => applyTheme(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  width: '100%', padding: '0.5rem 0.625rem', borderRadius: 10,
                  background: current === t.id ? 'var(--primary-light)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif',
                }}
              >
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: t.color, border: current === t.id ? `2px solid ${t.color}` : '2px solid transparent', outline: current === t.id ? `2px solid ${t.color}40` : 'none', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: current === t.id ? 'var(--primary)' : 'var(--text-primary)' }}>{t.label}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{t.desc}</div>
                </div>
                {current === t.id && <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: '0.875rem' }}>✓</span>}
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

  const token = localStorage.getItem('token');
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('hasResume');
    navigate('/login');
  };

  if (isAuthPage) return null;

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
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,250,250,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(229,231,235,0.7)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '4rem', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'var(--gradient, linear-gradient(135deg, #6366f1, #8b5cf6))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem'
          }}>C</div>
          <span style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Career<span style={{ color: 'var(--primary)' }}>Planet</span>
          </span>
        </Link>

        {/* Center links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <ThemeSwitcher />
          {token && user ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.25rem 0.75rem 0.25rem 0.25rem', background: 'var(--surface-2)',
                borderRadius: 'var(--radius-full)', border: '1px solid var(--border)'
              }}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.full_name}
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }}
                  />
                ) : (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient, linear-gradient(135deg, #6366f1, #8b5cf6))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.6875rem', fontWeight: 700
                  }}>
                    {user.full_name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.full_name?.split(' ')[0]}
                </span>
              </div>
              <button onClick={logout} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
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
        fontWeight: 600,
      } : {}}
    >
      {children}
    </Link>
  );
}
